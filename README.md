# kara-ui

A native-first design system for Expo. Every component renders a real SwiftUI or Jetpack Compose view, styled through
one token-typed `sx` surface, in the platform's own colours and typeface unless your theme says otherwise.

- **Native, not imitated** — SwiftUI and Compose controls, Liquid Glass on iOS 26, Material 3 and Material You on Android.
- **One set of tokens** — `p="s16"`, `bg="surface.primary"`; a raw number or hex does not type-check.
- **Your icons, made native** — drop SVGs in a folder, get asset-catalog images and vector drawables.
- **Native sheets** — with a real navigation bar for a header.

Install [`@hzblj/kara-ui`](./packages/kara-ui) — its README has the docs. The example app in
[`apps/example`](./apps/example) shows every component: `yarn install && yarn prebuild && yarn ios`.

MIT
