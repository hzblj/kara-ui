import Link from 'next/link'
import type {ReactNode} from 'react'
import {tv} from 'tailwind-variants'

import {Inline} from '../../ui/inline'
import {cn} from '../../ui/utils'
import {docsStyles} from '../docs-styles'

const docs = docsStyles()

export const Hero = ({
  children,
  id,
  kicker,
  title,
}: {
  children: ReactNode
  id: string
  kicker: string
  title: string
}) => (
  <header className={docs.hero()} id={id}>
    <div className={docs.kicker()}>{kicker}</div>
    <h1>{title}</h1>
    {children}
  </header>
)

export const Section = ({children, id, title}: {children: ReactNode; id: string; title?: string}) => (
  <section className={docs.section()} id={id}>
    {title ? <h2>{title}</h2> : null}
    {children}
  </section>
)

/** A paragraph written with the docs' inline markdown. */
export const P = ({children}: {children: string}) => (
  <p>
    <Inline text={children} />
  </p>
)

export const List = ({items}: {items: string[]}) => (
  <ul>
    {items.map(item => (
      <li key={item}>
        <Inline text={item} />
      </li>
    ))}
  </ul>
)

export const Callout = ({accent = false, children}: {accent?: boolean; children: string}) => (
  <div className={cn(docs.callout(), accent && docs.calloutAccent())}>
    <span aria-hidden="true" className={docs.calloutMark()} />
    <p>
      <Inline text={children} />
    </p>
  </div>
)

const table = tv({
  slots: {
    cell: 'border-t border-border-secondary px-4 py-3 align-top text-[13px] leading-6 text-content-secondary [&_code]:text-[12px]',
    head: 'bg-surface-secondary px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-content-tertiary',
    wrap: 'overflow-x-auto rounded-xl border border-border-secondary bg-surface-primary',
  },
})

const t = table()

/** A small reference table whose cells take the docs' inline markdown. */
export const Table = ({columns, rows}: {columns: string[]; rows: string[][]}) => (
  <div className={t.wrap()}>
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {columns.map(column => (
            <th className={t.head()} key={column}>
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.join('|')}>
            {row.map((cell, index) => (
              <td className={t.cell()} key={`${columns[index]}:${cell}`}>
                <Inline text={cell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const cards = tv({
  slots: {
    card: 'group grid gap-1 rounded-xl border border-border-secondary bg-surface-secondary px-4 py-3.5 transition-colors hover:bg-fill-secondary-hover',
    copy: 'text-[13px] leading-5 text-content-tertiary',
    grid: 'grid grid-cols-2 gap-3 max-[560px]:grid-cols-1',
    title: 'text-[14px] font-semibold text-content-primary',
  },
})

const c = cards()

export const NextLinks = ({links}: {links: {copy: string; href: string; title: string}[]}) => (
  <div className={c.grid()}>
    {links.map(item => (
      <Link className={c.card()} href={item.href} key={item.href}>
        <span className={c.title()}>{`${item.title} →`}</span>
        <span className={c.copy()}>{item.copy}</span>
      </Link>
    ))}
  </div>
)
