# @hzblj/kara-components

[![npm version][npm-badge]][npm-url]
[![License: MIT][license-badge]][license-url]

[npm-badge]: https://img.shields.io/npm/v/@hzblj/kara-components?labelColor=27272a&color=ff5700&label=%40hzblj%2Fkara-components
[npm-url]: https://www.npmjs.com/package/@hzblj/kara-components
[license-badge]: https://img.shields.io/badge/license-MIT-ff5700?labelColor=27272a
[license-url]: https://github.com/hzblj/kara-ui/blob/main/LICENSE

<a href="https://www.kara.janblazej.dev"><img src="https://www.kara.janblazej.dev/og.png" alt="Kara, native UI for Expo: real SwiftUI and Jetpack Compose views" width="720"></a>

The components of [Kara UI](https://www.kara.janblazej.dev), a native-first design system for Expo.

> **Install [`@hzblj/kara-ui`](https://www.npmjs.com/package/@hzblj/kara-ui) instead.** This package is one of its
> building blocks, published so its types resolve; everything here is re-exported from `@hzblj/kara-ui`.

## What's inside

- **Native components**: real SwiftUI views on iOS and Jetpack Compose on Android, through `@expo/ui`. A `Switch` is
  a SwiftUI `Toggle` on one and a Material `Switch` on the other.
- **`Screen` and `Island`**: the hosts native views render in.
- **The React Native tier**: `RnView`, `RnText`, `RnScrollView` and the rest are plain React Native views with the
  same `sx` props, for long lists and for content around the native islands.
- **Haptics** where the platform's own control has none, through
  [`@hzblj/expo-rich-haptics`](https://github.com/hzblj/expo-rich-haptics).

## Documentation

- [Components](https://www.kara.janblazej.dev/docs/components): every one on iOS and Android, with its props
- [Screen and Island](https://www.kara.janblazej.dev/docs/hosts)
- [Haptics](https://www.kara.janblazej.dev/docs/haptics)

## License

MIT © Jan Blazej
