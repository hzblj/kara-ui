---
"@hzblj/kara-ui": minor
"@hzblj/kara-components": minor
"@hzblj/kara-native": minor
---

New `BlurView`: the system materials, by SwiftUI's names — `ultraThin`, `thin`, `regular`, `thick`, `ultraThick`.

- iOS: UIKit's `system*Material` blur as a plain view — no SwiftUI host, cheap enough for a list cell — with `vibrancy` (`primary` to `quaternary`, `fill`, `separator`) to draw the content the way iOS draws its own on a material.
- Android: what lies behind, blurred and saturated (Android 12+), under a Material tonal surface that rises from `surface` to `surfaceContainerHighest` as the material thickens; below Android 12 the surface alone.
- `appearance` pins a material to light or dark whatever the app's; `borderRadius` shapes it and clips the content.

kara-native adds `BlurView` (`/swift-ui`).
