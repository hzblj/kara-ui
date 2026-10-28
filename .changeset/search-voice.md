---
'@hzblj/kara-native': minor
'@hzblj/kara-components': minor
'@hzblj/kara-ui': minor
---

Search fields can take a voice. Give `useHeaderSearch`, `NavigationBar` or `Sheet.Header` a `voice` and the field gets a microphone: press it and a live waveform with a stop button takes its place, and once the field holds text a clear button sits there instead. kara records nothing, so it adds no microphone or speech permissions: run the dictation yourself (`@hzblj/expo-speech` works out of the box, its transcription drawn as the waveform natively) and write what you hear with the new `setText`. Leave `voice` out to turn it off.

`useHeaderSearch` also takes `placement: 'integratedButton'` (a search button in the bar's corner that opens the field in the bar), `clearIcon` and `cancelIcon`, and closing the integrated search now empties the query. `NavigationBar`'s search takes `clearIcon`. The new `SheetGrabber` from `@hzblj/kara-ui/header` shows the system grabber on a screen presented as a `modal` sheet on iOS.
