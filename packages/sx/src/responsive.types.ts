import type {Breakpoint} from '@hzblj/kara-theme'

/**
 * A value that may differ per breakpoint: the plain value, or one keyed by breakpoint.
 *
 * `base` is mandatory. Partly because the cascade needs a floor to fall back to, and partly because
 * an `sx` that applies nothing on the narrowest phone is a bug rather than a style.
 *
 * The cascade runs mobile-first: a breakpoint holds until a wider one overrides it. So
 * `{base: 's8', md: 's16'}` pads by 8 below `md` and by 16 from `md` up, `lg` and `xl` included.
 */
export type Responsive<TValue> = TValue | ({base: TValue} & Partial<Record<Breakpoint, TValue>>)

/**
 * Widens the named keys of a flat `sx` surface to `Responsive`, leaving the rest alone.
 *
 * A transform over the flat type rather than a hand-written twin, so a key added to `Sx` or `ViewSx`
 * needs no second edit here. The value goes through `NonNullable`, so the optionality stays on the prop
 * and cannot sneak into `base`, which would defeat the point of requiring it.
 */
export type ResponsiveOf<TSx, TKey extends keyof TSx> = Omit<TSx, TKey> & {
  [K in TKey]?: Responsive<NonNullable<TSx[K]>>
}
