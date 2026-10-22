# Third-party notices

## Material Symbols

`android/src/main/res/drawable/kara_glyph_*.xml` are vector drawables converted from
[Material Symbols](https://github.com/google/material-design-icons) (Outlined, weight 400), via the
[`@material-symbols/svg-400`](https://www.npmjs.com/package/@material-symbols/svg-400) package.

Copyright Google LLC. Licensed under the Apache License, Version 2.0 — https://www.apache.org/licenses/LICENSE-2.0

## expo-router

`ios/Views/ZoomTransition/` is adapted from expo-router's zoom transition (`Link.AppleZoom`,
[`ios/LinkPreview/LinkZoomTransition.swift`](https://github.com/expo/expo/blob/main/packages/expo-router/ios/LinkPreview/LinkZoomTransition.swift)):
the source / target / enabler split, registering a view's single child under an identifier, setting
`preferredTransition = .zoom` from the enabler, and the aspect-ratio alignment rect
(`ZoomTransitionEnablerView.rect(_:matchingAspectRatioOf:)`). The registry, the dismissal gate, the context menu
hand-over and the Android side are kara's own.

```
The MIT License (MIT)

Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
