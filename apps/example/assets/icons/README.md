# Icons

The example's icons — one SVG per icon, the file name is the icon name. `@hzblj/kara-ui`'s config plugin turns each
into a template image set in the iOS asset catalog and a vector drawable on Android at prebuild, and writes their names
into `kara-icons.d.ts`. `share.android.svg` replaces `share.svg` on Android, so each platform gets its own share glyph.

These are [Material Symbols](https://github.com/google/material-design-icons) (Outlined, 400) — copyright Google LLC,
Apache License 2.0. An app brings its own: any single-colour SVG made of `<path>`s works.
