/**
 * Narrowest to widest. `Breakpoint` derives from this array rather than the other way round, so the
 * scale and the order the responsive cascade walks cannot drift apart.
 */
export const BREAKPOINT_ORDER = ['sm', 'md', 'lg', 'xl'] as const

export type Breakpoint = (typeof BREAKPOINT_ORDER)[number]
export type Breakpoints = Readonly<Record<Breakpoint, number>>

/** What `useBreakpoint` reports: a named breakpoint, or `base` for a window narrower than `sm`. */
export type ActiveBreakpoint = Breakpoint | 'base'

export const breakpoints: Breakpoints = {
  lg: 992,
  md: 768,
  sm: 576,
  xl: 1200,
} as const

/**
 * The widest breakpoint a window of this width fits, or `base` below the narrowest. Lower edges are
 * inclusive — a breakpoint owns its own width.
 *
 * Kept a plain function beside the scale it reads, so it can be called outside React; the hook that
 * tracks it for a tree is `useBreakpoint`.
 */
export const breakpointFor = (width: number): ActiveBreakpoint =>
  BREAKPOINT_ORDER.reduce<ActiveBreakpoint>((widest, name) => (width >= breakpoints[name] ? name : widest), 'base')
