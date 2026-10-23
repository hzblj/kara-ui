# @hzblj/kara-sx

[![npm version][npm-badge]][npm-url]
[![License: MIT][license-badge]][license-url]

[npm-badge]: https://img.shields.io/npm/v/@hzblj/kara-sx?labelColor=27272a&color=ff5700&label=%40hzblj%2Fkara-sx
[npm-url]: https://www.npmjs.com/package/@hzblj/kara-sx
[license-badge]: https://img.shields.io/badge/license-MIT-ff5700?labelColor=27272a
[license-url]: https://github.com/hzblj/kara-ui/blob/main/LICENSE

<a href="https://www.kara.janblazej.dev"><img src="https://www.kara.janblazej.dev/og.png" alt="Kara, native UI for Expo: real SwiftUI and Jetpack Compose views" width="720"></a>

The token-typed `sx` styling engine of [Kara UI](https://www.kara.janblazej.dev), a native-first design system for Expo.

> **Install [`@hzblj/kara-ui`](https://www.npmjs.com/package/@hzblj/kara-ui) instead.** This package is one of its
> building blocks, published so its types resolve; everything here is re-exported from `@hzblj/kara-ui`.

## What's inside

- **One surface, three targets**: the same `sx` props resolve into SwiftUI modifiers, Compose modifiers or a React
  Native style, depending on where a component renders.
- **Tokens, not values**: `p="s16"`, `bg="surface.primary"`, `borderRadius="large"`; a raw number or hex does not
  type-check.
- **Responsive values**: layout keys also take `{base, sm, md, lg, xl}`.
- **Platform buckets**: `ios` and `android` keys for what only one platform should get.

## Documentation

- [Styling with `sx`](https://www.kara.janblazej.dev/docs/styling)
- [Design tokens](https://www.kara.janblazej.dev/docs/tokens)

## License

MIT © Jan Blazej
