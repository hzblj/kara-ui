---
'@hzblj/kara-components': minor
'@hzblj/kara-native': minor
'@hzblj/kara-ui': minor
---

`DatePicker` takes `datePickerStyle` and `disabled`. `compact`, the pill that opens a calendar, stays the default; `graphical` is the calendar in place, a month at a time (with the time under it in `datetime` mode on iOS), and `wheel` puts the value on wheels. Android shows Material's calendar in place for `graphical` in `date` and `datetime` modes, without its title and headline and in the accent; for `wheel`, and in `time` mode, it keeps its field and dialog, since Material has no wheel. `disabled` dims the picker and ignores taps; Material's calendar has no disabled state of its own, so a disabled `graphical` picker on Android is dimmed and offers only the selected day.

`Slider` takes `onValueChangeEnd`, called once with the final value when the user lets go, so a seek or a volume can commit on release instead of at every step of the drag: SwiftUI's `onEditingChanged` on iOS, Material's `onValueChangeFinished` on Android.

`Stepper` and `RadioGroup` take `disabled`, which dims the row and stops the value changing. `Stepper` also takes `decrementLabel` and `incrementLabel`, what TalkBack says for its minus and plus buttons on Android (`Decrement` and `Increment` unless the app passes its own words); iOS's native stepper labels its buttons itself.

`ColorPicker` takes `disabled`: SwiftUI dims the label and the well and ignores taps on iOS, and on Android kara's own well dims and does not open its sheet, the label dimmed with it.

`Divider` takes `axis`. `vertical` draws Compose's `VerticalDivider` on Android, as tall as the `HStack` around it; SwiftUI's divider already turns by itself in an `HStack`, so iOS ignores it.

`Text` ends a text cut short with an ellipsis on Android too, where `numberOfLines` used to clip it. `truncation` says where the ellipsis goes: `tail`, the default, `head` to keep the end of the text, or `middle` to keep both of its ends, for a path or a file name. Android puts it at the head or in the middle of a single line only, as Compose does, and ends a longer text at the tail; kara-native's `AnimatedText` takes `textOverflow` to draw it. That Compose text, which Android also draws for `animate` and `monospacedDigit`, now reads every string child, so a `Text` like `{count} items` no longer comes out empty there.
