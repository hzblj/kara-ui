---
"@hzblj/kara-ui": minor
"@hzblj/kara-components": minor
"@hzblj/kara-sx": minor
---

`sx` reaches the components that still took raw styles or none:

- `Text` takes the native `sx` surface — padding, a background, a frame (`wide` puts the text on the side `align` names) and the `ios` bucket. `ios.contentTransition` with the new `ios.animation` rolls a number to its next value, and `ios.monospacedDigit` keeps it from shifting what follows. `Stepper` on iOS is built on it.
- `RnText` takes `Box`'s `sx` props for its own box — margins, `flex`, padding — all but `align`, which still aligns its lines.
- `Image` is `sx(expo-image)`, the way `Box` is `sx(View)`: `w`, `h`, `aspectRatio`, `borderRadius`, `position`… instead of a `style` object. Its props are exported as `ImageProps`.
- `Island` takes the same `sx` props for where it sits in React Native layout: `<Island h={240} matchContents={false}>`. An explicit `style` still wins.
- `Skeleton` is sized with the `sx` names, `h` and `w` (was `height` and `width`), and `w` takes a percentage: `<Skeleton h={12} w="60%" />` for a line that ends early.
- The React Native surface gains `inset`, all four edges at once: `position="absolute" inset={0}` fills the parent.
