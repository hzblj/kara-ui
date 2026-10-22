'use client'

import {type ReactNode, useState} from 'react'

import {CopyButton} from '../../ui/copy-button'
import {cn} from '../../ui/utils'
import {docsStyles} from '../docs-styles'

const styles = docsStyles()

type PreviewTabsProps = {
  code: string
  /** The snippet, highlighted on the server. */
  codeHtml: string
  /** What the Preview tab shows — the captures, side by side. */
  preview: ReactNode
}

/** A component's captures with the snippet that renders them one tab away. */
export const PreviewTabs = ({code, codeHtml, preview}: PreviewTabsProps) => {
  const [tab, setTab] = useState<'code' | 'preview'>('preview')

  return (
    <div className="overflow-hidden rounded-2xl border border-border-secondary bg-surface-primary shadow-card-default">
      <div className="flex min-h-12 items-center justify-between gap-3 border-b border-border-secondary bg-surface-secondary px-3 py-1.5">
        <div aria-label="Example view" className={styles.tabs()} role="tablist">
          {(['preview', 'code'] as const).map(value => (
            <button
              aria-selected={tab === value}
              className={cn(styles.tab(), tab === value ? styles.tabActive() : styles.tabInactive())}
              key={value}
              onClick={() => setTab(value)}
              role="tab"
              type="button"
            >
              {value === 'preview' ? 'Preview' : 'Code'}
            </button>
          ))}
        </div>
        {tab === 'code' ? (
          <CopyButton className={styles.codeCopy()} iconClassName="size-3.5 text-content-tertiary" text={code} />
        ) : null}
      </div>
      <div className={tab === 'preview' ? undefined : 'hidden'}>{preview}</div>
      {tab === 'code' ? (
        <div
          className="min-h-[200px] overflow-x-auto bg-surface-secondary px-6 py-5 font-mono text-[13px] leading-6"
          dangerouslySetInnerHTML={{__html: codeHtml}}
        />
      ) : null}
    </div>
  )
}
