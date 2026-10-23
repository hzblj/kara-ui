'use client'

import {usePathname, useRouter} from 'next/navigation'
import {type KeyboardEvent, type ReactNode, useEffect, useId, useMemo, useRef, useState} from 'react'
import {createPortal} from 'react-dom'
import {tv} from 'tailwind-variants'

import {track} from '../../analytics/track'
import {ComponentIcon, HashIcon, PageIcon, SearchIcon} from '../../ui/icons'
import {cn} from '../../ui/utils'
import {normalize, type SearchTarget, search, toTargets} from './search'
import type {SearchEntry, SearchKind} from './search-index'

/** What a trigger dispatches on `window`: one dialog for the page, however many fields open it. */
export const OPEN_SEARCH_EVENT = 'kara:open-search'

/** As long as the closing transition, so the panel is gone before it unmounts. */
const CLOSE_MS = 160

const searchDialog = tv({
  slots: {
    backdrop:
      'absolute inset-0 cursor-pointer bg-black/40 backdrop-blur-[3px] transition-opacity duration-200 motion-reduce:transition-none',
    empty: 'grid justify-items-center gap-1.5 px-6 py-12 text-center',
    emptyHint: 'text-[13px] text-content-tertiary',
    emptyTitle: 'text-sm font-semibold text-content-primary',
    footer:
      'flex items-center gap-4 border-t border-border-secondary px-4 py-2.5 text-[11px] text-content-tertiary max-[560px]:hidden',
    footerHint: 'flex items-center gap-1.5',
    header: 'flex h-14 items-center gap-3 border-b border-border-secondary px-4',
    headerIcon: 'size-[18px] shrink-0 text-content-tertiary',
    input:
      'h-full min-w-0 flex-1 bg-transparent text-[15px] text-content-primary outline-none placeholder:text-content-quaternary [&::-webkit-search-cancel-button]:hidden',
    kbd: 'inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-border-secondary bg-surface-secondary px-1.5 font-sans text-[10px] font-semibold text-content-tertiary',
    list: 'max-h-[min(440px,58vh)] overflow-y-auto overscroll-contain p-2 [scrollbar-color:var(--color-gray-5)_transparent] [scrollbar-width:thin]',
    listLabel: 'px-3 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-content-tertiary',
    mark: 'rounded-[3px] bg-fill-accent-soft text-content-accent',
    option: 'flex cursor-pointer items-center gap-3 rounded-[10px] px-3 py-2.5 transition-colors duration-75',
    optionActive: 'bg-fill-secondary-hover',
    optionContext: 'shrink-0 text-[11px] font-medium text-content-quaternary max-[560px]:hidden',
    optionDetail: 'truncate text-[12.5px] leading-5 text-content-tertiary',
    optionIcon:
      'flex size-8 shrink-0 items-center justify-center rounded-lg border border-border-secondary bg-surface-secondary text-content-secondary',
    optionIconActive: 'border-fill-accent-primary/30 bg-fill-accent-soft text-content-accent',
    optionText: 'grid min-w-0 flex-1',
    optionTitle: 'truncate text-sm font-medium leading-5 text-content-primary',
    panel:
      'relative flex w-full max-w-[620px] flex-col overflow-hidden rounded-2xl border border-border-secondary bg-surface-elevated shadow-card-elevated transition-[opacity,transform] motion-reduce:transition-none',
    panelClosed: 'translate-y-2 scale-[0.96] opacity-0 duration-150 ease-[cubic-bezier(.4,0,1,1)]',
    panelOpen: 'translate-y-0 scale-100 opacity-100 duration-200 ease-[cubic-bezier(.2,.8,.2,1)]',
    viewport: 'fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[min(16vh,140px)] max-[560px]:pt-4',
  },
})

const styles = searchDialog()

const KIND_ICON: Record<SearchKind, (props: {className?: string}) => ReactNode> = {
  component: ComponentIcon,
  guide: PageIcon,
  section: HashIcon,
}

/** The first place one of the query's terms appears in the title, marked: what the eye looks for in a result. */
const Highlighted = ({query, text}: {query: string; text: string}) => {
  const haystack = normalize(text)
  const hit = normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .map(term => ({at: haystack.indexOf(term), term}))
    .filter(({at}) => at >= 0)
    .sort((a, b) => a.at - b.at || b.term.length - a.term.length)[0]

  if (!hit) {
    return <>{text}</>
  }

  return (
    <>
      {text.slice(0, hit.at)}
      <mark className={styles.mark()}>{text.slice(hit.at, hit.at + hit.term.length)}</mark>
      {text.slice(hit.at + hit.term.length)}
    </>
  )
}

/** Typing is not a shortcut: `/` goes into a field that has the focus. */
const isEditable = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || /^(input|textarea|select)$/i.test(target.tagName))

/**
 * The docs' search: a dialog that rises in the middle of the page over a blurred backdrop, opened by any
 * `SearchTrigger`, ⌘K / Ctrl+K, or `/`. It searches the components (name, summary, exports, what each platform
 * renders, the notes), the guides and their sections, all on the client; arrows move, Enter opens, Escape closes.
 */
