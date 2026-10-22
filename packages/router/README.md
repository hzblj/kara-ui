# @hzblj/kara-router

[![npm version][npm-badge]][npm-url]
[![License: MIT][license-badge]][license-url]

[npm-badge]: https://img.shields.io/npm/v/@hzblj/kara-router?labelColor=27272a&color=ff5700&label=%40hzblj%2Fkara-router
[npm-url]: https://www.npmjs.com/package/@hzblj/kara-router
[license-badge]: https://img.shields.io/badge/license-MIT-ff5700?labelColor=27272a
[license-url]: https://github.com/hzblj/kara-ui/blob/main/LICENSE

<a href="https://www.kara.janblazej.dev"><img src="https://www.kara.janblazej.dev/og.png" alt="Kara — native UI for Expo: real SwiftUI and Jetpack Compose views" width="720"></a>

The Expo Router pieces of [Kara UI](https://www.kara.janblazej.dev) — a native-first design system for Expo.

> **Install [`@hzblj/kara-ui`](https://www.npmjs.com/package/@hzblj/kara-ui) instead.** This package is one of its
> building blocks, published so its types resolve; everything here is re-exported from `@hzblj/kara-ui/router`.

## What's inside

- **`Tabs`** — native tabs over Expo Router's `NativeTabs`, with your own icons.
- **`navigationTheme`** — the Kara theme mapped onto Expo Router's `ThemeProvider`, so headers and tab bars take the
  same colours as everything else.
- **`ZoomTransition`** — a push that grows out of the view it was opened from and shrinks back into it.

Kept apart so the main `@hzblj/kara-ui` entry never imports `expo-router`.

## Documentation

- [Expo Router](https://www.kara.janblazej.dev/docs/router)

## License

MIT © Jan Blazej
