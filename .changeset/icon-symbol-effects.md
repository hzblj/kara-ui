---
'@hzblj/kara-ui': minor
'@hzblj/kara-components': minor
'@hzblj/kara-native': minor
---

`Icon` and `RnIcon` play SF Symbols effects (`effect`, once per `effectTrigger` or while `effectActive`), animate a new `name` with a `transition`, and draw `hierarchical`, `palette` and `multicolor` rendering modes (`secondaryColor`, `tertiaryColor`), a `variableValue` and a `gradient`, on both platforms. On iOS `Icon` now draws the custom SF Symbol `@hzblj/expo-native-icons` writes per icon, through the new `symbolStyle` modifier; on Android it hands the icon to expo-native-icons' view when one of these is set. Run a prebuild after upgrading.
