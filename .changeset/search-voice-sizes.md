---
"@hzblj/kara-native": minor
"@hzblj/kara-components": minor
---

A search field's `voice` takes `sizes`: the clear and microphone glyphs, the stop button and the waveform (its width, height and bars, `barRadius: 0` for flat ones), each keeping its default when left out. New bars grow in from the middle as they come in at the edge, and the waveform keeps flowing while the main thread is busy (`@hzblj/expo-waveform` 0.4.0).
