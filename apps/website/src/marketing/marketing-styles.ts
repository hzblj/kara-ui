import {tv} from 'tailwind-variants'

export const marketingStyles = tv({
  slots: {
    actions: 'mt-9 flex flex-wrap items-center justify-center gap-3',
    brandLink: 'transition-opacity hover:opacity-70',
    footer: 'overflow-x-clip pt-8',
    footerBar:
      'mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-border-secondary py-10 text-[13px] text-content-tertiary',
    footerInner: 'px-7 max-[560px]:px-5',
    footerLink: 'transition-colors hover:text-content-primary',
    footerLinks: 'flex flex-wrap items-center gap-x-7 gap-y-2',
    // 40px of air to the line, less the mark's own margin inside its viewBox (4 of 108).
    footerMark: 'mx-auto mb-[calc(40px-min(32vw,160px)*4/108)] block w-[min(32vw,160px)] text-fill-accent-primary',
    hero: 'mx-auto max-w-[860px] px-7 pt-20 pb-14 text-center max-[820px]:pt-12 max-[560px]:px-5 [&_h1]:text-[clamp(48px,8vw,92px)] [&_h1]:font-bold [&_h1]:leading-[0.95] [&_h1]:tracking-[-0.06em]',
    install:
      'flex h-12 min-w-0 max-w-[340px] items-center gap-2 rounded-full border border-border-secondary bg-surface-primary pr-2 pl-4 font-mono text-[12.5px] text-content-secondary max-[560px]:max-w-full',
    installCommand: 'min-w-0 overflow-x-auto whitespace-nowrap [scrollbar-width:none]',
    installCopy:
      'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-content-tertiary transition-colors hover:bg-fill-secondary-hover hover:text-content-primary',
    lede: 'mx-auto mt-6 max-w-[640px] text-[19px] leading-[1.55] text-content-secondary max-[560px]:text-[17px]',
    menuLink:
      'rounded-[9px] px-2 py-2.5 text-content-secondary transition-colors hover:bg-fill-secondary-hover hover:text-content-primary',
    menuNav: 'grid gap-px text-[15px]',
    nav: 'mx-auto flex h-20 max-w-[1180px] items-center justify-between gap-4 px-7 max-[560px]:px-5',
    navActions: 'flex shrink-0 items-center gap-7 max-[820px]:gap-2.5',
    navLink: 'inline-flex items-center gap-2 transition-colors hover:text-content-primary',
    navLinks: 'flex items-center gap-7 text-[14px] text-content-tertiary max-[820px]:hidden',
    navMark: 'size-4 shrink-0',
    primaryButton:
      'inline-flex h-12 items-center gap-2 rounded-full bg-fill-accent-primary px-6 text-[15px] font-bold text-content-on-accent shadow-btn-default transition-colors hover:bg-fill-accent-hover active:bg-fill-accent-pressed',
    secondaryLink:
      'inline-flex items-center gap-1.5 text-[15px] font-semibold text-content-accent transition-opacity hover:opacity-70',
    section: 'pt-10 pb-28 max-[820px]:pb-20',
    sectionHeader:
      'mx-auto mb-12 max-w-[1040px] px-7 text-center max-[560px]:px-5 [&_h2]:text-[clamp(34px,4.6vw,56px)] [&_h2]:font-bold [&_h2]:leading-none [&_h2]:tracking-[-0.05em] [&_p]:mt-4 [&_p]:text-[17px] [&_p]:text-content-secondary',
    wordmark: 'text-[22px] font-bold tracking-[-0.04em]',
  },
})
