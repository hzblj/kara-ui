---
'@hzblj/kara-components': minor
'@hzblj/kara-ui': minor
---

`TextField` can be set up for the text it takes, so a proper email, password or one-time-code field can be built. `placeholder` is a hint in the empty field; `keyboard` brings up the `email`, `url`, `number`, `decimal` or `phone` keyboard; `autoCapitalize` and `autoCorrect` say how the keyboard treats what is typed, and both turn off by themselves for an email or a URL; `contentType` offers to fill the field in, through iOS AutoFill and, on Android, an autofill service; `maxLength` cuts off what is typed past it. It submits and moves on as well: `submitLabel` names the return key (`done`, `go`, `next`, `search` or `send`), `onSubmit` is called with the text when it is pressed, `autoFocus` focuses the field as it appears, `onFocusChange` reports focus, and a `ref` (`TextFieldRef`, with `focus`, `blur` and `clear`) lets one field's `next` focus the following one. A `multiline` field keeps a return key that starts a new line. On Android a `secure` field now brings up the password keyboard, which suggests and learns nothing.

`SearchBar` takes `onSubmit`, called with the query when the keyboard's return key, which now reads Search, is pressed, and `autoFocus`. A query is taken as typed: capitals and corrections are off by default, and `autoCapitalize` and `autoCorrect` turn them back on.
