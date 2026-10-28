---
'@hzblj/kara-components': minor
'@hzblj/kara-ui': minor
---

`Island` and `Screen` take `ignoreSafeArea`, one exact type for which insets the native content ignores: `none`, `keyboard`, `container` or `all`. iOS passes it to the SwiftUI host. Android can ignore only the keyboard, and reads the value once, on mount.

`Island` now ignores the keyboard by default. It sits in a React Native layout that moves it for the keyboard itself, and SwiftUI was lifting the content inside it as well. `Screen` keeps clear of everything by default.

Breaking: `Screen`'s `ignoreKeyboardInset` is replaced by `ignoreSafeArea="keyboard"`.
