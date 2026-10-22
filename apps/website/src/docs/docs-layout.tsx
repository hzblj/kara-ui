import Link from 'next/link'
import type {ReactNode} from 'react'

import {ThemeToggle} from '../theme/theme-toggle'
import {MobileNav} from '../ui/mobile-nav'
import {Wordmark} from '../ui/wordmark'
import {DocsNav, SupportLinks} from './docs-nav'
import {docsStyles} from './docs-styles'
import {NAV} from './pages'

const styles = docsStyles()

const Brand = () => (
  <div className={styles.sidebarBrand()}>
    <Link className={styles.brandLink()} href="/">
      <Wordmark className={styles.wordmark()} />
    </Link>
    <span className={styles.brandLabel()}>Docs</span>
  </div>
)

export const DocsLayout = ({children}: {children: ReactNode}) => (
  <div className={styles.site()}>
    <header className={styles.mobileHeader()}>
      <Brand />
      <div className={styles.mobileHeaderActions()}>
        <ThemeToggle />
        <MobileNav>
          <DocsNav groups={NAV} label="Documentation menu" />
          <SupportLinks />
        </MobileNav>
      </div>
    </header>

    <div className={styles.themeCorner()}>
      <div className={styles.themeCornerInner()}>
        <ThemeToggle />
      </div>
    </div>

    <aside className={styles.sidebar()}>
      <div className={styles.sidebarTop()}>
        <Brand />
      </div>
      <DocsNav groups={NAV} label="Documentation" />
      <SupportLinks />
    </aside>

    {children}
  </div>
)
