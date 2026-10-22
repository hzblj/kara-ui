---
"@hzblj/kara-ui": patch
"@hzblj/kara-components": patch
---

Android layout fixes:

- `Screen` keeps its content clear of the status bar when nothing sits above it, as a SwiftUI host keeps to the safe area — it drew under it. Under a navigation bar nothing changes; the background still runs to the edges.
- `Form` is inset from its container on every side, with section titles and footers indented to the cards' content, like SwiftUI's grouped form — in a `Screen` its cards ran into the screen's edges.
- A disabled or read-only `Checkbox` or `Switch` keeps Material's 48dp touch target, so it lines up with the enabled ones instead of shifting toward the edge.
