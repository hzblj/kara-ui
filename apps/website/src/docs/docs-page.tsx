import Link from 'next/link'
import type {ReactNode} from 'react'

import {docsStyles} from './docs-styles'
import {DocsToc} from './docs-toc'
import {type DocsHeading, neighbours} from './pages'

const styles = docsStyles()

/** One page of the docs: its content, the pager under it, and the outline beside it. */
export const DocsPage = ({children, headings, href}: {children: ReactNode; headings: DocsHeading[]; href: string}) => {
  const {next, previous} = neighbours(href)

  return (
    <>
      <main className={styles.content()}>
        {children}
        <nav aria-label="Documentation pages" className={styles.pager()}>
          {previous ? (
            <Link className={styles.pagerLink()} href={previous.href}>
              <span className={styles.pagerLabel()}>← Previous</span>
              <span className={styles.pagerTitle()}>{previous.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link className={styles.pagerLink({class: styles.pagerNext()})} href={next.href}>
              <span className={styles.pagerLabel()}>Next →</span>
              <span className={styles.pagerTitle()}>{next.title}</span>
            </Link>
          ) : null}
        </nav>
      </main>
      <DocsToc headings={headings} />
    </>
  )
}
