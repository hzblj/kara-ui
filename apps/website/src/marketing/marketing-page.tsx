import Link from 'next/link'

import {INSTALL_COMMAND} from '../docs/guides/getting-started'
import {HERO_HEADLINE, HERO_TAGLINE, NPM_URL, REPOSITORY_URL} from '../site'
import {ThemeToggle} from '../theme/theme-toggle'
import {CopyButton} from '../ui/copy-button'
import {ArrowRightIcon, GithubMark} from '../ui/icons'
import {MobileNav} from '../ui/mobile-nav'
import {KaraMark, Wordmark} from '../ui/wordmark'
import {ComponentStrip} from './component-strip'
import {marketingStyles} from './marketing-styles'

const styles = marketingStyles()

const NavLinks = () => (
  <div className={styles.navLinks()}>
    <Link className={styles.navLink()} href="/docs">
      Docs
    </Link>
    <Link className={styles.navLink()} href="/docs/components">
      Components
    </Link>
    <a className={styles.navLink()} href={REPOSITORY_URL}>
      <GithubMark className={styles.navMark()} />
      GitHub
    </a>
  </div>
)

export const MarketingPage = () => (
  <>
    <nav className={styles.nav()}>
      <Link aria-label="Kara home" className={styles.brandLink()} href="/">
        <Wordmark className={styles.wordmark()} />
      </Link>
      <div className={styles.navActions()}>
        <NavLinks />
        <ThemeToggle />
        <MobileNav>
          <nav aria-label="Site menu" className={styles.menuNav()}>
            <Link className={styles.menuLink()} href="/docs">
              Docs
            </Link>
            <Link className={styles.menuLink()} href="/docs/components">
              Components
            </Link>
            <a className={styles.menuLink()} href={REPOSITORY_URL}>
              GitHub
            </a>
            <a className={styles.menuLink()} href={NPM_URL}>
              npm
            </a>
          </nav>
        </MobileNav>
      </div>
    </nav>

    <main>
      <section className={styles.hero()}>
        <h1>{HERO_HEADLINE}</h1>
        <p className={styles.lede()}>{HERO_TAGLINE}</p>
        <div className={styles.actions()}>
          <Link className={styles.primaryButton()} href="/docs">
            Get started
            <ArrowRightIcon className="size-4" />
          </Link>
          <div className={styles.install()}>
            <span aria-hidden="true" className="text-content-quaternary">
              $
            </span>
            <code className={styles.installCommand()}>{INSTALL_COMMAND}</code>
            <CopyButton className={styles.installCopy()} iconClassName="size-3.5" text={INSTALL_COMMAND} />
          </div>
        </div>
      </section>

      <section className={styles.section()}>
        <header className={styles.sectionHeader()}>
          <h2>Every component, both platforms</h2>
        </header>
        <ComponentStrip />
        <div className="mt-10 flex justify-center">
          <Link className={styles.secondaryLink()} href="/docs/components">
            Browse them all
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </section>
    </main>

    <footer className={styles.footer()}>
      <KaraMark className={styles.footerMark()} />
      <div className={styles.footerInner()}>
        <div className={styles.footerBar()}>
          <span>{`© ${new Date().getFullYear()} hzblj · MIT`}</span>
          <nav aria-label="Footer" className={styles.footerLinks()}>
            <Link className={styles.footerLink()} href="/docs">
              Docs
            </Link>
            <Link className={styles.footerLink()} href="/docs/components">
              Components
            </Link>
            <Link className={styles.footerLink()} href="/docs/changelog">
              Changelog
            </Link>
            <a className={styles.footerLink()} href={REPOSITORY_URL}>
              GitHub
            </a>
            <a className={styles.footerLink()} href={NPM_URL}>
              npm
            </a>
          </nav>
        </div>
      </div>
    </footer>
  </>
)
