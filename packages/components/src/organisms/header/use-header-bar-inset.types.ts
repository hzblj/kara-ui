/**
 * How far a transparent header reaches into the screen: the status bar plus the bar's own height on iOS, 0 on Android,
 * where the top app bar sits above the content. Known on the first render, unlike a measured header height, so content
 * laid out by it never jumps once the bar reports its size.
 */
export type UseHeaderBarInset = () => number
