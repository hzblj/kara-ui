# @hzblj/kara-theme

[![npm version][npm-badge]][npm-url]
[![License: MIT][license-badge]][license-url]

[npm-badge]: https://img.shields.io/npm/v/@hzblj/kara-theme?labelColor=27272a&color=ff5700&label=%40hzblj%2Fkara-theme
[npm-url]: https://www.npmjs.com/package/@hzblj/kara-theme
[license-badge]: https://img.shields.io/badge/license-MIT-ff5700?labelColor=27272a
[license-url]: https://github.com/hzblj/kara-ui/blob/main/LICENSE

<a href="https://kara.janblazej.dev"><img src="https://kara.janblazej.dev/og.png" alt="Kara — native UI for Expo: real SwiftUI and Jetpack Compose views" width="720"></a>

The design tokens, palette, typography and theme of [Kara UI](https://kara.janblazej.dev) — a native-first design
system for Expo.

> **Install [`@hzblj/kara-ui`](https://www.npmjs.com/package/@hzblj/kara-ui) instead.** This package is one of its
> building blocks, published so its types resolve; everything here is re-exported from `@hzblj/kara-ui`.

## What's inside

- **Tokens** — spacing, radii, shadows, opacity, durations and text styles, each a name the `sx` props accept.
- **Palette** — the platform's own colours by default: UIKit's semantic colours on iOS, Material 3 roles on Android.
- **`KaraProvider` and `defineTheme`** — your colours, your typefaces, the Android seed and Material You, as overrides
  of values, never of names.
- **Breakpoints** — what responsive `sx` values resolve against.

## Documentation

- [Theming](https://kara.janblazej.dev/docs/theming)
- [Design tokens](https://kara.janblazej.dev/docs/tokens)

## License

MIT © Jan Blazej
