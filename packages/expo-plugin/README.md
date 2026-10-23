# @hzblj/kara-expo-plugin

[![npm version][npm-badge]][npm-url]
[![License: MIT][license-badge]][license-url]

[npm-badge]: https://img.shields.io/npm/v/@hzblj/kara-expo-plugin?labelColor=27272a&color=ff5700&label=%40hzblj%2Fkara-expo-plugin
[npm-url]: https://www.npmjs.com/package/@hzblj/kara-expo-plugin
[license-badge]: https://img.shields.io/badge/license-MIT-ff5700?labelColor=27272a
[license-url]: https://github.com/hzblj/kara-ui/blob/main/LICENSE

<a href="https://www.kara.janblazej.dev"><img src="https://www.kara.janblazej.dev/og.png" alt="Kara, native UI for Expo: real SwiftUI and Jetpack Compose views" width="720"></a>

The Expo config plugin of [Kara UI](https://www.kara.janblazej.dev), a native-first design system for Expo.

> **Install [`@hzblj/kara-ui`](https://www.npmjs.com/package/@hzblj/kara-ui) instead.** This package is one of its
> building blocks; apps name `@hzblj/kara-ui` in their plugins, and it hands over to this one.

```ts
// app.config.ts
plugins: [['@hzblj/kara-ui', {icons: {source: './assets/icons'}}]]
```

## What's inside

- **Native icons from your SVGs**: at prebuild, every SVG in the folder becomes an iOS asset-catalog image and an
  Android vector drawable, and `kara-icons.d.ts` types their names (`bolt.svg` → `<Icon name="bolt" />`).
- **iOS semantic colours**: `iosSemanticColors` redefines a UIKit colour such as `labelColor` app-wide.
- **`kara-icons`**: the same icon check without Expo, for CI; it ships as `@hzblj/kara-ui`'s bin.

## Documentation

- [Icons](https://www.kara.janblazej.dev/docs/icons)
- [Redefining a UIKit colour](https://www.kara.janblazej.dev/docs/theming#semantic-colours)

## License

MIT © Jan Blazej
