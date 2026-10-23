'use client'

import {useEffect, useState} from 'react'
import {tv} from 'tailwind-variants'

import {SearchIcon} from '../../ui/icons'
import {OPEN_SEARCH_EVENT} from './search-dialog'

const searchTrigger = tv({
  slots: {
    field:
      'group flex h-9 w-full cursor-pointer items-center gap-2 rounded-[10px] border border-border-secondary bg-surface-secondary px-2.5 text-left text-[13px] text-content-tertiary shadow-card-default transition-colors hover:border-border-primary hover:bg-fill-secondary-hover hover:text-content-secondary',
    fieldIcon: 'size-[15px] shrink-0',
    fieldLabel: 'min-w-0 flex-1 truncate',
    icon: 'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border-secondary bg-fill-secondary-primary text-content-secondary shadow-card-default transition-colors hover:bg-fill-secondary-hover hover:text-content-primary',
    kbd: 'inline-flex h-5 items-center rounded-[5px] border border-border-secondary bg-surface-primary px-1.5 font-sans text-[10px] font-semibold text-content-tertiary',
  },
})

const styles = searchTrigger()

const openSearch = () => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT))

/** ⌘K on a Mac, Ctrl K elsewhere: read after hydration, so the server's markup never disagrees with the client's. */
const useShortcutLabel = () => {
  const [label, setLabel] = useState('⌘K')

  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) {
      setLabel('Ctrl K')
    }
  }, [])

  return label
}

/**
 * What opens the search: a field under the sidebar's brand, or a round button in the mobile header. Both dispatch
 * the same event, so the page keeps one dialog.
 */
export const SearchTrigger = ({variant = 'field'}: {variant?: 'field' | 'icon'}) => {
  const shortcut = useShortcutLabel()

  if (variant === 'icon') {
    return (
      <button aria-label="Search the documentation" className={styles.icon()} onClick={openSearch} type="button">
        <SearchIcon className="size-4" />
      </button>
    )
  }

  return (
    <button aria-keyshortcuts="Meta+K Control+K" className={styles.field()} onClick={openSearch} type="button">
      <SearchIcon className={styles.fieldIcon()} />
      <span className={styles.fieldLabel()}>Search docs…</span>
      <kbd className={styles.kbd()}>{shortcut}</kbd>
    </button>
  )
}
