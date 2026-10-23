---
"@hzblj/kara-ui": minor
"@hzblj/kara-components": minor
---

`Snackbar` puts its action at the trailing end, as far in from the edge as the message is from the start, and takes Material's options: `duration` (`short`, `long`, `indefinite` or milliseconds, with `onDismiss` when it runs out), `dismissible` (a close button), `actionOnNewLine`, `position` (`bottom` or `top`) and `offset`. `animation` picks how it comes and goes (`scale`, Material's own, by default on Android; `slide` on iOS; `fade`), and `entering` and `exiting` take Reanimated animations of your own. It is announced to VoiceOver and TalkBack when it appears.