export const SearchDialog = ({entries}: {entries: SearchEntry[]}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isShown, setIsShown] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  // The document-wide shortcut is registered once, so it reads these rather than a render's state.
  const isOpenRef = useRef(false)
  const closing = useRef<number | undefined>(undefined)
  const pathname = usePathname()
  const router = useRouter()
  const listId = useId()

  const targets = useMemo(() => toTargets(entries), [entries])
  const suggestions = useMemo(() => targets.filter(target => target.kind === 'guide'), [targets])
  const results = useMemo(() => (query.trim() ? search(targets, query) : suggestions), [query, suggestions, targets])

  const open = () => {
    window.clearTimeout(closing.current)
    if (!isOpenRef.current) {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    }
    isOpenRef.current = true
    setIsOpen(true)
  }

  const close = () => {
    isOpenRef.current = false
    setIsShown(false)
    closing.current = window.setTimeout(() => setIsOpen(false), CLOSE_MS)
    returnFocus.current?.focus({preventScroll: true})
  }

  const choose = (target: SearchTarget | undefined) => {
    if (!target) {
      return
    }

    if (query.trim()) {
      track('search', {result: target.href, search_term: query.trim()})
    }

    close()
    router.push(target.href)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: `open` and `close` touch only refs and state setters
  useEffect(() => {
    setIsMounted(true)

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        if (isOpenRef.current) {
          close()
        } else {
          open()
        }
      } else if (event.key === '/' && !isEditable(event.target)) {
        event.preventDefault()
        open()
      }
    }

    window.addEventListener(OPEN_SEARCH_EVENT, open)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener(OPEN_SEARCH_EVENT, open)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  // Opened: shown a frame later, so the panel has a closed state to rise from, with the last query selected.
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const frame = window.requestAnimationFrame(() => {
      setIsShown(true)
      inputRef.current?.focus({preventScroll: true})
      inputRef.current?.select()
    })

    return () => {
      window.cancelAnimationFrame(frame)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  // A navigation closes it, a section on the same page included.
  // biome-ignore lint/correctness/useExhaustiveDependencies: the path is the trigger, not an input
  useEffect(() => {
    isOpenRef.current = false
    setIsShown(false)
    setIsOpen(false)
  }, [pathname])

  // biome-ignore lint/correctness/useExhaustiveDependencies: a new query starts at the top
  useEffect(() => {
    setActive(0)
    listRef.current?.scrollTo({top: 0})
  }, [query])

  // biome-ignore lint/correctness/useExhaustiveDependencies: the active option is read from the DOM it just marked
  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({block: 'nearest'})
  }, [active])

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActive(index => (results.length === 0 ? 0 : (index + step + results.length) % results.length))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      choose(results[active])
    } else if (event.key === 'Escape') {
      event.preventDefault()
      close()
    }
  }

  if (!isMounted || !isOpen) {
    return null
  }

  const optionId = (index: number) => `${listId}-${index}`

  return createPortal(
    <div className={styles.viewport()}>
      <div
        aria-hidden="true"
        className={cn(styles.backdrop(), isShown ? 'opacity-100' : 'opacity-0')}
        onClick={close}
      />
      <div
        aria-label="Search the documentation"
        aria-modal="true"
        className={cn(styles.panel(), isShown ? styles.panelOpen() : styles.panelClosed())}
        role="dialog"
      >
        <div className={styles.header()}>
          <SearchIcon className={styles.headerIcon()} />
          <input
            aria-activedescendant={results.length > 0 ? optionId(active) : undefined}
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded="true"
            autoComplete="off"
            className={styles.input()}
            onChange={event => setQuery(event.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search components and guides…"
            ref={inputRef}
            role="combobox"
            spellCheck={false}
            type="search"
            value={query}
          />
          <kbd className={styles.kbd()}>esc</kbd>
        </div>

        <div className={styles.list()} id={listId} ref={listRef} role="listbox">
          {query.trim() ? null : <p className={styles.listLabel()}>Guides</p>}
          {results.length === 0 ? (
            <div className={styles.empty()}>
              <p className={styles.emptyTitle()}>Nothing for “{query.trim()}”</p>
              <p className={styles.emptyHint()}>Try a component’s name, a prop, or what it renders, like “Compose”.</p>
            </div>
          ) : (
            results.map((target, index) => {
              const Icon = KIND_ICON[target.kind]
              const isActive = index === active

              return (
                <div
                  aria-selected={isActive}
                  className={cn(styles.option(), isActive && styles.optionActive())}
                  id={optionId(index)}
                  key={target.href}
                  onClick={() => choose(target)}
                  onMouseMove={() => setActive(index)}
                  role="option"
                  tabIndex={-1}
                >
                  <span className={cn(styles.optionIcon(), isActive && styles.optionIconActive())}>
                    <Icon className="size-4" />
                  </span>
                  <span className={styles.optionText()}>
                    <span className={styles.optionTitle()}>
                      <Highlighted query={query} text={target.title} />
                    </span>
                    {target.detail ? <span className={styles.optionDetail()}>{target.detail}</span> : null}
                  </span>
                  <span className={styles.optionContext()}>{target.context}</span>
                </div>
              )
            })
          )}
        </div>

        <div className={styles.footer()}>
          <span className={styles.footerHint()}>
            <kbd className={styles.kbd()}>↑</kbd>
            <kbd className={styles.kbd()}>↓</kbd>
            to move
          </span>
          <span className={styles.footerHint()}>
            <kbd className={styles.kbd()}>↵</kbd>
            to open
          </span>
          <span className={styles.footerHint()}>
            <kbd className={styles.kbd()}>esc</kbd>
            to close
          </span>
        </div>
      </div>
    </div>,
    document.body
  )
}
