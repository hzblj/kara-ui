/**
 * How far a transparent header with a stacked search field reaches into the screen while the field shows: the header's
 * own inset (`useHeaderBarInset()`) plus the 54pt search bar on iOS, 0 on Android. An estimate for content that follows
 * the header natively (`ScrollEdgeContainer`'s `headerInset`): it must not fall below the expanded header, which may be
 * taller (a large title in a row of its own adds its height).
 */
export type UseSearchHeaderInset = () => number
