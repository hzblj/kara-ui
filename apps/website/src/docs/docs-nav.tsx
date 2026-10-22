'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {NPM_URL, REPOSITORY_URL} from '../site'
import {GithubMark, NpmMark} from '../ui/icons'
import {cn} from '../ui/utils'
import {docsStyles} from './docs-styles'
import type {NavGroup} from './pages'

const styles = docsStyles()

export const DocsNav = ({groups, label}: {groups: NavGroup[]; label: string}) => {
  const pathname = usePathname()
  const linkClass = (href: string) =>
    cn(styles.navLink(), pathname === href ? styles.navLinkActive() : styles.navLinkInactive())

  return (
    <nav aria-label={label} className="grid">
      {groups.map(group => (
        <div className={styles.navGroup()} key={group.label}>
          <p className={styles.navGroupLabel()}>{group.label}</p>
          {group.links.map(item => (
            <Link className={linkClass(item.href)} href={item.href} key={item.href}>
              {item.title}
            </Link>
          ))}
          {group.subgroups?.map(subgroup => (
            <div className={styles.navSubGroup()} key={subgroup.label}>
              <p className={styles.navSubGroupLabel()}>{subgroup.label}</p>
              {subgroup.links.map(item => (
                <Link className={linkClass(item.href)} href={item.href} key={item.href}>
                  {item.title}
                </Link>
              ))}
            </div>
          ))}
        </div>
      ))}
      <div className={styles.navGroup()}>
        <p className={styles.navGroupLabel()}>Resources</p>
        <a className={cn(styles.navLink(), styles.navLinkInactive())} href="/llms.txt">
          llms.txt
        </a>
        <a className={cn(styles.navLink(), styles.navLinkInactive())} href="/llms-full.txt">
          llms-full.txt
        </a>
      </div>
    </nav>
  )
}

export const SupportLinks = () => (
  <div className={styles.sidebarFooter()}>
    <a className={styles.sidebarFooterLink()} href={REPOSITORY_URL}>
      <GithubMark className={styles.sidebarFooterMark()} />
      GitHub
    </a>
    <a className={styles.sidebarFooterLink()} href={NPM_URL}>
      <NpmMark className={styles.sidebarFooterMark()} />
      npm
    </a>
  </div>
)
