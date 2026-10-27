# @hzblj/kara-ui

## 0.18.0

### Minor Changes

- [#57](https://github.com/hzblj/kara-ui/pull/57) [`262bf11`](https://github.com/hzblj/kara-ui/commit/262bf1130730001da9390df0671bc2c16f7026a7) Thanks [@hzblj](https://github.com/hzblj)! - `Button` takes `variant="plain"`, a text button in the accent with no fill, for the lesser action beside a prominent one ("Skip", "Forgot password?"): SwiftUI's `borderless` style on iOS, padded to a 44pt tap target that the whole label area takes, and Material's `TextButton` on Android. A `tint` colours its label. `Button` also takes `icon`, one of the app's icons before the label and in its colour: a SwiftUI `Label` in the button on iOS, the icon in the button's content row on Android, with Material's tighter padding on the icon side. Screen readers still read the label alone.

  `IconButton` takes `variant`: `plain` (as before, and the default), `filled`, `tonal`, `outlined` or `glass`. iOS draws them as SwiftUI's `borderedProminent`, `bordered` and `glass` styles in a circle, and `outlined` as a plain button in a hairline ring, since SwiftUI has no outlined style; below iOS 26 `glass` is the `bordered` circle. Android draws Material's `FilledIconButton`, `FilledTonalIconButton` and `OutlinedIconButton`, and `glass` as the tonal one: Material has no glass, and a contained button still reads over a photo where an outline would not. A new `color` is the icon's colour, or on `filled` the fill, with the icon picking a colour that reads on it, as a `Button`'s `tint` does.

  `List` takes `variant` and `separators`. `insetGrouped` sets the rows in a rounded card inset from the edges (SwiftUI's `insetGrouped` list style; on Android a `Card` inside the column, as `Form` draws a section), `plain` runs them edge to edge. Each platform keeps its own list by default, `insetGrouped` on iOS and `plain` on Android, so nothing changes until you ask. `separators={false}` drops the lines between rows: iOS hides each row's separator, Android draws no `Divider`.

  `Fab` takes `label`, which makes it an extended FAB with the text beside the icon: Material's `ExtendedFloatingActionButton` on Android, and on iOS kara's own FAB as a 56pt accent capsule. Screen readers say `accessibilityLabel` for the whole button, so give it the label's words. It also takes `size`: `small` (40), `regular` (56, the default) or `large` (96, with a 36 icon), Material's `SmallFloatingActionButton` and `LargeFloatingActionButton` on Android and circles of the same sizes on iOS.

- [#57](https://github.com/hzblj/kara-ui/pull/57) [`262bf11`](https://github.com/hzblj/kara-ui/commit/262bf1130730001da9390df0671bc2c16f7026a7) Thanks [@hzblj](https://github.com/hzblj)! - `DatePicker` takes `datePickerStyle` and `disabled`. `compact`, the pill that opens a calendar, stays the default; `graphical` is the calendar in place, a month at a time (with the time under it in `datetime` mode on iOS), and `wheel` puts the value on wheels. Android shows Material's calendar in place for `graphical` in `date` and `datetime` modes, without its title and headline and in the accent; for `wheel`, and in `time` mode, it keeps its field and dialog, since Material has no wheel. `disabled` dims the picker and ignores taps; Material's calendar has no disabled state of its own, so a disabled `graphical` picker on Android is dimmed and offers only the selected day.

  `Slider` takes `onValueChangeEnd`, called once with the final value when the user lets go, so a seek or a volume can commit on release instead of at every step of the drag: SwiftUI's `onEditingChanged` on iOS, Material's `onValueChangeFinished` on Android.

  `Stepper` and `RadioGroup` take `disabled`, which dims the row and stops the value changing. `Stepper` also takes `decrementLabel` and `incrementLabel`, what TalkBack says for its minus and plus buttons on Android (`Decrement` and `Increment` unless the app passes its own words); iOS's native stepper labels its buttons itself.

  `ColorPicker` takes `disabled`: SwiftUI dims the label and the well and ignores taps on iOS, and on Android kara's own well dims and does not open its sheet, the label dimmed with it.

  `Divider` takes `axis`. `vertical` draws Compose's `VerticalDivider` on Android, as tall as the `HStack` around it; SwiftUI's divider already turns by itself in an `HStack`, so iOS ignores it.

  `Text` ends a text cut short with an ellipsis on Android too, where `numberOfLines` used to clip it. `truncation` says where the ellipsis goes: `tail`, the default, `head` to keep the end of the text, or `middle` to keep both of its ends, for a path or a file name. Android puts it at the head or in the middle of a single line only, as Compose does, and ends a longer text at the tail; kara-native's `AnimatedText` takes `textOverflow` to draw it. That Compose text, which Android also draws for `animate` and `monospacedDigit`, now reads every string child, so a `Text` like `{count} items` no longer comes out empty there.

- [#57](https://github.com/hzblj/kara-ui/pull/57) [`262bf11`](https://github.com/hzblj/kara-ui/commit/262bf1130730001da9390df0671bc2c16f7026a7) Thanks [@hzblj](https://github.com/hzblj)! - `Alert` takes `cancelLabel`: the cancel button's label, so an app in another language no longer shows an English "Cancel" beside its own confirm label. `Cancel` stays the default, and `null` leaves the button out, for an alert that only informs and is closed by its confirm button alone.

  `ActionSheet` takes a `message`: the confirmation dialog's own message under the title on iOS, a line under the title on Android. The title now shows on iOS too, where SwiftUI hid it by default and the actions lost what they were about.

  `Menu` can open from an icon. `icon` sits before the `label` in the same colour, or stands alone as an `IconButton` that opens the menu, with an `accessibilityLabel` the types require when there is no label. iOS now draws each action's `icon` in the menu, as Android already did.

  `MenuAction` takes `disabled`: the action stays in the list, greyed, and does not respond. `Menu`, `ActionSheet` and `ContextMenu` honour it on both platforms (the iOS context menu marks its `UIAction` disabled in kara-native's `ContextMenuView`, so it needs a native rebuild), `FabMenu` on iOS only, since Material's FAB menu items have no disabled state.

  `Progress` takes `color`, any colour token: `fill.destructive.primary` for storage nearly full, `fill.success.primary` for a goal reached. `fill.accent.primary` stays the default. On Android a bar in another colour gets a track in that colour, faded, rather than Material's pale accent under it.

- [#53](https://github.com/hzblj/kara-ui/pull/53) [`d31ac23`](https://github.com/hzblj/kara-ui/commit/d31ac23ae6cdb27948148b14d7d7abb0611ab3f9) Thanks [@hzblj](https://github.com/hzblj)! - `Sheet` takes `systemBackground`: on iOS the sheet keeps the system's own background instead of `bg`, which is untinted Liquid Glass on iOS 26 and a material blur before it. Use it for a sheet that floats over content it should let through, such as a map. Android keeps `bg`.

- [#57](https://github.com/hzblj/kara-ui/pull/57) [`262bf11`](https://github.com/hzblj/kara-ui/commit/262bf1130730001da9390df0671bc2c16f7026a7) Thanks [@hzblj](https://github.com/hzblj)! - `testID` works on both platforms, so Maestro and other end-to-end tests can find a control by it: the accessibility identifier on iOS, the Compose test tag (exposed as the resource id) on Android. `Switch`, `Checkbox`, `Slider`, `Stepper`, `RadioGroup`, `Menu`, `Collapsible`, `Progress` and `Badge` take it for the first time, and `TextField`, `IconButton`, `Fab`, `Divider` and `List`, which only forwarded it on iOS, now tag their Compose views too. It lands on the control a test taps or reads rather than on a row around it: the switch or the box beside its label, the field below its label, a `Menu`'s trigger, a `Stepper`'s buttons and value, a `Collapsible`'s row.

- [#57](https://github.com/hzblj/kara-ui/pull/57) [`262bf11`](https://github.com/hzblj/kara-ui/commit/262bf1130730001da9390df0671bc2c16f7026a7) Thanks [@hzblj](https://github.com/hzblj)! - `TextField` can be set up for the text it takes, so a proper email, password or one-time-code field can be built. `placeholder` is a hint in the empty field; `keyboard` brings up the `email`, `url`, `number`, `decimal` or `phone` keyboard; `autoCapitalize` and `autoCorrect` say how the keyboard treats what is typed, and both turn off by themselves for an email or a URL; `contentType` offers to fill the field in, through iOS AutoFill and, on Android, an autofill service; `maxLength` cuts off what is typed past it. It submits and moves on as well: `submitLabel` names the return key (`done`, `go`, `next`, `search` or `send`), `onSubmit` is called with the text when it is pressed, `autoFocus` focuses the field as it appears, `onFocusChange` reports focus, and a `ref` (`TextFieldRef`, with `focus`, `blur` and `clear`) lets one field's `next` focus the following one. A `multiline` field keeps a return key that starts a new line. On Android a `secure` field now brings up the password keyboard, which suggests and learns nothing.

  `SearchBar` takes `onSubmit`, called with the query when the keyboard's return key, which now reads Search, is pressed, and `autoFocus`. A query is taken as typed: capitals and corrections are off by default, and `autoCapitalize` and `autoCorrect` turn them back on.

### Patch Changes

- Updated dependencies [[`262bf11`](https://github.com/hzblj/kara-ui/commit/262bf1130730001da9390df0671bc2c16f7026a7), [`262bf11`](https://github.com/hzblj/kara-ui/commit/262bf1130730001da9390df0671bc2c16f7026a7), [`262bf11`](https://github.com/hzblj/kara-ui/commit/262bf1130730001da9390df0671bc2c16f7026a7), [`d31ac23`](https://github.com/hzblj/kara-ui/commit/d31ac23ae6cdb27948148b14d7d7abb0611ab3f9), [`262bf11`](https://github.com/hzblj/kara-ui/commit/262bf1130730001da9390df0671bc2c16f7026a7), [`262bf11`](https://github.com/hzblj/kara-ui/commit/262bf1130730001da9390df0671bc2c16f7026a7)]:
  - @hzblj/kara-components@0.18.0
  - @hzblj/kara-native@0.18.0
  - @hzblj/kara-router@0.18.0
  - @hzblj/kara-sx@0.18.0
  - @hzblj/kara-theme@0.18.0
  - @hzblj/kara-expo-plugin@0.18.0

## 0.17.0

### Minor Changes

- [#54](https://github.com/hzblj/kara-ui/pull/54) [`76f14b5`](https://github.com/hzblj/kara-ui/commit/76f14b5e71bdbb8fb431502a987e776243015177) Thanks [@hzblj](https://github.com/hzblj)! - `Picker` takes `pickerStyle` on iOS: `wheel`, as before and still the default, or `menu`, a button with the selection, in the accent, that opens the options as a menu. A screen with more than one picker, or a picker in a row, no longer has to give the screen to wheels. Android ignores it: its exposed dropdown is a menu already.

### Patch Changes

- Updated dependencies [[`76f14b5`](https://github.com/hzblj/kara-ui/commit/76f14b5e71bdbb8fb431502a987e776243015177)]:
  - @hzblj/kara-components@0.17.0
  - @hzblj/kara-router@0.17.0
  - @hzblj/kara-theme@0.17.0
  - @hzblj/kara-sx@0.17.0
  - @hzblj/kara-native@0.17.0
  - @hzblj/kara-expo-plugin@0.17.0

## 0.16.0

### Minor Changes

- [#49](https://github.com/hzblj/kara-ui/pull/49) [`1b82690`](https://github.com/hzblj/kara-ui/commit/1b826908a729399b4b9ef8038836b60539d1fa41) Thanks [@hzblj](https://github.com/hzblj)! - A tapped `ContextMenu` preview can morph into a screen that is already loaded, the way Apple's apps open a preview. Preload the detail in the new `onOpenChange` (React Navigation's `preload`) and pass its route key as `preloadedScreenId`: the screen is pushed natively in the same frame, and with `zoom` the whole preview grows into it, rounded and shadowed like the menu's platter, while the menu fades away. `pop` and `dismiss` push it as soon as UIKit's commit animation ends. Uses `@hzblj/expo-zoom-transition` 0.2.

### Patch Changes

- Updated dependencies [[`1b82690`](https://github.com/hzblj/kara-ui/commit/1b826908a729399b4b9ef8038836b60539d1fa41), [`1b82690`](https://github.com/hzblj/kara-ui/commit/1b826908a729399b4b9ef8038836b60539d1fa41)]:
  - @hzblj/kara-native@0.16.0
  - @hzblj/kara-components@0.16.0
  - @hzblj/kara-router@0.16.0
  - @hzblj/kara-sx@0.16.0
  - @hzblj/kara-theme@0.16.0
  - @hzblj/kara-expo-plugin@0.16.0

## 0.15.4

### Patch Changes

- [#48](https://github.com/hzblj/kara-ui/pull/48) [`15aa9db`](https://github.com/hzblj/kara-ui/commit/15aa9db0b1c22dd4a55cb301982643449ad28dd0) Thanks [@hzblj](https://github.com/hzblj)! - A long press on a `ContextMenu` trigger opens only its menu on iOS. Lifting the finger after the menu appears no longer also fires a `Pressable` inside the trigger, so a card no longer opens its screen under the menu. On iOS 27 a tapped preview zooms into the pushed screen again instead of closing the menu first.

- Updated dependencies [[`15aa9db`](https://github.com/hzblj/kara-ui/commit/15aa9db0b1c22dd4a55cb301982643449ad28dd0)]:
  - @hzblj/kara-native@0.15.4
  - @hzblj/kara-theme@0.15.4
  - @hzblj/kara-sx@0.15.4
  - @hzblj/kara-components@0.15.4
  - @hzblj/kara-router@0.15.4
  - @hzblj/kara-expo-plugin@0.15.4

## 0.15.3

### Patch Changes

- Updated dependencies [[`91f4285`](https://github.com/hzblj/kara-ui/commit/91f42856d2acc0d03fb9836a718c5deba758a29f)]:
  - @hzblj/kara-components@0.15.3
  - @hzblj/kara-theme@0.15.3
  - @hzblj/kara-sx@0.15.3
  - @hzblj/kara-native@0.15.3
  - @hzblj/kara-router@0.15.3
  - @hzblj/kara-expo-plugin@0.15.3

## 0.15.2

### Patch Changes

- [`42131a8`](https://github.com/hzblj/kara-ui/commit/42131a8f039a2baf4fe146a0cb3e9433781bf2bb) Thanks [@hzblj](https://github.com/hzblj)! - The README shows the example app on iOS and Android.

- Updated dependencies []:
  - @hzblj/kara-theme@0.15.2
  - @hzblj/kara-sx@0.15.2
  - @hzblj/kara-native@0.15.2
  - @hzblj/kara-components@0.15.2
  - @hzblj/kara-router@0.15.2
  - @hzblj/kara-expo-plugin@0.15.2

## 0.15.1

### Patch Changes

- [`5d585b5`](https://github.com/hzblj/kara-ui/commit/5d585b51f56d590e6417d8bad94ed192fdb49e39) Thanks [@hzblj](https://github.com/hzblj)! - Every package ships the MIT LICENSE, which its tarball was missing.

- Updated dependencies []:
  - @hzblj/kara-theme@0.15.1
  - @hzblj/kara-sx@0.15.1
  - @hzblj/kara-native@0.15.1
  - @hzblj/kara-components@0.15.1
  - @hzblj/kara-router@0.15.1
  - @hzblj/kara-expo-plugin@0.15.1

## 0.15.0

### Minor Changes

- [#43](https://github.com/hzblj/kara-ui/pull/43) [`2ff941d`](https://github.com/hzblj/kara-ui/commit/2ff941d989cef86f8cdea39483945e760153a90f) Thanks [@hzblj](https://github.com/hzblj)! - `Text` and `RnText` take `monospaced` and `monospacedDigit`. `monospaced` sets the text in the theme's fixed-width face at its variant's size and weight: a new `fonts.mono` role in `ThemeConfig` for a face of the app's own (JetBrains Mono beside Inter, say), else Menlo on iOS and `monospace` on Android, the same face in both tiers. `monospacedDigit` keeps whatever face the text has and asks it for tabular figures, so a price or a counter does not shift as it changes: SwiftUI's `monospacedDigit()`, React Native's `fontVariant: ['tabular-nums']`, and `tnum` on Compose. `theme.monoTypography` is the scale `monospaced` reads. `ios.monospacedDigit` is gone from `sx`: use the `monospacedDigit` prop, which now works on Android too. Rebuild the native app.

### Patch Changes

- Updated dependencies [[`2ff941d`](https://github.com/hzblj/kara-ui/commit/2ff941d989cef86f8cdea39483945e760153a90f)]:
  - @hzblj/kara-components@0.15.0
  - @hzblj/kara-native@0.15.0
  - @hzblj/kara-sx@0.15.0
  - @hzblj/kara-theme@0.15.0
  - @hzblj/kara-router@0.15.0
  - @hzblj/kara-expo-plugin@0.15.0

## 0.14.2

### Patch Changes

- [`e8074f2`](https://github.com/hzblj/kara-ui/commit/e8074f23ddf0e1f6a34c25a71b29165bcd5b3d5e) Thanks [@hzblj](https://github.com/hzblj)! - The README links to the other libraries, at libraries.janblazej.dev.

- Updated dependencies []:
  - @hzblj/kara-theme@0.14.2
  - @hzblj/kara-sx@0.14.2
  - @hzblj/kara-native@0.14.2
  - @hzblj/kara-components@0.14.2
  - @hzblj/kara-router@0.14.2
  - @hzblj/kara-expo-plugin@0.14.2

## 0.14.1

### Patch Changes

- [#40](https://github.com/hzblj/kara-ui/pull/40) [`7c06e82`](https://github.com/hzblj/kara-ui/commit/7c06e82e6380bd52388237c9fa2b49455f971aee) Thanks [@hzblj](https://github.com/hzblj)! - `SegmentedControl`, `ActivityIndicator` and `DatePicker` work inside a `Screen` or `Island`, next to other native views, the way `Picker` now does. Each is made to drop into React Native layout on its own, so it brought a host of its own or was a plain React Native view, and inside an island that broke the island. On Android a `SegmentedControl` left the views beside it no width (a multiline `TextField` vanished and the island ran past the screen), an `ActivityIndicator` emptied the island, and a `DatePicker` field did not show. On iOS the segmented control swelled and squashed the field above it, the spinner drifted off its row, and the date pill came loose from its label. Inside a host each now renders into that host; on its own nothing changes.

- [#40](https://github.com/hzblj/kara-ui/pull/40) [`7c06e82`](https://github.com/hzblj/kara-ui/commit/7c06e82e6380bd52388237c9fa2b49455f971aee) Thanks [@hzblj](https://github.com/hzblj)! - `Picker` works inside a `Screen` or `Island`, next to other native views. It brought a host of its own even there, and a host nested in another one broke the island around it: on Android the nested host took the island's whole width, so the views beside the picker disappeared (a multiline `TextField` was measured a letter wide and pushed the island far past the screen), and on iOS the wheel got no height and spilled over them. Inside a host the picker now renders into that host; on its own it still brings one.

- Updated dependencies [[`7c06e82`](https://github.com/hzblj/kara-ui/commit/7c06e82e6380bd52388237c9fa2b49455f971aee), [`7c06e82`](https://github.com/hzblj/kara-ui/commit/7c06e82e6380bd52388237c9fa2b49455f971aee)]:
  - @hzblj/kara-components@0.14.1
  - @hzblj/kara-theme@0.14.1
  - @hzblj/kara-sx@0.14.1
  - @hzblj/kara-native@0.14.1
  - @hzblj/kara-router@0.14.1
  - @hzblj/kara-expo-plugin@0.14.1

## 0.14.0

### Minor Changes

- [#38](https://github.com/hzblj/kara-ui/pull/38) [`40ddb25`](https://github.com/hzblj/kara-ui/commit/40ddb254b85e95c4e86d79f5ce71c3c004598a59) Thanks [@hzblj](https://github.com/hzblj)! - `Text` takes spans and eases their colours. Nested `Text` children are runs of one paragraph, each in a `color` of its own (`<Text>Box, box. <Text color="content.accent">Box this lap</Text></Text>`), and with `animate` a colour that changes, the text's or a span's, eases to its new value on the motion tokens instead of switching: a word lit as it is said, a phrase brought forward. SwiftUI interpolates the text; on Android each span animates its colour natively. Colours keep easing with Reduce Motion on. Rebuild the native app.

### Patch Changes

- Updated dependencies [[`40ddb25`](https://github.com/hzblj/kara-ui/commit/40ddb254b85e95c4e86d79f5ce71c3c004598a59)]:
  - @hzblj/kara-components@0.14.0
  - @hzblj/kara-native@0.14.0
  - @hzblj/kara-sx@0.14.0
  - @hzblj/kara-router@0.14.0
  - @hzblj/kara-theme@0.14.0
  - @hzblj/kara-expo-plugin@0.14.0

## 0.13.2

### Patch Changes

- [#36](https://github.com/hzblj/kara-ui/pull/36) [`cef8ad3`](https://github.com/hzblj/kara-ui/commit/cef8ad3f70d2dbf598c31a91bc524dde8f85a761) Thanks [@hzblj](https://github.com/hzblj)! - Fixed a crash at launch on iOS when two React runtimes start at the same time, as when a dev client is opened through its deep link while it launches, or the app reloads during startup. Each runtime registered kara's native modifiers into `@expo/ui`'s shared registry, and two registering at once corrupted it. On both platforms the modifiers are now registered once per process, whichever runtime comes first, and a reload no longer registers them again. On Android, a runtime that goes away no longer unregisters `underline` and the accessibility modifier while another runtime still uses them. Rebuild the native app.

- Updated dependencies [[`cef8ad3`](https://github.com/hzblj/kara-ui/commit/cef8ad3f70d2dbf598c31a91bc524dde8f85a761)]:
  - @hzblj/kara-native@0.13.2
  - @hzblj/kara-theme@0.13.2
  - @hzblj/kara-sx@0.13.2
  - @hzblj/kara-components@0.13.2
  - @hzblj/kara-router@0.13.2
  - @hzblj/kara-expo-plugin@0.13.2

## 0.13.1

### Patch Changes

- [#34](https://github.com/hzblj/kara-ui/pull/34) [`3691a12`](https://github.com/hzblj/kara-ui/commit/3691a1255908dd1c8f1cb4d2bd5ce8f679e95a81) Thanks [@hzblj](https://github.com/hzblj)! - `SegmentedControl` on Android draws one outline around every segment, the selected one too. Its accent border used to run the fill out over the line the other segments draw inside, so the selected segment looked taller than its neighbours.

- Updated dependencies [[`3691a12`](https://github.com/hzblj/kara-ui/commit/3691a1255908dd1c8f1cb4d2bd5ce8f679e95a81)]:
  - @hzblj/kara-components@0.13.1
  - @hzblj/kara-theme@0.13.1
  - @hzblj/kara-sx@0.13.1
  - @hzblj/kara-native@0.13.1
  - @hzblj/kara-router@0.13.1
  - @hzblj/kara-expo-plugin@0.13.1

## 0.13.0

### Minor Changes

- [#30](https://github.com/hzblj/kara-ui/pull/30) [`5d5265a`](https://github.com/hzblj/kara-ui/commit/5d5265a5da215c3e5559ba5144b27d53d1e3690f) Thanks [@hzblj](https://github.com/hzblj)! - Haptics move to a package of their own, [`@hzblj/expo-rich-haptics`](https://github.com/hzblj/expo-rich-haptics), which kara now depends on, so any Expo app can use them. kara no longer exports `haptics`, `useHapticFeedback`, `Haptic` or `HAPTICS`: add the package to your app (`npx expo install @hzblj/expo-rich-haptics`) and import them from it. The names and calls are the same, and the components play the same haptics. The package adds patterns of your own (Android's haptic primitives on a timeline, which iOS plays through Core Haptics), plus `intensity` and a warning of its own on Android devices that have primitives. `@hzblj/kara-native` drops `playHaptic`, `prepareHaptic` and `HAPTICS`. Rebuild the native app to pick up the new module.

- [#31](https://github.com/hzblj/kara-ui/pull/31) [`4b20462`](https://github.com/hzblj/kara-ui/commit/4b204621670b6f640fc04bffa527007dda9e06a8) Thanks [@hzblj](https://github.com/hzblj)! - Icons and the zoom transition now come from two standalone packages, which work without kara too.

  - **Icons: [@hzblj/expo-native-icons](https://www.npmjs.com/package/@hzblj/expo-native-icons).** The config plugin is the same (`plugins: [['@hzblj/kara-ui', {icons: {source: './assets/icons'}}]]`, the same options, `npx kara-icons` still works). The names change: the declaration is now `native-icons.d.ts` with the global `NativeIcons` (it was `kara-icons.d.ts` and `KaraIcons`), and each icon is `native_icon_<name>` natively (it was `kara_icon_<name>`). Delete the old `kara-icons.d.ts`, and run `expo prebuild --clean` once so the old assets go. `RnIcon` is now the package's `NativeIcon`: on Android it draws the drawable itself instead of hosting an `ImageView`, and remembers each icon's resource lookup, so a list of rows does less work. A glyph with a non-square viewBox no longer stretches on Android.
  - **Zoom transition: [@hzblj/expo-zoom-transition](https://www.npmjs.com/package/@hzblj/expo-zoom-transition).** `ZoomTransition` and its helpers from `@hzblj/kara-ui/router` are unchanged: kara's tokens over the package. The native code moved out of `@hzblj/kara-native` into the package's own module, which `@hzblj/kara-native` depends on, so autolinking picks it up. A tapped context menu preview still zooms. Rebuild the native app.
  - `iconResourceName` moved from `@hzblj/kara-native` to `@hzblj/expo-native-icons`, and `@hzblj/kara-expo-plugin` no longer exports the icon generator or `./cli`: import them from `@hzblj/expo-native-icons/plugin` and `@hzblj/expo-native-icons/cli`.

### Patch Changes

- Updated dependencies [[`5d5265a`](https://github.com/hzblj/kara-ui/commit/5d5265a5da215c3e5559ba5144b27d53d1e3690f), [`4b20462`](https://github.com/hzblj/kara-ui/commit/4b204621670b6f640fc04bffa527007dda9e06a8)]:
  - @hzblj/kara-components@0.13.0
  - @hzblj/kara-native@0.13.0
  - @hzblj/kara-expo-plugin@0.13.0
  - @hzblj/kara-router@0.13.0
  - @hzblj/kara-sx@0.13.0
  - @hzblj/kara-theme@0.13.0

## 0.12.0

### Minor Changes

- [#28](https://github.com/hzblj/kara-ui/pull/28) [`84ddbac`](https://github.com/hzblj/kara-ui/commit/84ddbacba9f35d578fa7dfce3e9f696ae09771f8) Thanks [@hzblj](https://github.com/hzblj)! - Motion in the engine. Every `sx` view (`Box`, `Image`, anything wrapped with `sx()`), `RnText` and `Pressable` take `entering`, `exiting`, `layout` and `animate`, and become a Reanimated view by themselves when they do, or when their `style` comes from `useAnimatedStyle`. Without them a `Box` stays a plain `View` and costs nothing more. `ABox` is gone: use `Box`, and pass `animated` to one whose animated style only arrives after it mounts.

  - `entering` and `exiting` take a preset named by the way the view moves (`fade`, `fadeUp`, `fadeDown`, `scale`), a preset adjusted (`{preset: 'scale', duration: 'slow', delay: 120}`, or with a `spring`), or Reanimated's own builder. Arriving takes `fast` and leaving `quick`; with motion reduced every preset fades.
  - `animate` carries a change of the colours, `opacity` and the transform over to the new value on the UI thread, through Reanimated's CSS transitions: `animate`, `animate="slow"`, `animate="snappy"` or a config whose `keys` can add sizes, radii and blur. On iOS the UIKit colours a transition cannot read are resolved to the values UIKit draws (`resolveSystemColor` in `@hzblj/kara-native`, a native rebuild picks it up), so a selected row blends on both platforms.
  - `layout` moves a view into its new place on the `smooth` spring, or a spring token, a timed config or Reanimated's own transition. It snaps with motion reduced.
  - The native views take `animate` too: SwiftUI's `.animation(_:value:)` on iOS, animated `graphicsLayer` values, a `background` animation spec and `animateContentSize` on Android, on the same tokens.

  New `Stagger`: a `Box` whose children arrive one after another, a step (`interval`, `stagger` by default) apart. Only the children that arrive together take turns, so the next page of a list staggers while an item added on its own appears at once. A `Box`, `RnText` or `Pressable` child takes the motion directly; any other is wrapped in a `Box`.

  Springs as tokens: `springs` in `@hzblj/kara-theme` holds SwiftUI's set (`interactive`, `smooth`, `snappy`, `bouncy`), a perceptual duration and a bounce each, and `springPhysics` turns one into the physics every platform runs, so a token is one curve in Reanimated, in a CSS transition, in SwiftUI and in Compose. `spring(name)` and `timing(size, curve)` (moved here from the components) give `withSpring` and `withTiming` configs, and `useEntering`, `useExiting` and `useLayoutTransition` hand kara's presets to a Reanimated view of your own.

  `Pressable` presses on springs, down on `interactive` and back on `smooth`, so a press let go halfway eases back instead of turning on the spot. `Snackbar`'s `entering` and `exiting` take the presets too.

- [#28](https://github.com/hzblj/kara-ui/pull/28) [`84ddbac`](https://github.com/hzblj/kara-ui/commit/84ddbacba9f35d578fa7dfce3e9f696ae09771f8) Thanks [@hzblj](https://github.com/hzblj)! - Layout shorthands on the React Native `sx`: `row`, `center`, `fill` (`flex: 1`), `absolute` (out of the flow and over the parent, all four edges at 0) and `size` (width and height at once), and `wrap`, `grow` and `shrink` take `true`. Each gives way to the key it stands for, so `flexDirection`, `align`, `flex`, `position`, a side of its own or `w` and `h` beside one win. All of them take a value per breakpoint.

### Patch Changes

- [#28](https://github.com/hzblj/kara-ui/pull/28) [`84ddbac`](https://github.com/hzblj/kara-ui/commit/84ddbacba9f35d578fa7dfce3e9f696ae09771f8) Thanks [@hzblj](https://github.com/hzblj)! - Faster styling. A resolved React Native style carries only the keys a call site set, where it used to carry forty-odd more as `undefined`, each walked on every mount. Views with the same native `sx` share one resolved modifier array, as they already shared a style, and `sx()` splits its props, the motion props included, in a single walk. `RnText` reads the user's text size from one subscription at the root (`useFontScale`, provided with the breakpoint) instead of one per text, and shares its text style the way `sx` shares its own.

  `RnText` no longer loses its last line on iOS when React Native lays the paragraph out a hair shorter than its lines need, which happened depending on where the text sat on the page.

- Updated dependencies [[`84ddbac`](https://github.com/hzblj/kara-ui/commit/84ddbacba9f35d578fa7dfce3e9f696ae09771f8), [`84ddbac`](https://github.com/hzblj/kara-ui/commit/84ddbacba9f35d578fa7dfce3e9f696ae09771f8), [`84ddbac`](https://github.com/hzblj/kara-ui/commit/84ddbacba9f35d578fa7dfce3e9f696ae09771f8)]:
  - @hzblj/kara-sx@0.12.0
  - @hzblj/kara-components@0.12.0
  - @hzblj/kara-theme@0.12.0
  - @hzblj/kara-native@0.12.0
  - @hzblj/kara-router@0.12.0
  - @hzblj/kara-expo-plugin@0.12.0

## 0.11.0

### Minor Changes

- [#25](https://github.com/hzblj/kara-ui/pull/25) [`6828522`](https://github.com/hzblj/kara-ui/commit/68285220a725ccfcd2c2bd9a4bcc7eb3a7f8a047) Thanks [@hzblj](https://github.com/hzblj)! - Accessibility props in the engine: `accessibilityLabel`, `accessibilityHint`, `accessibilityRole` (`button`, `header`, `image`, `link`, `text`), `accessibilityValue`, `accessibilityHidden` and `accessible`, one set for both platforms. `@hzblj/kara-sx` turns them into SwiftUI's accessibility modifiers on iOS and into Compose semantics on Android, through a new `karaAccessibility` modifier in `@hzblj/kara-native` (a native rebuild picks it up). The stacks, `Text`, `Card`, `Surface`, `ListItem`, `RnListItem`, `LabeledContent`, `Link` and `Pressable` take all of them; `Button` takes a hint, and `Avatar`, `Progress` and `ActivityIndicator` a label.

  What the components do by themselves: a stack with `onPress` is read as one button, `Pressable` is a button, list rows and a `LabeledContent` with a value are read as one element, `Link` is a link, and `Skeleton` and an `Avatar` without a label are hidden. `IconButton`, `Fab` and `FabMenu` now require an `accessibilityLabel`, since an icon has nothing of its own for VoiceOver or TalkBack to say; `Snackbar`'s close button is labelled.

  Reduce Motion: `useReducedMotion()` follows the device's Reduce Motion (iOS) or Remove animations (Android) setting live, and `KaraProvider reduceMotion` can force it (`always`) or ignore it (`never`). With motion reduced, `Pressable` dims instead of scaling, `Snackbar` only fades, `Skeleton` holds still, Android's `Collapsible` fades and snaps its chevron, and iOS's `Stepper` cross-fades its value.

- [#25](https://github.com/hzblj/kara-ui/pull/25) [`6828522`](https://github.com/hzblj/kara-ui/commit/68285220a725ccfcd2c2bd9a4bcc7eb3a7f8a047) Thanks [@hzblj](https://github.com/hzblj)! - Motion tokens on transitions.dev's scale, in place of the `d0` to `d10000` steps, of which six were ever used. Durations are named by what the motion does: `micro` (80 ms, what answers a touch), `quick` (150 ms, something leaving or swapped in place), `fast` (250 ms, something arriving), `medium` (350 ms, a larger surface leaving), `slow` (400 ms, a larger surface arriving), `verySlow` (500 ms, an emphasised moment), `stagger` (40 ms, the offset between items) and `none`. Pick a step by what the motion does, not by the number it had: as a rule of thumb, `d100` is `micro`, `d150` `quick`, `d200` `quick` or `fast`, `d250` and `d300` `fast`, `d400` `slow` and `d500` `verySlow`. `ZoomTransition`'s Android `duration` takes the same names and, unset, keeps Material's own 450 ms.

  New `easing` tokens carry the curves as cubic-bézier points, ready for `Easing.bezier(...easing.smoothOut)`: `smoothOut` for arriving and leaving alike, `inOut` for a swap in place, `out` for a small fade, `linear` for what loops.

  The components use them: `Pressable` eases its scale down in `quick` and back in `fast` with no bounce, and dims in `micro`; `Snackbar` arrives in `fast` and leaves in `quick` on `smoothOut`; `Image` fades in over `quick`.

  `content.on.bg` is `content.on.accent`, which is what it sits on (Material's `onPrimary` under `dynamicColor`). The opacity and spacing scales keep their values and are documented now: the opacity ramp's tens and quarters, and spacing's 4 pt grid with half steps where small gaps need them.

- [#25](https://github.com/hzblj/kara-ui/pull/25) [`6828522`](https://github.com/hzblj/kara-ui/commit/68285220a725ccfcd2c2bd9a4bcc7eb3a7f8a047) Thanks [@hzblj](https://github.com/hzblj)! - `Snackbar` puts its action at the trailing end, as far in from the edge as the message is from the start, and takes Material's options: `duration` (`short`, `long`, `indefinite` or milliseconds, with `onDismiss` when it runs out), `dismissible` (a close button), `actionOnNewLine`, `position` (`bottom` or `top`) and `offset`. `animation` picks how it comes and goes (`scale`, Material's own, by default on Android; `slide` on iOS; `fade`), and `entering` and `exiting` take Reanimated animations of your own. It is announced to VoiceOver and TalkBack when it appears.

### Patch Changes

- Updated dependencies [[`6828522`](https://github.com/hzblj/kara-ui/commit/68285220a725ccfcd2c2bd9a4bcc7eb3a7f8a047), [`6828522`](https://github.com/hzblj/kara-ui/commit/68285220a725ccfcd2c2bd9a4bcc7eb3a7f8a047), [`6828522`](https://github.com/hzblj/kara-ui/commit/68285220a725ccfcd2c2bd9a4bcc7eb3a7f8a047)]:
  - @hzblj/kara-sx@0.11.0
  - @hzblj/kara-native@0.11.0
  - @hzblj/kara-theme@0.11.0
  - @hzblj/kara-components@0.11.0
  - @hzblj/kara-router@0.11.0
  - @hzblj/kara-expo-plugin@0.11.0

## 0.10.0

### Minor Changes

- [#23](https://github.com/hzblj/kara-ui/pull/23) [`26f1651`](https://github.com/hzblj/kara-ui/commit/26f1651b6a8be9fc2d7af6bbe29bd2335605a717) Thanks [@hzblj](https://github.com/hzblj)! - `ColorPicker` works on Android. Compose ships no colour picker, so kara draws its own in the iOS picker's shape: a well with a rainbow ring beside the label, and a Material bottom sheet with a grid of swatches, a spectrum and RGB sliders, an opacity slider with `supportsOpacity`, and the colour with its hex at the foot. It reports every change through `onValueChange`, as `#RRGGBB` or, with opacity, `#RRGGBBAA`. It needs no extra dependency.

  `Pressable` takes a `pressEffect`: `scale` springs the content down to `pressedScale` (0.96), `opacity` dims it to `pressedOpacity` (`o60`), `none` holds it still. Each platform keeps its own by default, a spring on iOS and the ripple on Android, and Android keeps the ripple on top of any effect unless `ripple` is off.

  `IconButton` on iOS sits in a 44pt tap target with the icon centred, as Android's sits in Material's 48dp, so a row of them spaces itself the same way on both. A disabled one is dimmed once, by SwiftUI, instead of twice.

### Patch Changes

- [#23](https://github.com/hzblj/kara-ui/pull/23) [`26f1651`](https://github.com/hzblj/kara-ui/commit/26f1651b6a8be9fc2d7af6bbe29bd2335605a717) Thanks [@hzblj](https://github.com/hzblj)! - `ScrollEdgeContainer` on iOS 27 blurs under the whole bar again. iOS 27 stopped counting the invisible button each bar sits on as a scroll edge element, so the blur stopped at the status bar or the navigation bar and content under the bar stayed sharp; a hidden text element now counts for it, and iOS 26 measures as before.

  `ScrollViewZPosition` (`@hzblj/kara-ui/swift-ui`) raises the React Native scroll view it sits in above its later siblings without reordering them, which Fabric's `zIndex` does. A large title anchored in an empty scroll view under the content stays visible on iOS 27, whose edge effect blurs only what lies under it.

- Updated dependencies [[`26f1651`](https://github.com/hzblj/kara-ui/commit/26f1651b6a8be9fc2d7af6bbe29bd2335605a717), [`26f1651`](https://github.com/hzblj/kara-ui/commit/26f1651b6a8be9fc2d7af6bbe29bd2335605a717)]:
  - @hzblj/kara-components@0.10.0
  - @hzblj/kara-native@0.10.0
  - @hzblj/kara-router@0.10.0
  - @hzblj/kara-theme@0.10.0
  - @hzblj/kara-sx@0.10.0
  - @hzblj/kara-expo-plugin@0.10.0

## 0.9.0

### Minor Changes

- [#21](https://github.com/hzblj/kara-ui/pull/21) [`356c00f`](https://github.com/hzblj/kara-ui/commit/356c00f76eee8323c4eb65ed4cbcda121c3af627) Thanks [@hzblj](https://github.com/hzblj)! - `TextField`'s `error` takes a message: `error="A postcode has five digits."` shows it under the field (Material's supporting text beside its error icon on Android), so an error never rests on colour alone, which in dark mode Material draws a pale red. `error` alone still marks the field. kara's glyphs gain `error` for it.

  `Tabs` on iOS tint their icons: the selected one takes the accent and the rest the label colour. Expo Router tints an asset-catalog icon only when both states have an icon colour, so with the accent alone every icon kept its SVG's black, selected or not, in dark mode too.

  `Surface` on iOS sits on `surface.primary` unless told otherwise, as it does on Android; a plain one drew nothing behind its content. `Progress` with `circular` and a `value` is a ring that fills on iOS (a SwiftUI capacity `Gauge`), where a circular `ProgressView` ignored the value and spun.

### Patch Changes

- Updated dependencies [[`356c00f`](https://github.com/hzblj/kara-ui/commit/356c00f76eee8323c4eb65ed4cbcda121c3af627)]:
  - @hzblj/kara-components@0.9.0
  - @hzblj/kara-native@0.9.0
  - @hzblj/kara-router@0.9.0
  - @hzblj/kara-theme@0.9.0
  - @hzblj/kara-sx@0.9.0
  - @hzblj/kara-expo-plugin@0.9.0

## 0.8.0

### Minor Changes

- [#17](https://github.com/hzblj/kara-ui/pull/17) [`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29) Thanks [@hzblj](https://github.com/hzblj)! - `ActivityIndicator` plays Material 3's expressive `LoadingIndicator` on Android (its shapes morph as it turns), in a host of its own, so it still renders anywhere; iOS keeps UIKit's spinner. It takes the design system's props now, not React Native's: `color` is a token (`fill.accent.primary` by default), `size` is `small` or `large`.

  `Collapsible` on Android spans its parent, the chevron at the far end, and its row is never shorter than Material's 48dp touch target; the chevron sat right after the label. `Pager`'s dots on Android are centred under the pages.

- [#17](https://github.com/hzblj/kara-ui/pull/17) [`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29) Thanks [@hzblj](https://github.com/hzblj)! - Android gets glass and a scroll edge of its own.

  - `GlassView` is frosted glass on Android: what lies behind the capsule, blurred (Android 12+), under a translucent tonal surface (or its `tint`) and a light hairline, the blurred surfaces Android 16 gives its own system UI. It was an almost clear capsule that left its content unreadable over a photo. Below Android 12 the same colours are drawn near-opaque. kara-native's new `BackdropBlurView` (`/jetpack-compose`) does the blur (blurred, then saturated, as iOS lifts the colour under its materials): a plain view, no host, and an idle screen draws no frames.
  - `ScrollEdgeContainer` on Android behaves like a Material top app bar on scroll: the bars stay transparent at rest and fill with the scrolled container colour once content scrolls under the top one, the bottom one while there is more below. Its scroll view also takes the room between the bars now; before, it grew to its content's height, ran under the bottom bar and could not scroll.
  - New token `surface.secondary`, a step above `surface.primary`: Material's `surfaceContainer` on Android, `tertiarySystemGroupedBackgroundColor` on iOS.

- [#17](https://github.com/hzblj/kara-ui/pull/17) [`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29) Thanks [@hzblj](https://github.com/hzblj)! - `Pressable` on Android presses the Material way: a ripple over the content (the pressed state layer), clipped to the pressable's shape, and nothing scales. iOS keeps its spring to 96%. Give the `Pressable` the `borderRadius` of what it wraps (`full` around a `GlassView`) and the ripple follows it.

  `Collapsible` on Android expands down from its row with a fade, and its chevron turns toward the content; it grew from a corner and the chevron jumped.

- [#17](https://github.com/hzblj/kara-ui/pull/17) [`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29) Thanks [@hzblj](https://github.com/hzblj)! - New `BlurView`: the system materials, by SwiftUI's names (`ultraThin`, `thin`, `regular`, `thick`, `ultraThick`).

  - iOS: UIKit's `system*Material` blur as a plain view (no SwiftUI host, cheap enough for a list cell), with `vibrancy` (`primary` to `quaternary`, `fill`, `separator`) to draw the content the way iOS draws its own on a material.
  - Android: what lies behind, blurred and saturated (Android 12+), under a Material tonal surface that rises from `surface` to `surfaceContainerHighest` as the material thickens; below Android 12 the surface alone.
  - `appearance` pins a material to light or dark whatever the app's; `borderRadius` shapes it and clips the content.

  kara-native adds `BlurView` (`/swift-ui`).

- [#17](https://github.com/hzblj/kara-ui/pull/17) [`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29) Thanks [@hzblj](https://github.com/hzblj)! - `sx` reaches the components that still took raw styles or none:

  - `Text` takes the native `sx` surface: padding, a background, a frame (`wide` puts the text on the side `align` names) and the `ios` bucket. `ios.contentTransition` with the new `ios.animation` rolls a number to its next value, and `ios.monospacedDigit` keeps it from shifting what follows. `Stepper` on iOS is built on it.
  - `RnText` takes `Box`'s `sx` props for its own box (margins, `flex`, padding), all but `align`, which still aligns its lines.
  - `Image` is `sx(expo-image)`, the way `Box` is `sx(View)`: `w`, `h`, `aspectRatio`, `borderRadius`, `position`… instead of a `style` object. Its props are exported as `ImageProps`.
  - `Island` takes the same `sx` props for where it sits in React Native layout: `<Island h={240} matchContents={false}>`. An explicit `style` still wins.
  - `Skeleton` is sized with the `sx` names, `h` and `w` (was `height` and `width`), and `w` takes a percentage: `<Skeleton h={12} w="60%" />` for a line that ends early.
  - The React Native surface gains `inset`, all four edges at once: `position="absolute" inset={0}` fills the parent.

### Patch Changes

- [#15](https://github.com/hzblj/kara-ui/pull/15) [`bf2e70c`](https://github.com/hzblj/kara-ui/commit/bf2e70c8ae5a07fffb6433bd2ce08e371695ec50) Thanks [@hzblj](https://github.com/hzblj)! - `ScrollEdgeContainer` on iOS keeps its scroll view and top bar when a screen showing it is opened again. Its bars switched SwiftUI's structure once they had measured themselves, so SwiftUI rebuilt the hosted React Native views; on a remount it made several containers for each and dropped the last, which took the view with it.

- Updated dependencies [[`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29), [`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29), [`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29), [`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29), [`bf2e70c`](https://github.com/hzblj/kara-ui/commit/bf2e70c8ae5a07fffb6433bd2ce08e371695ec50), [`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29)]:
  - @hzblj/kara-components@0.8.0
  - @hzblj/kara-native@0.8.0
  - @hzblj/kara-theme@0.8.0
  - @hzblj/kara-sx@0.8.0
  - @hzblj/kara-router@0.8.0
  - @hzblj/kara-expo-plugin@0.8.0

## 0.7.0

### Minor Changes

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `SwipeActions` works on Android, and takes its buttons as data. **Breaking:** `SwipeActions.Actions` and its `Button` children are gone. Pass `leading` and/or `trailing`, each a list of `{icon, label, onPress, destructive?, tint?}`, and `allowsFullSwipe` on the row:

  ```tsx
  <SwipeActions
    trailing={[
      { destructive: true, icon: "trash", label: "Delete", onPress: remove },
    ]}
  >
    <ListItem title="Order [#1024](https://github.com/hzblj/kara-ui/issues/1024)" />
  </SwipeActions>
  ```

  iOS renders SwiftUI's `swipeActions`, each action its icon on a button in its tint (round, with the label under it, on iOS 26). Android, where Compose has no swipe actions, gets kara's own `SwipeActionsBox` (`@hzblj/kara-native/jetpack-compose`): the row slides on an anchored drag, and filled icon buttons with their labels show in the strip it leaves. One row is open at a time on both, and a tap on an open row closes it.

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - **Breaking:** `FlashList` is gone, and `@shopify/flash-list` is no longer a peer dependency. kara's list for React Native content is `RnFlatList` (and `RnSectionList`): React Native's own virtualized lists, whose cells stay in normal flow, so rows that host native views keep them in place; a recycling list moves its cells, which an `@expo/ui` host does not survive. An app that wants FlashList for plain data rows installs and imports it itself.

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `Tooltip` is controlled on Android too: `visible` shows Material's plain tooltip, centred above the anchor and kept inside the window, and `onDismiss` reports a touch outside it or the anchor scrolling away. It used to open only on a long press and hide itself, ignoring both props, and Material's own placement let it run off the edge of the screen. Nothing opens it on a long press any more; wire one to `visible` if you want it.

  `TooltipBox` (`@hzblj/kara-native/jetpack-compose`) takes `plain` for that style, and hides when `isPresented` turns false.

### Patch Changes

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `ActionSheet` on Android renders its rows in a host of its own. They were Compose views straight inside the sheet, which has none, and threw "must be rendered inside a Host". The rows are Material's bottom-sheet menu now: full width, with each action's `icon` before its label.

  `SearchBar` on iOS centres its text beside the magnifier. The type scale's line height sat the text at the bottom of a taller line in a single-line `UITextField`.

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - Android layout fixes:

  - `Screen` keeps its content clear of the status bar when nothing sits above it, as a SwiftUI host keeps to the safe area; it used to draw under it. Under a navigation bar nothing changes; the background still runs to the edges.
  - `Form` is inset from its container on every side, with section titles and footers indented to the cards' content, like SwiftUI's grouped form; in a `Screen` its cards used to run into the screen's edges.
  - A disabled or read-only `Checkbox` or `Switch` keeps Material's 48dp touch target, so it lines up with the enabled ones instead of shifting toward the edge.

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `DatePicker` on iOS sizes itself to its value. Its host took the width it was given and laid the compact field out against the far edge of it, past its container's, in a row. The calendar is in the accent now.

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `Alert` and `ActionSheet` appear on iOS. Both hung their SwiftUI presentation on an `EmptyView` (`@expo/ui` uses one when there is no trigger, and SwiftUI never presents from it), so `visible` changed nothing. Each now has a trigger that takes no room, and `ActionSheet` passes its buttons through the dialog's `Actions` slot.

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `RnFlatList` and `RnSectionList` keep rows that host native views on Android. React Native's Android default, `removeClippedSubviews`, detached a host measured at zero height before its first layout, and the row stayed empty; it is off unless you turn it on.

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `SegmentedControl` draws its selected segment in the accent on both platforms. iOS renders kara's own `UISegmentedControl` (`SegmentedControl` in `@hzblj/kara-native/swift-ui`), whose pill, labels and track take colours; the system control tints only the pill, SwiftUI's segmented picker not even that. Android colours Material's segmented buttons, equal widths. `onChange` now fires for a new segment only on Android too.

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `NavigationBar` and `Sheet.Header` on iOS 26 centre their title and glass items. UIKit's bar is 54 pt with its 44 pt row of items at the top, so centring the bar left the row 5 pt high; it is the row that is centred now.

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `sx` costs less on every render. The style cache, the responsive flattening and the key behind `useSxModifiers` used to go through every key the surface has, about seventy for a `Box`, even when a component set two or three of them. Now they go through only the props that are set, and the theme's part of the cache key is worked out once per theme rather than on every render. Without a JIT, as on Hermes, an `sx()` view resolves its style 2.5–5× faster and a native atom 2–4.5× faster.

- Updated dependencies [[`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490), [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490), [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490), [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490), [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490), [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490), [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490), [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490), [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490), [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490), [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490)]:
  - @hzblj/kara-components@0.7.0
  - @hzblj/kara-native@0.7.0
  - @hzblj/kara-sx@0.7.0
  - @hzblj/kara-router@0.7.0
  - @hzblj/kara-theme@0.7.0
  - @hzblj/kara-expo-plugin@0.7.0

## 0.6.0

### Minor Changes

- [#10](https://github.com/hzblj/kara-ui/pull/10) [`62b7131`](https://github.com/hzblj/kara-ui/commit/62b713143bd03872ecdd89ca8de42d98fe589617) Thanks [@hzblj](https://github.com/hzblj)! - Haptics: kara's own, native on both platforms, named for what happened.

  - One function per haptic (`haptics.success()`, `haptics.selection()`, …) and `haptics.play(name)` for a name that arrives as data. `selection`, `tick`, `toggleOn`/`toggleOff`, `success`/`warning`/`error`, `longPress`, `dragStart`, `thresholdActivate`/`thresholdDeactivate`, `keyPress`, and the impacts `soft`, `light`, `medium`, `rigid`, `heavy` (`intensity` scales them on iOS). Synchronous, nothing to await.
  - iOS: UIKit's feedback generators, kept alive and warmed up with `haptics.prepare` (`Pressable` prepares its haptic on press-in). Android: the system's own haptic feedback (`View.performHapticFeedback`), with Android 14's constants falling back to older ones, never a raw vibration. Both follow the user's system setting.
  - `useHapticFeedback(trigger, haptic)` plays on every change of a value, never on mount; a function of the previous and next value picks a haptic per change.
  - `haptics.setEnabled(false)` silences every kara haptic, the components' own included.
  - `Pressable`'s `haptic` takes a name as well as `true` (a `light` impact); `Chip` plays `selection`.
  - On Android, where Compose's Material controls play nothing: `Switch` plays `toggleOn`/`toggleOff`, a stepped `Slider` ticks at every stop, `SegmentedControl` plays `selection`. iOS keeps its native controls' own feedback.
  - `Slider`: `step` is the increment on Android too. It was passed to Compose as the number of stops.
  - `expo-haptics` is no longer a peer dependency.

### Patch Changes

- Updated dependencies [[`62b7131`](https://github.com/hzblj/kara-ui/commit/62b713143bd03872ecdd89ca8de42d98fe589617)]:
  - @hzblj/kara-native@0.6.0
  - @hzblj/kara-components@0.6.0
  - @hzblj/kara-router@0.6.0
  - @hzblj/kara-theme@0.6.0
  - @hzblj/kara-sx@0.6.0
  - @hzblj/kara-expo-plugin@0.6.0

## 0.5.0

### Minor Changes

- [#8](https://github.com/hzblj/kara-ui/pull/8) [`3b0a6fb`](https://github.com/hzblj/kara-ui/commit/3b0a6fbc49559720023fece2b5c6189ad4d88bc8) Thanks [@hzblj](https://github.com/hzblj)! - `ZoomTransition`: a push that grows out of the photo it was opened from and shrinks back into it.

  - iOS 18: UIKit's zoom transition, with the interactive dismissal (swipe down, edge swipe, pinch) gated on the scroll views under the finger. Below iOS 18 the push stays a slide. Android: Material's container transform, both ways.
  - Three pieces from `@hzblj/kara-ui/router`, tied by one identifier: `ZoomTransition.Source` on the list, `ZoomTransition.Enabler` and `ZoomTransition.Target` on the pushed screen; `useZoomTransitionSourceId`, `ZOOM_TRANSITION_PARAM`, `useZoomTransitionParam` and `withZoomTransition` (an Android fade under the transform) around them.
  - Settings both platforms honour sit at the top (`scrim`); the rest is typed apart under `ios` (`dismissGesture`, `blur`, the target's `fit`) and `android` (`duration`, `easing`, `fade`, `path`, corner radii, the target's `fit` and `flex`).
  - `ContextMenu`: with a `ZoomTransition.Source` in the trigger, a tap on the iOS preview zooms the preview's photo straight into the pushed screen. `previewTransition` (`zoom`, `pop`, `dismiss`) picks how the preview leaves.
  - `DurationSize`, the keys of `duration`.

### Patch Changes

- Updated dependencies [[`3b0a6fb`](https://github.com/hzblj/kara-ui/commit/3b0a6fbc49559720023fece2b5c6189ad4d88bc8)]:
  - @hzblj/kara-router@0.5.0
  - @hzblj/kara-native@0.5.0
  - @hzblj/kara-components@0.5.0
  - @hzblj/kara-theme@0.5.0
  - @hzblj/kara-sx@0.5.0
  - @hzblj/kara-expo-plugin@0.5.0

## 0.4.1

### Patch Changes

- [#6](https://github.com/hzblj/kara-ui/pull/6) [`d14bdd3`](https://github.com/hzblj/kara-ui/commit/d14bdd37bede9fef80f4d3af4621ea5d60b2b16b) Thanks [@hzblj](https://github.com/hzblj)! - `GlassView` always shows its glass. Glass mounted under a React Native view at opacity 0 (the first row of a Legend List opened from cache, content fading in from 0) used to stay without it, because React Native changes opacity past UIKit, which then kept the subtree marked as hidden. React Native opacity changes that cross UIKit's hidden threshold now go through `UIView.alpha`, so this holds for every Liquid Glass view in the app. The glass is also set at once instead of polling until every ancestor is fully opaque, and its content no longer waits for it.

- Updated dependencies [[`d14bdd3`](https://github.com/hzblj/kara-ui/commit/d14bdd37bede9fef80f4d3af4621ea5d60b2b16b)]:
  - @hzblj/kara-native@0.4.1
  - @hzblj/kara-theme@0.4.1
  - @hzblj/kara-sx@0.4.1
  - @hzblj/kara-components@0.4.1
  - @hzblj/kara-router@0.4.1
  - @hzblj/kara-expo-plugin@0.4.1

## 0.4.0

### Minor Changes

- [`6e7903a`](https://github.com/hzblj/kara-ui/commit/6e7903afa3d3442e04a48a6e24399f9f03559a03) Thanks [@hzblj](https://github.com/hzblj)! - Android polish, and a new `RnListItem`.

  - `ContextMenu` on Android is a proper long-press menu: a ripple and the long-press haptic, then a Material dropdown where the finger is, with the actions' icons and the trigger highlighted while it is open. The ripple and highlight stay inside rounded corners.
  - A pressable `HStack`, `VStack` or `ZStack` ripples across its whole shape, padding included; `ListItem` and `LabeledContent` take `px` so a row in a card can carry the card's padding inside its press area.
  - `ListItem` keeps its chevron when the subtitle fills the line.
  - `Tabs` take the theme's colours: on Android the bar, active indicator, icons, labels and ripple come from tokens instead of the wallpaper scheme; on iOS the selected item takes the accent.
  - New `RnListItem`: `ListItem`'s row in the React Native tier, cheap to mount by the dozen, with a full-row ripple on Android and a highlight on iOS.

### Patch Changes

- [`6e7903a`](https://github.com/hzblj/kara-ui/commit/6e7903afa3d3442e04a48a6e24399f9f03559a03) Thanks [@hzblj](https://github.com/hzblj)! - `npx kara-icons ./assets/icons` works without `--out`; it used to skip the folder and print its usage.

- Updated dependencies [[`6e7903a`](https://github.com/hzblj/kara-ui/commit/6e7903afa3d3442e04a48a6e24399f9f03559a03), [`6e7903a`](https://github.com/hzblj/kara-ui/commit/6e7903afa3d3442e04a48a6e24399f9f03559a03)]:
  - @hzblj/kara-components@0.4.0
  - @hzblj/kara-router@0.4.0
  - @hzblj/kara-expo-plugin@0.4.0
  - @hzblj/kara-theme@0.4.0
  - @hzblj/kara-sx@0.4.0
  - @hzblj/kara-native@0.4.0

## 0.3.0

### Minor Changes

- [`f84ffd5`](https://github.com/hzblj/kara-ui/commit/f84ffd52954a5e7052541c8682787137de205a28) Thanks [@hzblj](https://github.com/hzblj)! - Native sheets with a native header. `Sheet` is now a TrueSheet (`@lodev09/react-native-true-sheet`, a new peer dependency) with `<Sheet.Header>`, `<Sheet.ScrollView>`, `useSheetScroll`, detents, a footer and a ref (`present`/`dismiss`/`resize`). `<Sheet.Header>` is a real navigation bar with a centred, leading or large title that hands over to the bar as it scrolls away, items on either side, and on iOS 26 the content scrolls under it with the soft edge effect. It is React Native tier now: no host, native atoms inside go in an `Island`. `fitToContents` is replaced by `detents` (`['auto']` by default).

  `NavigationBar` takes `leadingItems` / `trailingItems` instead of `onBack` / `onClose`: `back`, `close` or an app `icon`, on either side and in any order; on iOS 26 neighbours share a glass capsule unless an item is `separated`. Also `titleAlignment`, `titleVisible`, `inverted` and an iOS `search` field. On Android it is now Material's native top app bar.

### Patch Changes

- Updated dependencies [[`f84ffd5`](https://github.com/hzblj/kara-ui/commit/f84ffd52954a5e7052541c8682787137de205a28)]:
  - @hzblj/kara-components@0.3.0
  - @hzblj/kara-native@0.3.0
  - @hzblj/kara-router@0.3.0
  - @hzblj/kara-theme@0.3.0
  - @hzblj/kara-sx@0.3.0
  - @hzblj/kara-expo-plugin@0.3.0

## 0.2.1

### Patch Changes

- [`be5be81`](https://github.com/hzblj/kara-ui/commit/be5be81a3764dfbd199c3c3cf90deadc6e53d268) Thanks [@hzblj](https://github.com/hzblj)! - Installable again: 0.2.0 was published with `workspace:^` ranges between the kara packages, which no package manager outside this repository resolves. The packages now go out through Yarn, which writes the real version ranges.

- Updated dependencies [[`be5be81`](https://github.com/hzblj/kara-ui/commit/be5be81a3764dfbd199c3c3cf90deadc6e53d268)]:
  - @hzblj/kara-components@0.2.1
  - @hzblj/kara-native@0.2.1
  - @hzblj/kara-router@0.2.1
  - @hzblj/kara-expo-plugin@0.2.1
  - @hzblj/kara-sx@0.2.1
  - @hzblj/kara-theme@0.2.1

## 0.2.0

### Minor Changes

- [`c30bef6`](https://github.com/hzblj/kara-ui/commit/c30bef6be2639deb6d385ad209d1a2799b5b656f) Thanks [@hzblj](https://github.com/hzblj)! - Icons are now fully native and the app's own: `plugins: [['@hzblj/kara-ui', {icons: {source: './assets/icons'}}]]` turns every SVG in the folder into an iOS asset-catalog template image and an Android vector drawable at prebuild (`x.ios.svg` / `x.android.svg` for per-platform glyphs), and writes `kara-icons.d.ts` so `name` only accepts icons that exist; `npx kara-icons` does the same for CI. `Icon` draws them in a host, the new `RnIcon` anywhere, and `Tabs` passes them as `xcasset` / `drawable`. The built-in SF Symbol / Material icon names and the `@expo/vector-icons` peer dependency are gone.

- [`c30bef6`](https://github.com/hzblj/kara-ui/commit/c30bef6be2639deb6d385ad209d1a2799b5b656f) Thanks [@hzblj](https://github.com/hzblj)! - Leaner, reusable-only components. `Countdown` is gone, with its native views. There is one `ContextMenu` now: the native module's long-press menu on React Native content, with a custom preview on iOS (formerly `RnContextMenu`); the `@expo/ui`-based one is removed.

  Android, reworked to look and behave like Material while honouring the theme:

  - `Button`, `Badge` and `Alert` render their labels; `Button` keeps Material's own shape (no iOS ring), takes `tint` as its fill with a label that contrasts with it, and draws `glass` as Material's outlined button.
  - `Alert` is built from `AlertDialog`'s slots instead of drawing empty: title, message, the confirm action (destructive when asked) and Cancel.
  - `Menu` presents its actions in Material's dropdown popup, with their icons, instead of laying them out over the trigger.
  - `Picker` is a themed Material exposed dropdown the width of its container.
  - `Switch`, `Checkbox` and `RadioGroup` are tinted with the accent, and with a label are full-width rows that toggle as a whole; `Form` sections span the form's width.
  - `Surface` pads its content instead of its background, and stacks its children in a column.
  - `Fab` shows its icon, `DatePicker` opens its dialog on a tap (in the accent colour) instead of on mount, `GlassView`'s fallback is the translucent glass fill, and the `List` docs spell out that it needs a bounded height.

### Patch Changes

- Updated dependencies [[`c30bef6`](https://github.com/hzblj/kara-ui/commit/c30bef6be2639deb6d385ad209d1a2799b5b656f), [`c30bef6`](https://github.com/hzblj/kara-ui/commit/c30bef6be2639deb6d385ad209d1a2799b5b656f)]:
  - @hzblj/kara-components@0.2.0
  - @hzblj/kara-native@0.2.0
  - @hzblj/kara-router@0.2.0
  - @hzblj/kara-expo-plugin@0.2.0
  - @hzblj/kara-theme@0.2.0
  - @hzblj/kara-sx@0.2.0

## 0.1.0

### Minor Changes

- [`f919c7b`](https://github.com/hzblj/kara-ui/commit/f919c7b06f3798cebd58eef1581076bf1ee61cd1) Thanks [@hzblj](https://github.com/hzblj)! - First release of the kara-ui design system: theme and tokens, the `sx` engine, atoms, molecules, organisms and `Screen`, native tabs (`@hzblj/kara-ui/router`), the KaraUI native module (Liquid Glass, scroll edge effect, native countdown, context menu with preview, rich tooltip, FAB menu), and `KaraProvider` with theme overrides (colours, the app's own fonts, the Material seed, and Material You dynamic colour on Android). Text uses the platform's face by default. Install `@hzblj/kara-ui`; the scoped packages are its building blocks.

### Patch Changes

- Updated dependencies [[`f919c7b`](https://github.com/hzblj/kara-ui/commit/f919c7b06f3798cebd58eef1581076bf1ee61cd1)]:
  - @hzblj/kara-theme@0.1.0
  - @hzblj/kara-sx@0.1.0
  - @hzblj/kara-native@0.1.0
  - @hzblj/kara-components@0.1.0
  - @hzblj/kara-router@0.1.0
  - @hzblj/kara-expo-plugin@0.1.0
