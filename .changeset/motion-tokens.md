---
"@hzblj/kara-ui": minor
"@hzblj/kara-theme": minor
"@hzblj/kara-components": minor
"@hzblj/kara-router": minor
---

Motion tokens on transitions.dev's scale, in place of the `d0` to `d10000` steps, of which six were ever used. Durations are named by what the motion does: `micro` (80 ms, what answers a touch), `quick` (150 ms, something leaving or swapped in place), `fast` (250 ms, something arriving), `medium` (350 ms, a larger surface leaving), `slow` (400 ms, a larger surface arriving), `verySlow` (500 ms, an emphasised moment), `stagger` (40 ms, the offset between items) and `none`. Pick a step by what the motion does, not by the number it had: as a rule of thumb, `d100` is `micro`, `d150` `quick`, `d200` `quick` or `fast`, `d250` and `d300` `fast`, `d400` `slow` and `d500` `verySlow`. `ZoomTransition`'s Android `duration` takes the same names and, unset, keeps Material's own 450 ms.

New `easing` tokens carry the curves as cubic-bézier points, ready for `Easing.bezier(...easing.smoothOut)`: `smoothOut` for arriving and leaving alike, `inOut` for a swap in place, `out` for a small fade, `linear` for what loops.

The components use them: `Pressable` eases its scale down in `quick` and back in `fast` with no bounce, and dims in `micro`; `Snackbar` arrives in `fast` and leaves in `quick` on `smoothOut`; `Image` fades in over `quick`.

`content.on.bg` is `content.on.accent`, which is what it sits on (Material's `onPrimary` under `dynamicColor`). The opacity and spacing scales keep their values and are documented now: the opacity ramp's tens and quarters, and spacing's 4 pt grid with half steps where small gaps need them.
