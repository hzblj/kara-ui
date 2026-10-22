# @hzblj/kara-sx

## 0.7.0

### Patch Changes

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `sx` costs less on every render. The style cache, the responsive flattening and the key behind `useSxModifiers` used to go through every key the surface has, about seventy for a `Box`, even when a component set two or three of them. Now they go through only the props that are set, and the theme's part of the cache key is worked out once per theme rather than on every render. Without a JIT, as on Hermes, an `sx()` view resolves its style 2.5–5× faster and a native atom 2–4.5× faster.

- Updated dependencies []:
  - @hzblj/kara-theme@0.7.0

## 0.6.0

### Patch Changes

- Updated dependencies []:
  - @hzblj/kara-theme@0.6.0

## 0.5.0

### Patch Changes

- Updated dependencies [[`3b0a6fb`](https://github.com/hzblj/kara-ui/commit/3b0a6fbc49559720023fece2b5c6189ad4d88bc8)]:
  - @hzblj/kara-theme@0.5.0

## 0.4.1

### Patch Changes

- Updated dependencies []:
  - @hzblj/kara-theme@0.4.1

## 0.4.0

### Patch Changes

- Updated dependencies []:
  - @hzblj/kara-theme@0.4.0

## 0.3.0

### Patch Changes

- Updated dependencies []:
  - @hzblj/kara-theme@0.3.0

## 0.2.1

### Patch Changes

- [`be5be81`](https://github.com/hzblj/kara-ui/commit/be5be81a3764dfbd199c3c3cf90deadc6e53d268) Thanks [@hzblj](https://github.com/hzblj)! - Installable again: 0.2.0 was published with `workspace:^` ranges between the kara packages, which no package manager outside this repository resolves. The packages now go out through Yarn, which writes the real version ranges.

- Updated dependencies [[`be5be81`](https://github.com/hzblj/kara-ui/commit/be5be81a3764dfbd199c3c3cf90deadc6e53d268)]:
  - @hzblj/kara-theme@0.2.1

## 0.2.0

### Patch Changes

- Updated dependencies []:
  - @hzblj/kara-theme@0.2.0

## 0.1.0

### Minor Changes

- [`f919c7b`](https://github.com/hzblj/kara-ui/commit/f919c7b06f3798cebd58eef1581076bf1ee61cd1) Thanks [@hzblj](https://github.com/hzblj)! - First release of the kara-ui design system: theme and tokens, the `sx` engine, atoms, molecules, organisms and `Screen`, native tabs (`@hzblj/kara-ui/router`), the KaraUI native module (Liquid Glass, scroll edge effect, native countdown, context menu with preview, rich tooltip, FAB menu), and `KaraProvider` with theme overrides — colours, the app's own fonts, the Material seed, and Material You dynamic colour on Android. Text uses the platform's face by default. Install `@hzblj/kara-ui`; the scoped packages are its building blocks.

### Patch Changes

- Updated dependencies [[`f919c7b`](https://github.com/hzblj/kara-ui/commit/f919c7b06f3798cebd58eef1581076bf1ee61cd1)]:
  - @hzblj/kara-theme@0.1.0
