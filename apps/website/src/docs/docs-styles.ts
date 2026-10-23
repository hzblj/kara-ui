import {tv} from 'tailwind-variants'

const flow = '[&>*+*]:mt-6 [&>h3+*]:mt-0 [&>h3]:mb-5 [&>h3]:mt-12 [&>p]:mb-0'
const inlineCode =
  '[&_:not(pre)>code]:rounded-[5px] [&_:not(pre)>code]:bg-fill-secondary-hover [&_:not(pre)>code]:px-[5px] [&_:not(pre)>code]:py-px [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.86em] [&_:not(pre)>code]:text-content-primary'
const prose =
  '[&>p]:max-w-[700px] [&>p]:text-[15px] [&>p]:leading-7 [&>p]:text-content-secondary [&>ul]:max-w-[700px] [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:pl-5 [&>ul]:text-[15px] [&>ul]:leading-7 [&>ul]:text-content-secondary [&_a:not([class])]:font-medium [&_a:not([class])]:text-content-accent [&_a:not([class])]:underline [&_a:not([class])]:decoration-transparent [&_a:not([class])]:underline-offset-4 [&_a:not([class])]:transition-colors [&_a:not([class]):hover]:decoration-current [&_strong]:font-semibold [&_strong]:text-content-primary'

export const docsStyles = tv({
  slots: {
    brandLabel: 'text-sm text-content-tertiary',
    brandLink: 'transition-opacity hover:opacity-70',
    callout:
      'flex gap-3 rounded-xl border border-border-secondary bg-surface-secondary px-4 py-3.5 text-sm leading-6 text-content-secondary [&_strong]:font-semibold [&_strong]:text-content-primary',
    calloutAccent: 'border-fill-accent-primary/25 bg-fill-accent-soft',
    calloutMark: 'mt-[9px] size-1.5 shrink-0 rounded-full bg-fill-accent-primary',
    changelogCommit:
      'justify-self-start font-mono text-xs text-content-accent underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current',
    changelogEntries: 'grid gap-5',
    changelogEntry: 'grid gap-2.5 border-l-2 border-border-secondary pl-4',
    changelogItems:
      'grid list-disc gap-1.5 pl-5 text-sm leading-6 text-content-secondary marker:text-content-quaternary',
    changelogParagraph: 'text-sm leading-7 text-content-secondary',
    changelogRelease: 'border-t border-border-secondary py-8 first:border-t-0 first:pt-0',
    changelogTag:
      'rounded-full border border-border-secondary px-2.5 py-1 text-[11px] font-semibold text-content-tertiary',
    changelogVersion: 'text-[22px] font-semibold tracking-[-0.03em] text-content-primary',
    changelogVersionRow: 'mb-4 flex flex-wrap items-center gap-3',
    codeBlock: 'overflow-hidden rounded-xl border border-border-secondary bg-surface-secondary',
    codeBlockBody: 'm-0 overflow-x-auto px-5 py-4 font-mono text-[13px] leading-6 text-content-primary',
    codeBlockHeader:
      'flex h-10 items-center justify-between border-b border-border-secondary px-4 text-[11px] font-medium text-content-tertiary',
    codeCopy:
      'cursor-pointer rounded-md px-2 py-1 transition-colors hover:bg-fill-secondary-hover hover:text-content-primary',
    content: 'min-w-0 px-10 pb-40 max-[820px]:px-7 max-[820px]:pb-32 max-[560px]:px-5',
    hero: `border-b border-border-secondary pt-[96px] pb-14 max-[820px]:pt-14 ${prose} ${inlineCode} [&>h1]:mb-5 [&>h1]:text-[clamp(40px,5vw,56px)] [&>h1]:font-bold [&>h1]:leading-[1.02] [&>h1]:tracking-[-0.05em] [&>p]:text-[17px] [&>p]:leading-8`,
    kicker: 'mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-content-accent',
    mobileHeader:
      'sticky top-0 z-20 hidden h-[72px] items-center justify-between gap-4 border-b border-border-secondary bg-surface-base/90 px-7 backdrop-blur max-[820px]:flex max-[560px]:px-5',
    mobileHeaderActions: 'flex shrink-0 items-center gap-2.5',
    navGroup: 'mb-7 grid gap-[3px]',
    navGroupLabel: 'mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-content-tertiary',
    navLink:
      'rounded-[7px] px-2 py-1.5 text-[13px] leading-tight transition-colors hover:bg-fill-secondary-hover hover:text-content-primary',
    navLinkActive: 'bg-fill-secondary-hover font-semibold text-content-primary hover:bg-fill-secondary-pressed',
    navLinkInactive: 'text-content-tertiary',
    navSubGroup: 'mt-3.5 grid gap-[3px] first:mt-0',
    navSubGroupLabel: 'mb-1.5 pl-2 text-[9px] font-bold uppercase tracking-[0.1em] text-content-tertiary/70',
    pager: 'mt-16 grid grid-cols-2 gap-4 max-[560px]:grid-cols-1',
    pagerLabel: 'text-[11px] font-semibold uppercase tracking-[0.1em] text-content-tertiary',
    pagerLink:
      'group grid gap-1 rounded-xl border border-border-secondary bg-surface-secondary px-4 py-3.5 transition-colors hover:bg-fill-secondary-hover',
    pagerNext: 'text-right max-[560px]:text-left',
    pagerTitle: 'text-[15px] font-semibold text-content-primary',
    section: `scroll-mt-24 border-b border-border-secondary py-14 last:border-b-0 ${flow} ${prose} ${inlineCode} [&>h2+*]:mt-0 [&>h2]:mb-5 [&>h2]:text-[28px] [&>h2]:font-semibold [&>h2]:tracking-[-0.035em] [&>h3]:text-[17px] [&>h3]:font-semibold [&>h3]:tracking-[-0.01em]`,
    // `dvh`, not `vh`: Safari's `100vh` is the height without its toolbars, so the last links sat under them.
    sidebar:
      'sticky top-0 left-0 flex h-dvh flex-col overflow-y-auto overscroll-y-contain border-r border-border-secondary px-6 pb-6 [scrollbar-color:var(--color-gray-5)_transparent] [scrollbar-width:thin] max-[820px]:hidden',
    sidebarBrand: 'flex min-w-0 items-baseline gap-2.5',
    sidebarBrandRow: 'flex h-20 items-center',
    sidebarFooter: 'mt-auto grid gap-2.5 border-t border-border-secondary pt-5 text-[13px]',
    sidebarFooterLink:
      'inline-flex items-center gap-2 text-content-tertiary transition-colors hover:text-content-primary',
    sidebarFooterMark: 'size-4 shrink-0',
    sidebarTop:
      'sticky top-0 z-10 -mx-6 mb-4 shrink-0 bg-surface-base px-6 pb-5 after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-5 after:bg-gradient-to-b after:from-surface-base after:to-transparent',
    site: 'mx-auto grid min-h-dvh max-w-[1320px] grid-cols-[248px_minmax(0,1fr)_208px] max-[1180px]:grid-cols-[248px_minmax(0,1fr)] max-[820px]:block',
    tab: 'cursor-pointer rounded-[7px] border border-transparent px-[11px] py-[7px] text-xs font-semibold transition-colors hover:bg-fill-secondary-hover hover:text-content-primary',
    tabActive: 'border-border-secondary bg-surface-elevated text-content-primary shadow-btn-default',
    tabInactive: 'text-content-tertiary',
    tabs: 'flex gap-0.5',
    themeCorner: 'pointer-events-none fixed inset-x-0 top-0 z-50 flex h-20 items-center max-[820px]:hidden',
    themeCornerInner: 'mx-auto flex w-full max-w-[1320px] justify-end px-7 [&>*]:pointer-events-auto',
    toc: 'sticky top-0 h-dvh overflow-y-auto overscroll-y-contain px-5 pt-[96px] pb-10 max-[1180px]:hidden',
    tocHeader: 'mb-2 flex items-baseline justify-between gap-2',
    tocLabel: 'text-xs font-bold text-content-primary',
    tocLinkActive: 'bg-fill-secondary-hover font-semibold text-content-primary',
    tocNav:
      'relative grid gap-px pl-3 text-[11px] leading-[1.35] text-content-tertiary [&_a]:rounded-md [&_a]:px-2 [&_a]:py-1 [&_a]:transition-colors [&_a:hover]:bg-fill-secondary-hover [&_a:hover]:text-content-primary',
    tocProgress: 'text-[10px] font-semibold tabular-nums text-content-tertiary',
    tocRail: 'absolute inset-y-0 left-0 w-[2px] overflow-hidden rounded-full bg-border-secondary',
    tocRailFill:
      'block w-full rounded-full bg-fill-accent-primary transition-[height] duration-100 ease-out motion-reduce:transition-none',
    wordmark: 'text-xl font-bold tracking-[-0.04em]',
  },
})
