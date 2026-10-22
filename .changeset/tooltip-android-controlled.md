---
"@hzblj/kara-ui": minor
"@hzblj/kara-components": minor
"@hzblj/kara-native": minor
---

`Tooltip` is controlled on Android too: `visible` shows Material's plain tooltip, centred above the anchor and kept inside the window, and `onDismiss` reports a touch outside it or the anchor scrolling away. It used to open only on a long press and hide itself, ignoring both props — and Material's own placement let it run off the edge of the screen. Nothing opens it on a long press any more; wire one to `visible` if you want it.

`TooltipBox` (`@hzblj/kara-native/jetpack-compose`) takes `plain` for that style, and hides when `isPresented` turns false.
