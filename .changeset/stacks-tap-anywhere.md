---
'@hzblj/kara-components': patch
---

A pressable `HStack`, `VStack` or `ZStack` on iOS now takes a tap anywhere in its frame, padding and a `Spacer`'s gap included, as it already did on Android. Before, a `LabeledContent` row pressed in its empty middle did nothing.
