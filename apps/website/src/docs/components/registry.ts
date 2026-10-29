/**
 * Every component page, in the order the docs list them. What a page says *about* a component lives here; what it
 * takes is read from the library's types (`source/api.ts`) and what it looks like from the captures (`source/media.ts`),
 * so neither can go stale in this file.
 */

export type ComponentGroupId = 'actions' | 'content' | 'feedback' | 'layout' | 'navigation' | 'primitives' | 'selection'

/**
 * Where a component may render. `native` — inside a `Screen` or an `Island`, like every SwiftUI and Compose view.
 * `rn` — a React Native view, anywhere. `self` — it brings its own host, so it renders anywhere too.
 */
export type ComponentHost = 'native' | 'rn' | 'self'

export type ComponentDoc = {
  /** The usage snippet the preview's Code tab and the page open with. */
  code: string
  /** Where it is imported from, when that is not the main entry. */
  entry?: '@hzblj/kara-ui/router'
  /** Further snippets, each under a heading. */
  examples?: {code: string; title: string}[]
  /** What the import line brings in. */
  exports: string[]
  group: ComponentGroupId
  host: ComponentHost
  id: string
  name: string
  /** Where the platforms differ, and anything else a reader should know before reaching for it. */
  notes?: string[]
  /** The view each platform draws. */
  renders: {android: string; ios: string}
  summary: string
  /** The props tables, by type name, in order. */
  types: string[]
}

export const COMPONENT_GROUPS: {id: ComponentGroupId; title: string}[] = [
  {id: 'actions', title: 'Actions'},
  {id: 'selection', title: 'Selection and input'},
  {id: 'content', title: 'Content'},
  {id: 'layout', title: 'Layout and lists'},
  {id: 'feedback', title: 'Feedback'},
  {id: 'navigation', title: 'Navigation and sheets'},
  {id: 'primitives', title: 'React Native tier'},
]

const ACTIONS = `const actions: MenuAction[] = [
  {icon: 'share', label: 'Share', onPress: share},
  {icon: 'heart', label: 'Add to favourites', onPress: favourite},
  {destructive: true, icon: 'trash', label: 'Delete', onPress: remove},
]`

export const COMPONENTS: ComponentDoc[] = [
  // Actions
  {
    code: `<VStack spacing="s12" wide>
  <Button label="Continue" onPress={next} wide />
  <Button label="Add to wishlist" variant="secondary" wide />
  <Button label="Delete account" variant="destructive" wide />
</VStack>`,
    examples: [
      {code: '<Button label="Not now" variant="glass" />', title: 'Glass'},
      {
        code: '<Button buttonStyle="glassProminent" label="Prominent" tint="fill.accent.primary" />',
        title: 'Tinted, with a SwiftUI button style',
      },
    ],
    exports: ['Button'],
    group: 'actions',
    host: 'native',
    id: 'button',
    name: 'Button',
    notes: [
      '`buttonStyle` and `controlSize` are SwiftUI’s own and iOS only; Android keeps drawing the variant’s tokens.',
      '`glass` is Liquid Glass on iOS 26 and a translucent tonal button on Android.',
      'Any colour token can `tint` a button, and the label picks a colour that reads on it.',
      '`variant="plain"` is a text button (SwiftUI `borderless`, Material `TextButton`), and `icon` puts one of your icons before the label.',
    ],
    renders: {android: 'Compose Button / OutlinedButton / TextButton', ios: 'SwiftUI Button'},
    summary: 'The platform’s own button, in five variants: accent, secondary, destructive, glass and plain.',
    types: ['ButtonProps'],
  },
  {
    code: `<HStack spacing="s8">
  <IconButton accessibilityLabel="Share" name="share" onPress={share} />
  <IconButton accessibilityLabel="Add to favourites" name="heart" onPress={favourite} />
  <IconButton accessibilityLabel="Locked" disabled name="lock" />
</HStack>`,
    exports: ['IconButton'],
    group: 'actions',
    host: 'native',
    id: 'icon-button',
    name: 'IconButton',
    notes: [
      '`name` is one of your own icons (see Icons).',
      '`accessibilityLabel` is required: an icon has nothing of its own for VoiceOver or TalkBack to say.',
      '`variant` draws a circle around the icon (filled, tonal, outlined, glass): SwiftUI button styles on iOS, Material’s icon buttons on Android, where `glass` is the tonal one. `color` tints the icon, or fills a filled button.',
    ],
    renders: {android: 'Compose IconButton', ios: 'SwiftUI Button'},
    summary: 'A button that is just an icon, for toolbars and compact rows.',
    types: ['IconButtonProps'],
  },
  {
    code: '<Fab accessibilityLabel="New post" name="add" onPress={create} />',
    exports: ['Fab'],
    group: 'actions',
    host: 'native',
    id: 'fab',
    name: 'Fab',
    notes: [
      'A real screen pins it to the bottom trailing corner; the component itself sits wherever it is laid out.',
      '`accessibilityLabel` is required: an icon has nothing of its own for VoiceOver or TalkBack to say.',
      'A `label` makes it the extended FAB (an accent capsule on iOS), and `size` picks `small`, `regular` or `large`.',
    ],
    renders: {
      android: 'Compose FloatingActionButton (small, large, extended)',
      ios: 'SwiftUI Button, round and prominent',
    },
    summary: 'The screen’s primary action, floating above the content.',
    types: ['FabProps'],
  },
  {
    code: `${ACTIONS}

<FabMenu accessibilityLabel="Create" actions={actions} />`,
    exports: ['FabMenu', 'type MenuAction'],
    group: 'actions',
    host: 'native',
    id: 'fab-menu',
    name: 'FabMenu',
    notes: [
      'Android: Material 3 Expressive’s FAB menu, where the button turns into a close and the actions rise above it as pills.',
      'iOS: the same round button as the label of a SwiftUI `Menu`.',
      'A `disabled` action is greyed on iOS only: Material’s FAB menu items have no disabled state.',
    ],
    renders: {android: 'Material 3 FloatingActionButtonMenu', ios: 'SwiftUI Menu'},
    summary: 'A floating button that opens a few related actions.',
    types: ['FabMenuProps', 'MenuAction'],
  },
  {
    code: `<Link label="expo.dev" url="https://expo.dev" />
<Link icon="info" label="Read the docs" url="https://github.com/hzblj/kara-ui" />`,
    exports: ['Link'],
    group: 'actions',
    host: 'native',
    id: 'link',
    name: 'Link',
    notes: [
      'Opens the URL in the platform browser, or in whichever app claims the scheme. For in-app navigation use the router.',
    ],
    renders: {android: 'Compose Row of Icon and Text', ios: 'SwiftUI HStack of Image and Text'},
    summary: 'Text that opens a URL.',
    types: ['LinkProps'],
  },
  {
    code: `${ACTIONS}

<Menu actions={actions} label="More options" />`,
    exports: ['Menu', 'type MenuAction'],
    group: 'actions',
    host: 'native',
    id: 'menu',
    name: 'Menu',
    notes: [
      'Both platforms draw each action’s `icon`. With `icon` and no `label` the trigger is an icon button and needs an `accessibilityLabel`; a `disabled` action is greyed.',
    ],
    renders: {android: 'Compose DropdownMenu', ios: 'SwiftUI Menu'},
    summary: 'A list of actions that drops down from a label.',
    types: ['MenuProps', 'MenuAction'],
  },
  {
    code: `const [open, setOpen] = useState(false)

<Button label="Show actions" onPress={() => setOpen(true)} variant="secondary" />
<ActionSheet actions={actions} onDismiss={() => setOpen(false)} title="Air Max 90" visible={open} />`,
    exports: ['ActionSheet'],
    group: 'actions',
    host: 'native',
    id: 'action-sheet',
    name: 'ActionSheet',
    notes: [
      'Controlled: `visible` opens it, and `onDismiss` is where you set it back to `false`.',
      'iOS is a SwiftUI confirmation dialog (on iOS 26, a popover over its host), its title always shown, and draws no icons. Android is Material’s bottom-sheet menu, each action’s icon before its label.',
      '`message` sits under the title on both platforms.',
    ],
    renders: {android: 'Sheet with a list of actions', ios: 'SwiftUI confirmationDialog'},
    summary: 'Actions that slide up from the bottom of the screen.',
    types: ['ActionSheetProps'],
  },
  {
    code: `<ContextMenu actions={actions} preview={<ProductPreview />} p="s16">
  <ProductCard />
</ContextMenu>`,
    examples: [
      {
        code: `<ContextMenu actions={actions}>
  <ProductCard />
  <ContextMenu.Exclusion>
    <Button label="Add to bag" onPress={add} />
  </ContextMenu.Exclusion>
</ContextMenu>`,
        title: 'A button inside the trigger',
      },
    ],
    exports: ['ContextMenu'],
    group: 'actions',
    host: 'rn',
    id: 'context-menu',
    name: 'ContextMenu',
    notes: [
      'The trigger is ordinary React Native layout, so it needs no `Screen` or `Island`, and takes the view `sx` props.',
      'iOS lifts `preview` (or a snapshot of the trigger) above the menu. Material has no lifted preview: Android ripples, plays the long-press haptic and opens a dropdown where the finger is.',
      'With a `ZoomTransition.Source` in the trigger, a tap on the iOS preview zooms its photo straight into the pushed screen.',
      'A `disabled` action is greyed on both platforms.',
    ],
    renders: {android: 'Compose DropdownMenu on a long press', ios: 'UIContextMenuInteraction'},
    summary: 'A long-press menu on any React Native content, with a custom preview on iOS.',
    types: ['ContextMenuProps'],
  },
  {
    code: `<List>
  {orders.map(order => (
    <SwipeActions
      key={order.id}
      leading={[{icon: 'star', label: 'Pin', onPress: () => pin(order)}]}
      trailing={[
        {destructive: true, icon: 'trash', label: 'Delete', onPress: () => remove(order)},
        {icon: 'share', label: 'Share', onPress: () => share(order)},
      ]}
    >
      <ListItem subtitle={order.status} title={order.title} />
    </SwipeActions>
  ))}
</List>`,
    exports: ['SwipeActions'],
    group: 'actions',
    host: 'native',
    id: 'swipe-actions',
    name: 'SwipeActions',
    notes: [
      'A row of a `List`: SwiftUI only offers swipe actions there.',
      'iOS 26 draws each action as a round button in its tint with the label under it, the way Mail does. Compose has no swipe actions, so Android has kara’s own: the row slides on an anchored drag, and filled icon buttons with their labels under them show in the strip it leaves.',
      'One row is open at a time, and a tap on an open row closes it. A press closes the row before the action runs.',
      '`allowsFullSwipe` (on by default) runs the edge’s first action on a swipe all the way across. iOS only.',
    ],
    renders: {android: 'Anchored drag (kara)', ios: 'SwiftUI swipeActions'},
    summary: 'Buttons revealed by swiping a list row.',
    types: ['SwipeActionsProps', 'SwipeAction'],
  },
  {
    code: `<Pressable bg="fill.accent.primary" borderRadius="large" haptic onPress={open} p="s20">
  <RnText color="content.on.accent" variant="headline">Press me</RnText>
</Pressable>`,
    exports: ['Pressable'],
    group: 'actions',
    host: 'rn',
    id: 'pressable',
    name: 'Pressable',
    notes: [
      'The press is each platform’s own by default: iOS eases it down to 96 % while held (with motion reduced, it dims); Android draws Material’s ripple over the content, clipped to the pressable’s shape, so give it the `borderRadius` of what it wraps (`full` around a `GlassView`).',
      '`pressEffect` picks the same answer on both: `scale` (to `pressedScale`), `opacity` (to `pressedOpacity`) or `none`. Android keeps its ripple on top unless `ripple` is off.',
      'It takes touches 8 points past its edges.',
      '`haptic` is `true` for a light impact, or any haptic by name. iOS prepares it on press-in.',
    ],
    renders: {android: 'React Native Pressable', ios: 'React Native Pressable'},
    summary: 'Makes any React Native content tappable, with press feedback built in.',
    types: ['PressableProps'],
  },

  // Selection and input
  {
    code: `const [wifi, setWifi] = useState(true)

<Switch label="Wi-Fi" onValueChange={setWifi} value={wifi} />`,
    exports: ['Switch'],
    group: 'selection',
    host: 'native',
    id: 'switch',
    name: 'Switch',
    notes: [
      'With a `label`, the whole row toggles.',
      'Android plays `toggleOn` / `toggleOff`, which Compose’s switch does not; iOS’s own switch keeps its own feedback.',
    ],
    renders: {android: 'Compose Switch', ios: 'SwiftUI Toggle'},
    summary: 'An on/off setting, tinted with your accent.',
    types: ['SwitchProps'],
  },
  {
    code: '<Checkbox label="I agree to the terms" onValueChange={setAgreed} value={agreed} />',
    exports: ['Checkbox'],
    group: 'selection',
    host: 'native',
    id: 'checkbox',
    name: 'Checkbox',
    notes: ['iOS has no checkbox of its own, so there it is a switch.'],
    renders: {android: 'Compose Checkbox', ios: 'SwiftUI Toggle'},
    summary: 'A yes/no choice, usually one of several in a form.',
    types: ['CheckboxProps'],
  },
  {
    code: `const options = [
  {label: 'Standard · 3–5 days', value: 'standard'},
  {label: 'Express · tomorrow', value: 'express'},
  {label: 'Pick up in store', value: 'store'},
]

<RadioGroup onValueChange={setDelivery} options={options} value={delivery} />`,
    exports: ['RadioGroup'],
    group: 'selection',
    host: 'native',
    id: 'radio-group',
    name: 'RadioGroup',
    notes: [
      'Exactly one option is selected at all times. For an independent on/off, use `Switch` or `Checkbox`.',
      '`disabled` dims the options and stops the selection changing.',
    ],
    renders: {android: 'Compose RadioButton rows', ios: 'SwiftUI rows with a checkmark'},
    summary: 'One choice out of a few, all visible at once.',
    types: ['RadioGroupProps', 'RadioOption'],
  },
  {
    code: '<Slider onValueChange={setVolume} value={volume} />',
    examples: [
      {code: '<Slider max={10} min={0} onValueChange={setRating} step={1} value={rating} />', title: 'Stepped'},
    ],
    exports: ['Slider'],
    group: 'selection',
    host: 'native',
    id: 'slider',
    name: 'Slider',
    notes: [
      'A stepped slider ticks at every stop on Android; iOS 26’s slider plays its own.',
      '`onValueChangeEnd` fires once when the finger lifts (SwiftUI `onEditingChanged`, Material `onValueChangeFinished`): commit a seek there.',
    ],
    renders: {android: 'Compose Slider', ios: 'SwiftUI Slider'},
    summary: 'A value along a range, picked by dragging.',
    types: ['SliderProps'],
  },
  {
    code: '<Stepper label="Quantity" max={5} min={1} onValueChange={setCount} value={count} />',
    exports: ['Stepper'],
    group: 'selection',
    host: 'native',
    id: 'stepper',
    name: 'Stepper',
    notes: [
      'Without `min` and `max`, iOS stops at 0 and 100 and Android has no limits, so set both.',
      'iOS steps in whole numbers.',
      '`disabled` dims the row; `decrementLabel` and `incrementLabel` set TalkBack’s button labels on Android.',
    ],
    renders: {android: 'Compose row with minus and plus buttons', ios: 'SwiftUI Stepper'},
    summary: 'A number nudged up and down.',
    types: ['StepperProps'],
  },
  {
    code: `<SegmentedControl
  onChange={index => setRange(index)}
  selectedIndex={range}
  values={['Day', 'Week', 'Month']}
/>`,
    exports: ['SegmentedControl'],
    group: 'selection',
    host: 'self',
    id: 'segmented-control',
    name: 'SegmentedControl',
    notes: [
      'A segment can lead with one of your `icon`s, in its label’s colour, or be an `image` in its own colours (a carrier’s logo, by URL, raster or SVG, loaded natively). `iconSize` sets their height and `spacing` the space above and below, for a bigger control.',
      'The selected segment is in the accent on both platforms: on iOS through kara’s own `UISegmentedControl`, since neither the system control nor SwiftUI’s segmented picker lets the labels be coloured.',
      'It needs no `Screen` or `Island`: iOS is a plain view, Android brings its own host. It takes the width it is given; the height is the platform’s.',
      '`onChange` fires for a new segment only. Android plays `selection`; iOS plays the control’s own feedback.',
    ],
    renders: {android: 'Material segmented buttons', ios: 'UISegmentedControl (kara)'},
    summary: 'Switches between a few views of the same thing.',
    types: ['SegmentedControlProps'],
  },
  {
    code: `const sizes = [
  {label: 'EU 41', value: '41'},
  {label: 'EU 42', value: '42'},
  {label: 'EU 43', value: '43'},
]

<Picker onValueChange={setSize} options={sizes} value={size} />`,
    examples: [
      {code: '<Picker onValueChange={setSize} options={sizes} pickerStyle="menu" value={size} />', title: 'Menu'},
    ],
    exports: ['Picker'],
    group: 'selection',
    host: 'self',
    id: 'picker',
    name: 'Picker',
    notes: [
      'A wheel on iOS, or with `pickerStyle="menu"` a button that opens the options as a menu; an exposed dropdown menu on Android, which ignores `pickerStyle`.',
    ],
    renders: {android: 'Compose ExposedDropdownMenu', ios: 'Wheel or menu picker'},
    summary: 'One choice out of a longer list.',
    types: ['PickerProps', 'PickerOption'],
  },
  {
    code: '<DatePicker onValueChange={setDate} value={date} />',
    examples: [{code: '<DatePicker mode="time" onValueChange={setTime} value={time} />', title: 'Time'}],
    exports: ['DatePicker'],
    group: 'selection',
    host: 'self',
    id: 'date-picker',
    name: 'DatePicker',
    notes: [
      'iOS shows a compact field that opens the calendar; Android a field that opens Material’s date dialog.',
      'It sizes itself to its value; put it at the end of a row, beside its label.',
      'Android reports the date once the dialog is confirmed; iOS as it changes.',
      'A compact pill by default. `datePickerStyle="graphical"` is the calendar in place on both platforms (Material’s on Android); `wheel` is iOS only. `disabled` dims it.',
    ],
    renders: {android: 'Field and dialog, or inline Material calendar', ios: 'Compact, graphical or wheel picker'},
    summary: 'A date, picked from the platform’s own calendar.',
    types: ['DatePickerProps'],
  },
  {
    code: '<ColorPicker label="Accent" onValueChange={setColor} value={color} />',
    exports: ['ColorPicker'],
    group: 'selection',
    host: 'native',
    id: 'color-picker',
    name: 'ColorPicker',
    notes: [
      'Compose ships no colour picker, so Android gets kara’s own in the iOS picker’s shape: a well with a rainbow ring, and a sheet with a grid of swatches, a spectrum and RGB sliders.',
      'With `supportsOpacity`, both add an opacity slider and report `#RRGGBBAA`; without it, `#RRGGBB`.',
      '`disabled` dims the label and the well, which then does not open.',
    ],
    renders: {android: 'kara’s Compose well and sheet', ios: 'SwiftUI ColorPicker'},
    summary: 'A colour from a grid, a spectrum or sliders.',
    types: ['ColorPickerProps'],
  },
  {
    code: `<VStack spacing="s16" wide>
  <TextField label="Email" onChangeText={setEmail} />
  <TextField label="Password" secure />
  <TextField defaultValue="110" error="A postcode has five digits." label="Postcode" />
</VStack>`,
    exports: ['TextField'],
    group: 'selection',
    host: 'native',
    id: 'text-field',
    name: 'TextField',
    notes: [
      'Uncontrolled: start it with `defaultValue` and read changes from `onChangeText`.',
      'Give `error` a message and it shows under the field (Material’s supporting text with its error icon on Android), so an error never rests on colour alone.',
      '`keyboard`, `autoCapitalize`, `autoCorrect`, `contentType` (iOS AutoFill, an autofill hint on Android) and `maxLength` fit it to the text it takes; `submitLabel`, `onSubmit` and a `ref` (`focus`, `blur`, `clear`) chain fields so Next moves on.',
    ],
    renders: {android: 'Compose OutlinedTextField', ios: 'SwiftUI TextField / SecureField'},
    summary: 'Text input with a label, for secure entry and errors too.',
    types: ['TextFieldProps', 'TextFieldRef'],
  },
  {
    code: '<SearchBar onChangeText={setQuery} placeholder="Search stores" value={query} />',
    exports: ['SearchBar'],
    group: 'selection',
    host: 'rn',
    id: 'search-bar',
    name: 'SearchBar',
    notes: [
      'React Native tier: it hosts nothing native, so it renders outside `Screen` and `Island` too.',
      'Its return key reads Search and calls `onSubmit` with the query; capitals and corrections are off by default.',
    ],
    renders: {android: 'React Native, Material style', ios: 'React Native, UIKit style'},
    summary: 'A search field with the platform’s look.',
    types: ['SearchBarProps'],
  },
  {
    code: `<Box flexDirection="row" gap="s8" wrap="wrap">
  {topics.map(topic => (
    <Chip key={topic} label={topic} onPress={() => toggle(topic)} selected={picked.includes(topic)} />
  ))}
</Box>`,
    exports: ['Chip'],
    group: 'selection',
    host: 'rn',
    id: 'chip',
    name: 'Chip',
    notes: ['A filter pill in the React Native tier, not a native control. It plays `selection` when pressed.'],
    renders: {android: 'React Native', ios: 'React Native'},
    summary: 'Compact toggles for filters and tags.',
    types: ['ChipProps'],
  },

  // Content
  {
    code: `<Text variant="headline">Order summary</Text>
<Text color="content.secondary">Arrives Friday</Text>`,
    examples: [
      {
        code: `<Text ios={{animation: {value: count}, contentTransition: {type: 'numericText'}}} monospacedDigit>
  {String(count)}
</Text>`,
        title: 'A number that rolls to the next',
      },
      {
        code: `<Text monospaced variant="footnote">{trackingNumber}</Text>
<Text monospacedDigit>{formatPrice(total)}</Text>`,
        title: 'Code and figures',
      },
    ],
    exports: ['Text'],
    group: 'content',
    host: 'native',
    id: 'text',
    name: 'Text',
    notes: [
      'Native text, inside a host. Outside one, use `RnText`: same variants, same colours.',
      'Every variant grows with Dynamic Type on iOS and font scale on Android.',
      'With `numberOfLines`, iOS ends the last line with an ellipsis; Android clips it.',
      'It takes the native `sx` surface: padding, a background, a frame. `wide` puts the text on the side `align` names.',
      'On iOS, `contentTransition` with `animation` rolls a number to its next value; Android shows the new one at once.',
      '`monospaced` sets it in the theme’s fixed-width face (`fonts.mono`, else Menlo and `monospace`); `monospacedDigit` keeps the face and only gives its digits one width.',
      'Text cut short ends in an ellipsis on both platforms; `truncation` puts it at the head or in the middle (on a single line only, on Android).',
    ],
    renders: {android: 'Compose Text', ios: 'SwiftUI Text'},
    summary: 'Text in the type scale, coloured by token.',
    types: ['TextProps'],
  },
  {
    code: `<Label icon="star" title="Featured" color="content.accent" variant="labelMedium" />`,
    exports: ['Label'],
    group: 'content',
    host: 'native',
    id: 'label',
    name: 'Label',
    notes: [
      'An inline pair for a button, a menu row or a section header. For a tappable row with a subtitle, use `ListItem`.',
    ],
    renders: {android: 'Compose Row of Icon and Text', ios: 'SwiftUI HStack of Image and Text'},
    summary: 'An icon and a short text, aligned.',
    types: ['LabelProps'],
  },
  {
    code: `<LabeledContent label="Version" px="s16" value="2.4.0" />
<LabeledContent label="Back up photos" px="s16">
  <Switch onValueChange={setBackup} value={backup} />
</LabeledContent>`,
    exports: ['LabeledContent'],
    group: 'content',
    host: 'native',
    id: 'labeled-content',
    name: 'LabeledContent',
    notes: ['Pass `children` instead of `value` when the trailing side is a control rather than text.'],
    renders: {android: 'Compose Row', ios: 'SwiftUI HStack'},
    summary: 'A label with a value or a control beside it.',
    types: ['LabeledContentProps'],
  },
  {
    code: `<Badge label="New" />
<Badge label="Sale" tone="accent" />
<Badge label="In stock" tone="success" />
<Badge label="Sold out" tone="destructive" />`,
    exports: ['Badge'],
    group: 'content',
    host: 'native',
    id: 'badge',
    name: 'Badge',
    renders: {android: 'Compose Badge', ios: 'SwiftUI capsule'},
    summary: 'A small status label.',
    types: ['BadgeProps'],
  },
  {
    code: `<Avatar initials="AN" size="lg" />
<Avatar size="md" source={{uri: user.photo}} />`,
    exports: ['Avatar'],
    group: 'content',
    host: 'rn',
    id: 'avatar',
    name: 'Avatar',
    notes: ['Falls back to `initials` when there is no `source`.'],
    renders: {android: 'React Native', ios: 'React Native'},
    summary: 'A person’s initials or photo in a circle.',
    types: ['AvatarProps'],
  },
  {
    code: `<Icon name="heart" />
<RnIcon color="content.accent" name="heart" />`,
    exports: ['Icon', 'RnIcon'],
    group: 'content',
    host: 'native',
    id: 'icon',
    name: 'Icon',
    notes: [
      'Your own SVGs, made native at prebuild by the config plugin (see Icons). The library ships no icon set.',
      '`Icon` draws inside a host; `RnIcon` draws the same asset anywhere in React Native layout.',
    ],
    renders: {android: 'Compose Icon with a vector drawable', ios: 'SwiftUI Image from the asset catalog'},
    summary: 'Your own SVG icons, drawn natively in both tiers.',
    types: ['IconProps'],
  },
  {
    code: `<Image borderRadius="large" contentFit="cover" h={220} source={{uri: photo}} w="100%" />`,
    exports: ['Image'],
    group: 'content',
    host: 'rn',
    id: 'image',
    name: 'Image',
    notes: [
      '`expo-image`, with the design system’s 100 ms linear fade already applied, so a loaded image never pops in. It takes every `expo-image` prop.',
      'It takes `Box`’s `sx` props for its own box: `w`, `h`, `aspectRatio`, `borderRadius`, `position` and `inset`. No `style` object needed.',
    ],
    renders: {android: 'expo-image', ios: 'expo-image'},
    summary: 'A remote or local image that fades in.',
    types: [],
  },
  {
    code: `<Card>
  <VStack align="start" spacing="s4">
    <Text variant="headingXs">Air Max 90</Text>
    <Text color="content.secondary" variant="subheadline">Leather, mesh and a visible Air unit.</Text>
  </VStack>
</Card>`,
    exports: ['Card'],
    group: 'content',
    host: 'native',
    id: 'card',
    name: 'Card',
    notes: [
      'Carries `surface.primary`, the `card` shadow and a large radius on both platforms; pass `sx` props to override any of them.',
    ],
    renders: {android: 'Compose Column', ios: 'SwiftUI VStack'},
    summary: 'A raised container for one piece of content.',
    types: ['CardProps'],
  },
  {
    code: `<Surface wide>
  <Text variant="labelMedium">Plain surface</Text>
</Surface>
<Surface bg="fill.accent.base" glass wide>
  <Text variant="labelMedium">Glass surface</Text>
</Surface>`,
    exports: ['Surface'],
    group: 'content',
    host: 'native',
    id: 'surface',
    name: 'Surface',
    notes: [
      '`glass` reaches for iOS 26 glass and a Material 3 tonal surface on Android. The two do not look alike, and are not meant to.',
    ],
    renders: {android: 'Compose Surface', ios: 'SwiftUI VStack in a GlassEffectContainer'},
    summary: 'A coloured, rounded background, plain or glass.',
    types: ['SurfaceProps'],
  },
  {
    code: `<BlurView borderRadius="large" material="thin" p="s16">
  <RnText variant="headline">Now playing</RnText>
</BlurView>`,
    examples: [
      {code: '<BlurView material="ultraThick" vibrancy="secondary">…</BlurView>', title: 'Vibrant content (iOS)'},
      {code: '<BlurView appearance="dark" material="thin">…</BlurView>', title: 'A dark HUD over any screen'},
      {code: '<BlurView intensity={progress} material="ultraThick" />', title: 'Fading in with a shared value'},
    ],
    exports: ['BlurView'],
    group: 'content',
    host: 'rn',
    id: 'blur-view',
    name: 'BlurView',
    notes: [
      'The five system materials, by SwiftUI’s names (`ultraThin`, `thin`, `regular`, `thick`, `ultraThick`), as a UIKit view on iOS: no host, cheap enough for a list cell.',
      '`vibrancy` draws the content the way iOS draws its own on a material: its colour becomes the material’s vibrant one at that level, its alpha the mask. iOS only.',
      'Android has the same five, in its own terms: what lies behind, blurred and saturated (Android 12+), under a Material tonal surface that rises from `surface` to `surfaceContainerHighest` as the material thickens. Below Android 12 the surface alone, near-opaque.',
      '`appearance` pins a material to light or dark whatever the app’s; Android draws the opposite one with Material’s inverse surface.',
      '`intensity` from 0 to 1. Pass a shared value to animate it.',
    ],
    renders: {android: 'Backdrop blur + tonal surface (kara)', ios: 'UIBlurEffect system materials'},
    summary: 'The system materials: what sheets, bars, menus and HUDs are made of.',
    types: ['BlurViewProps'],
  },
  {
    code: `<Pressable borderRadius="full" onPress={play}>
  <GlassView interactive px="s20" py="s12">
    <RnText pointerEvents="none" variant="labelMedium">Play</RnText>
  </GlassView>
</Pressable>`,
    exports: ['GlassView'],
    group: 'content',
    host: 'rn',
    id: 'glass-view',
    name: 'GlassView',
    notes: [
      'Liquid Glass on iOS 26, as a UIKit view: no host, so it is cheap enough for every cell of a list.',
      'Android has frosted glass of its own: what lies behind the capsule, blurred (Android 12+), under a translucent tonal surface (or `tint`) and a light hairline; the blurred surfaces Android 16 gives its system UI. Below Android 12 the same colours are drawn near-opaque, so the content stays readable.',
      'Below iOS 26 it is a capsule of `tint`, or of the translucent glass fill.',
      'Interactive glass swells toward the finger on iOS and carries its children; the press itself belongs to a `Pressable` around it. With `borderRadius="full"`, its Android ripple keeps to the capsule.',
      'On Android each glass re-records what lies behind it before every frame: a few buttons cost nothing, but keep it out of the cells of a long list.',
    ],
    renders: {android: 'Frosted glass: backdrop blur (kara)', ios: 'UIGlassEffect'},
    summary: 'Glass around any React Native content: Liquid Glass on iOS, frosted on Android.',
    types: ['GlassViewProps'],
  },
  {
    code: `<EmptyState
  action={<Button label="Clear filters" onPress={clear} variant="secondary" />}
  description="Try a different search, or clear the filters."
  icon="search"
  title="No results"
/>`,
    exports: ['EmptyState'],
    group: 'content',
    host: 'native',
    id: 'empty-state',
    name: 'EmptyState',
    renders: {android: 'Compose Column', ios: 'SwiftUI VStack'},
    summary: 'What to show when there is nothing to show.',
    types: ['EmptyStateProps'],
  },

  // Layout and lists
  {
    code: `<VStack align="start" bg="surface.primary" borderRadius="large" p="s16" spacing="s12" wide>
  <Text variant="headline">Order #1024</Text>
  <Divider />
  <HStack wide>
    <Text>Subtotal</Text>
    <Spacer />
    <Text variant="headline">€129</Text>
  </HStack>
</VStack>`,
    exports: ['VStack', 'HStack', 'ZStack', 'Spacer', 'Divider'],
    group: 'layout',
    host: 'native',
    id: 'stacks',
    name: 'Stacks',
    notes: [
      'Native stacks take the native `sx` surface: `spacing` rather than `gap`, `wide` and `tall` rather than flex.',
      'A stack with `onPress` is pressable, and on Android its ripple covers the whole shape, padding included.',
      '`Spacer` eats the free space; `spacing` is the fixed gap. A `ZStack` draws its last child on top.',
      '`Divider` with `axis="vertical"` stands between the children of an `HStack`: Compose’s `VerticalDivider` on Android, where the stack needs a height; SwiftUI turns its divider by itself.',
    ],
    renders: {android: 'Compose Column, Row, Box', ios: 'SwiftUI VStack, HStack, ZStack'},
    summary: 'VStack, HStack and ZStack lay native views out in a column, a row or layers.',
    types: ['VStackProps', 'HStackProps', 'ZStackProps', 'SpacerProps', 'DividerProps'],
  },
  {
    code: `<RnScrollView content={{gap: 's24', p: 's20'}}>
  <RnText variant="headingS">Checkout</RnText>
  <Island>
    <Button label="Pay €129" onPress={pay} wide />
  </Island>
</RnScrollView>`,
    exports: ['Island', 'RnView'],
    group: 'layout',
    host: 'self',
    id: 'island',
    name: 'Island',
    notes: [
      'Native views only render inside an `Island` or a `Screen`. Outside one they silently disappear (in development, a warning says so).',
      'Sized to its content by default. Give it `matchContents={false}` and a height (`h`) when the content has none of its own (a `List`, a `Form`, a `Pager`) or contains an `RnView`.',
      'It sits in React Native layout like a `Box` and takes the same `sx` props: `h`, `flex`, margins.',
      '`RnView` carries a React Native view back into a native layout.',
    ],
    renders: {android: 'Compose Host', ios: 'SwiftUI Host'},
    summary: 'Where native views meet React Native layout.',
    types: ['IslandProps', 'RnViewProps'],
  },
  {
    code: `export default function Settings() {
  return (
    <Screen>
      <List>
        <ListItem icon="user" onPress={openAccount} title="Account" />
        <ListItem icon="lock" title="Privacy" />
      </List>
    </Screen>
  )
}`,
    exports: ['Screen'],
    group: 'layout',
    host: 'self',
    id: 'screen',
    name: 'Screen',
    notes: [
      'The full-bleed native host a screen starts with. Everything inside is native layout. For a React Native page with native islands, use `RnScrollView` and `Island` instead.',
      'The background runs to the edges; the content keeps clear of the status bar wherever the screen covers it: SwiftUI’s safe area on iOS, measured by kara on Android, where the app is edge to edge.',
    ],
    renders: {android: 'Compose Host filling the screen', ios: 'SwiftUI Host filling the screen'},
    summary: 'A whole screen of native views.',
    types: ['ScreenProps'],
  },
  {
    code: `<List onRefresh={reload}>
  <ListItem icon="user" onPress={openAccount} subtitle="Name, email, password" title="Account" />
  <ListItem icon="notification" onPress={openNotifications} subtitle="Orders, offers" title="Notifications" />
  <ListItem icon="lock" subtitle="Face ID is on" title="Privacy" />
</List>`,
    exports: ['List', 'ListItem'],
    group: 'layout',
    host: 'native',
    id: 'list',
    name: 'List',
    notes: [
      'A list scrolls, so it needs a height from outside: a `Screen`, or an `Island` with `matchContents={false}` and a height.',
      'Rows are separated for you; a `Divider` among them is one too many.',
      '`onRefresh` returns a promise; the spinner runs until it settles.',
      '`variant` is `insetGrouped` (the iOS default) or `plain` (the Android default); `separators={false}` drops the lines between rows.',
    ],
    renders: {android: 'Compose LazyColumn', ios: 'SwiftUI List'},
    summary: 'A native scrolling list of rows.',
    types: ['ListProps'],
  },
  {
    code: `<ListItem icon="shopping-bag" onPress={openOrders} px="s16" subtitle="2 in progress" title="Orders" />`,
    exports: ['ListItem', 'RnListItem'],
    group: 'layout',
    host: 'native',
    id: 'list-item',
    name: 'ListItem',
    notes: [
      'Passing `onPress` is what earns the row its chevron.',
      '`RnListItem` is the same row in the React Native tier: no host, cheap to mount by the dozen.',
    ],
    renders: {android: 'Compose Row', ios: 'SwiftUI HStack'},
    summary: 'A row with an icon, a title, a subtitle and a chevron.',
    types: ['ListItemProps'],
  },
  {
    code: `<Form>
  <Form.Section footer="We only send what you ask for." title="Notifications">
    <Switch label="Order updates" onValueChange={setUpdates} value={updates} />
    <Switch label="Offers" onValueChange={setOffers} value={offers} />
  </Form.Section>
  <Form.Section title="Profile">
    <TextField label="Display name" />
  </Form.Section>
</Form>`,
    exports: ['Form'],
    group: 'layout',
    host: 'native',
    id: 'form',
    name: 'Form',
    notes: [
      'On iOS a form scrolls like a list and needs a height from outside. On Android it is a column of cards that sizes itself, inset from its container and with its titles indented to the cards’ content, like SwiftUI’s grouped form.',
    ],
    renders: {android: 'Compose cards', ios: 'SwiftUI Form'},
    summary: 'Grouped sections of settings and fields.',
    types: ['FormProps', 'FormSectionProps'],
  },
  {
    code: `<Collapsible expanded={open} label="Shipping and returns" onExpandedChange={setOpen}>
  <Text color="content.secondary">Free shipping over €50. Returns within 30 days.</Text>
</Collapsible>`,
    exports: ['Collapsible'],
    group: 'layout',
    host: 'native',
    id: 'collapsible',
    name: 'Collapsible',
    notes: [
      'The animation is each platform’s own and not configurable: SwiftUI’s disclosure on iOS; on Android the content expands down from the row with a fade and the chevron turns toward it, as a Material disclosure does.',
    ],
    renders: {android: 'Compose AnimatedVisibility', ios: 'SwiftUI DisclosureGroup'},
    summary: 'Content that expands under its label.',
    types: ['CollapsibleProps'],
  },
  {
    code: `<Island h={220} matchContents={false}>
  <Pager indicators onPageChange={setPage} page={page}>
    <Promo title="New in" />
    <Promo title="Running" />
    <Promo title="Sale" />
  </Pager>
</Island>`,
    exports: ['Pager'],
    group: 'layout',
    host: 'native',
    id: 'pager',
    name: 'Pager',
    notes: [
      'Pages are its children, addressed by index.',
      '`pageSpacing` and `scrollEnabled` are Android only. iOS draws its own dots over the bottom edge; Android places them below.',
    ],
    renders: {android: 'Compose HorizontalPager', ios: 'SwiftUI TabView, page style'},
    summary: 'Swipeable pages that snap into place.',
    types: ['PagerProps'],
  },
  {
    code: `<ScrollEdgeContainer bottomBar={<Totals />} flex={1} topBar={<Filters />}>
  <RnScrollView content={{gap: 's12', p: 's16'}}>{rows}</RnScrollView>
</ScrollEdgeContainer>`,
    exports: ['ScrollEdgeContainer'],
    group: 'layout',
    host: 'rn',
    id: 'scroll-edge-container',
    name: 'ScrollEdgeContainer',
    notes: [
      'iOS 26 gives both bars the system scroll edge effect: the progressive blur under content scrolling past them.',
      'Below iOS 26 the bars are still inset, without the effect: check `isScrollEdgeEffectAvailable()` and give them a background.',
      'Android does what a Material top app bar does on scroll: the bars stack above and below the scroll view, transparent at rest, and fill with `surface.secondary` (Material’s `surfaceContainer`), the top one once content scrolls under it and the bottom one while there is more below. The scroll view keeps its own `onScroll`.',
    ],
    renders: {android: 'Material bars that fill on scroll', ios: 'UIScrollEdgeEffect'},
    summary: 'Bars over a scroll view, with each platform’s scroll edge under them.',
    types: ['ScrollEdgeContainerProps'],
  },

  // Feedback
  {
    code: `<Progress value={0.6} />
<Progress />
<Progress circular />`,
    exports: ['Progress'],
    group: 'feedback',
    host: 'native',
    id: 'progress',
    name: 'Progress',
    notes: [
      'Leave `value` unset for the indeterminate spinner; pass 0–1 for a determinate bar or ring.',
      'A ring with a value is a SwiftUI capacity `Gauge` on iOS: a circular `ProgressView` there ignores its value and spins.',
      '`color` takes any colour token (`fill.destructive.primary`, `fill.success.primary`); on Android a bar in another colour than the accent gets a faded track of its own colour.',
    ],
    renders: {android: 'Compose Linear / CircularProgressIndicator', ios: 'SwiftUI ProgressView / Gauge'},
    summary: 'How far along something is, or that it is still going.',
    types: ['ProgressProps'],
  },
  {
    code: '<ActivityIndicator />',
    exports: ['ActivityIndicator'],
    group: 'feedback',
    host: 'self',
    id: 'activity-indicator',
    name: 'ActivityIndicator',
    notes: [
      'iOS turns UIKit’s spinner; Android plays Material 3’s expressive loading indicator, its shapes morphing as it turns.',
      'It renders anywhere: a React Native view on iOS, a host of its own on Android. Tinted `fill.accent.primary` unless `color` names another token.',
      'For how far along something is, use `Progress`.',
    ],
    renders: {android: 'Compose LoadingIndicator (Material 3 Expressive)', ios: 'UIActivityIndicatorView'},
    summary: 'That something is loading, for as long as it takes.',
    types: ['ActivityIndicatorProps'],
  },
  {
    code: `<Box flexDirection="row" gap="s12">
  <Skeleton borderRadius="full" h={48} w={48} />
  <Box flex={1} gap="s8">
    <Skeleton h={14} w={140} />
    <Skeleton h={14} />
  </Box>
</Box>`,
    exports: ['Skeleton'],
    group: 'feedback',
    host: 'rn',
    id: 'skeleton',
    name: 'Skeleton',
    notes: ['Leave `width` unset and it fills the row, the usual shape for a line of text.'],
    renders: {android: 'Reanimated view', ios: 'Reanimated view'},
    summary: 'Pulsing placeholders for content on its way.',
    types: ['SkeletonProps'],
  },
  {
    code: '<Snackbar actionLabel="Undo" message="Item deleted" onAction={undo} visible={deleted} />',
    exports: ['Snackbar'],
    group: 'feedback',
    host: 'rn',
    id: 'snackbar',
    name: 'Snackbar',
    notes: [
      'Laid over an edge of its parent (`position`, the bottom by default) at `offset` from it, with the action at the trailing end. It shows while `visible` is true.',
      '`duration` (`short` 4 s, `long` 10 s, or milliseconds) and the `dismissible` close button call `onDismiss`; turning `visible` off is yours to do.',
      'It comes in Material’s way on Android (a fade and a scale from 80 %) and slides from its edge on iOS, which has no snackbar of its own. `animation` picks one for both; `entering` / `exiting` take a [motion preset](/docs/motion) or a Reanimated animation of your own.',
    ],
    renders: {android: 'React Native', ios: 'React Native'},
    summary: 'A brief message at the bottom of the screen.',
    types: ['SnackbarProps'],
  },
  {
    code: `<Alert
  confirmLabel="Delete"
  destructive
  message="This removes your orders and wishlist. It cannot be undone."
  onConfirm={remove}
  onDismiss={() => setOpen(false)}
  title="Delete account?"
  visible={open}
/>`,
    exports: ['Alert'],
    group: 'feedback',
    host: 'native',
    id: 'alert',
    name: 'Alert',
    notes: [
      'Controlled: `visible` presents it and `onDismiss` reports every way it closed, Cancel included.',
      '`cancelLabel` puts Cancel in the app’s language, and `null` leaves it out for an alert with only its confirm button.',
    ],
    renders: {android: 'Compose AlertDialog', ios: 'SwiftUI alert'},
    summary: 'A question that needs an answer before going on.',
    types: ['AlertProps'],
  },
  {
    code: `<Tooltip onDismiss={() => setOpen(false)} text="Free returns within 30 days" visible={open}>
  <HStack onPress={() => setOpen(true)}>
    <Text color="content.accent">What is this?</Text>
  </HStack>
</Tooltip>`,
    exports: ['Tooltip'],
    group: 'feedback',
    host: 'native',
    id: 'tooltip',
    name: 'Tooltip',
    notes: [
      'Controlled on both platforms: `visible` shows it, `onDismiss` reports a dismissal. Nothing else opens it, so wire a long press to `visible` if you want one.',
      'Android draws Material’s plain tooltip in kara’s controlled `TooltipBox`, centred above the anchor and kept inside the window; any touch outside it, or the anchor scrolling away, dismisses it.',
    ],
    renders: {android: 'Material plain tooltip (kara)', ios: 'SwiftUI popover'},
    summary: 'A short hint pointing at what it explains.',
    types: ['TooltipProps'],
  },
  {
    code: `<RnTooltip
  actions={[{label: 'Got it', onPress: () => setOpen(false)}]}
  message="Save items you like and find them here later."
  onDismiss={() => setOpen(false)}
  title="Your wishlist"
  visible={open}
>
  <WishlistButton />
</RnTooltip>`,
    exports: ['RnTooltip'],
    group: 'feedback',
    host: 'rn',
    id: 'rn-tooltip',
    name: 'RnTooltip',
    notes: [
      'Anchored below a React Native view and drawn above every sibling. The anchor needs no host.',
      'iOS keeps it through a scroll; Material dismisses it on any outside touch, the start of a scroll included.',
    ],
    renders: {android: 'Material rich tooltip', ios: 'kara’s UIKit tooltip'},
    summary: 'A rich tooltip with a title and actions, for React Native content.',
    types: ['RnTooltipProps'],
  },

  // Navigation and sheets
  {
    code: `<Sheet onDismiss={close} visible={open}>
  <Sheet.Header title="Choose a size" trailingItems={[{onPress: close, type: 'close'}]} />
  <SizeList />
</Sheet>`,
    examples: [
      {
        code: `<Sheet detents={[0.6, 1]} onDismiss={close} scrollable visible={open}>
  <Sheet.Header title="Nearby stores" titleStyle="large" trailingItems={closeItem} />
  <Sheet.ScrollView content={{px: 's20'}}>{stores}</Sheet.ScrollView>
</Sheet>`,
        title: 'Detents and a large title',
      },
    ],
    exports: ['Sheet'],
    group: 'navigation',
    host: 'rn',
    id: 'sheet',
    name: 'Sheet',
    notes: [
      'React Native tier, on TrueSheet: no host, and never inside one. Native atoms in its content go in an `Island`.',
      '`Sheet.Header` is a slot, not a view: a direct child, built from `NavigationBar` into a real native header.',
      'On iOS 26 a scrollable sheet lays its header over the content, so `Sheet.ScrollView` pads by the header’s height.',
      '`onDismiss` is the user’s dismissal only; setting `visible` to false dismisses without calling it.',
    ],
    renders: {
      android: 'TrueSheet with a Material top app bar',
      ios: 'UISheetPresentationController with a UINavigationBar',
    },
    summary: 'A native sheet with a native header: titles, back, close and actions, detents and a large title.',
    types: ['SheetProps', 'SheetHeaderProps', 'SheetScrollViewProps'],
  },
  {
    code: `<NavigationBar
  leadingItems={[{onPress: back, type: 'back'}]}
  title="Checkout"
  trailingItems={[{onPress: close, type: 'close'}]}
/>`,
    exports: ['NavigationBar', 'type NavigationBarItem'],
    group: 'navigation',
    host: 'self',
    id: 'navigation-bar',
    name: 'NavigationBar',
    notes: [
      'For a header that is not a navigation screen (`Sheet.Header` is built on it).',
      'iOS: a standalone `UINavigationBar`; on iOS 26 neighbours share one glass capsule, and `separated` gives an item its own.',
      'Android: Material’s top app bar.',
      "`search` (iOS): a field under the title, or a search button that turns the bar into the field (`placement: 'integratedButton'`).",
      "`search.buttonPlacement`: the search button on the trailing side (default) or after the leading items. On iOS 26 it grows into the field like the system's search.",
      '`search.voice` puts a microphone in the field, with a live waveform while it listens. See Header › Voice.',
      'It places nothing: items go on the side and in the order you give them.',
    ],
    renders: {android: 'Material TopAppBar', ios: 'UINavigationBar'},
    summary: 'A title with items on either side: a real navigation bar outside a navigation stack.',
    types: ['NavigationBarProps', 'NavigationBarSearch', 'SearchFieldVoice'],
  },
  {
    code: `// app/(tabs)/_layout.tsx
import {Tabs} from '@hzblj/kara-ui/router'

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen icon="home" name="(home)" selectedIcon="home-filled" title="Home" />
      <Tabs.Screen icon="widgets" name="components" title="Components" />
      <Tabs.Screen icon="palette" name="design" title="Design" />
    </Tabs>
  )
}`,
    entry: '@hzblj/kara-ui/router',
    exports: ['Tabs'],
    group: 'navigation',
    host: 'rn',
    id: 'tabs',
    name: 'Tabs',
    notes: [
      'An Expo Router layout, on Expo Router’s native tabs: the system tab bar on iOS, Material’s navigation bar on Android, both in the theme’s colours.',
      'Every child route needs a `Tabs.Screen`. `hidden` drops a tab and makes its route unreachable.',
      'The iOS 26 bar does not minimise on scroll unless you ask with `minimizeBehavior`.',
    ],
    renders: {android: 'Material NavigationBar', ios: 'UITabBarController'},
    summary: 'Native tabs for Expo Router.',
    types: ['TabsProps', 'TabsScreenProps'],
  },
  {
    code: `// the list
const zoomId = useZoomTransitionSourceId(photo.id)
const open = () => router.push({params: {id: photo.id, [ZOOM_TRANSITION_PARAM]: zoomId}, pathname: '/photo/[id]'})

<Pressable onPress={open}>
  <ZoomTransition.Source android={{borderRadius: 'large'}} identifier={zoomId}>
    <Photo />
  </ZoomTransition.Source>
</Pressable>

// the pushed screen
const zoomId = useZoomTransitionParam()

<ZoomTransition.Enabler ios={{dismissGesture: 'vertical'}} sourceIdentifier={zoomId} />
<ZoomTransition.Target android={{borderRadius: 'large'}} identifier={zoomId}>
  <Photo />
</ZoomTransition.Target>

// the root layout: a full-screen modal, the way a gallery opens
<Stack.Screen
  name="photo/[id]"
  options={withZoomTransition({headerShown: Platform.OS === 'android', presentation: 'fullScreenModal'})}
/>`,
    entry: '@hzblj/kara-ui/router',
    exports: [
      'ZoomTransition',
      'ZOOM_TRANSITION_PARAM',
      'useZoomTransitionParam',
      'useZoomTransitionSourceId',
      'withZoomTransition',
    ],
    group: 'navigation',
    host: 'rn',
    id: 'zoom-transition',
    name: 'ZoomTransition',
    notes: [
      'iOS 18: UIKit’s zoom transition, with the interactive dismissal. Below iOS 18 the push stays a slide. Android: Material’s container transform, both ways.',
      'Three pieces tied by one identifier, which travels in the route params.',
      'The enabler renders first and unconditionally: behind a loading state, the push is already a slide.',
      'Zooming into a modal, give it no native header on iOS: a modal’s bar lives in a nested stack, which the zoom does not reach. Draw a close of your own; a drag down closes it too.',
      'Settings both platforms honour sit at the top; the rest is typed apart under `ios` and `android`.',
      'It is [@hzblj/expo-zoom-transition](https://www.npmjs.com/package/@hzblj/expo-zoom-transition) with the theme’s tokens. The package works without kara, taking plain values.',
    ],
    renders: {android: 'Material container transform', ios: 'UIKit zoom transition'},
    summary: 'A push that grows out of the view it was opened from, and shrinks back into it.',
    types: ['ZoomTransitionSourceProps', 'ZoomTransitionEnablerProps', 'ZoomTransitionTargetProps'],
  },

  // React Native tier
  {
    code: `<Box bg="surface.primary" borderRadius="large" flexDirection="row" gap="s12" p="s16">
  <Avatar initials="AN" />
  <RnText variant="headline">Anna Novak</RnText>
</Box>`,
    examples: [
      {code: '<Box entering="fadeUp" exiting="fade">{notice}</Box>', title: 'Arriving and leaving'},
      {
        code: `<Box animate bg={selected ? 'fill.accent.base' : 'surface.primary'} scale={selected ? 1 : 0.98} />`,
        title: 'A change of state, animated',
      },
    ],
    exports: ['Box'],
    group: 'primitives',
    host: 'rn',
    id: 'box',
    name: 'Box',
    notes: [
      'A React Native `View` wearing the `sx` props, for layout a native stack cannot express.',
      'It takes the wider of the two `sx` surfaces: `flexDirection`, `gap`, margins, flex and per-corner radii work here and on none of the native atoms.',
      'It is a Reanimated view by itself when it needs to be: `entering`, `exiting`, `layout`, `animate` or an animated `style` make it an `Animated.View` from its first frame, and without them it stays a plain `View`. See [Motion](/docs/motion).',
    ],
    renders: {android: 'React Native View', ios: 'React Native View'},
    summary: 'A styled React Native view.',
    types: ['MotionProps'],
  },
  {
    code: `<Stagger gap="s8">
  {lines.map(line => (
    <Box bg="surface.primary" borderRadius="medium" key={line.id} p="s16">
      <RnText>{line.title}</RnText>
    </Box>
  ))}
</Stagger>`,
    examples: [
      {code: '<Stagger entering="scale" from="end" interval="micro">{sizes}</Stagger>', title: 'Your own timing'},
      {code: '<Stagger exiting="fade" layout>{cartItems}</Stagger>', title: 'Making room when one leaves'},
    ],
    exports: ['Stagger'],
    group: 'primitives',
    host: 'rn',
    id: 'stagger',
    name: 'Stagger',
    notes: [
      'Each child takes `entering` a step (`interval`, 40 ms by default) after the one before it.',
      'Only the children that arrive together take turns: the first ones, or the next page of a list. A single item added later arrives at once instead of after everything above it.',
      'A `Box`, `RnText` or `Pressable` child takes the motion itself, so no view is added around it; any other child is wrapped in a `Box`.',
      'With Reduce Motion on, every child fades, still one after another.',
    ],
    renders: {android: 'React Native View', ios: 'React Native View'},
    summary: 'Children that arrive one after another.',
    types: ['StaggerProps'],
  },
  {
    code: '<RnText color="content.secondary" variant="footnote">2 items</RnText>',
    exports: ['RnText'],
    group: 'primitives',
    host: 'rn',
    id: 'rn-text',
    name: 'RnText',
    notes: [
      'The same variants and colours as `Text`, for text outside a native host. It takes every React Native `Text` prop.',
      'And `Box`’s `sx` props for its own box (margins, `flex`, padding), except `align`, which aligns its lines.',
      '`monospaced` and `monospacedDigit` set the same faces and figures as on `Text`.',
    ],
    renders: {android: 'React Native Text', ios: 'React Native Text'},
    summary: 'React Native text in the type scale.',
    types: ['RnTextProps'],
  },
  {
    code: `<RnScrollView content={{gap: 's32', p: 's20'}} flex={1}>
  {sections}
</RnScrollView>`,
    exports: ['RnScrollView'],
    group: 'primitives',
    host: 'rn',
    id: 'rn-scroll-view',
    name: 'RnScrollView',
    notes: [
      'The scroll view a page full of `Island`s wants. Top-level `sx` styles the viewport, `content` the scrolling content; padding and gap belong there.',
    ],
    renders: {android: 'React Native ScrollView', ios: 'React Native ScrollView'},
    summary: 'A React Native scroll view with the `sx` props.',
    types: ['RnScrollViewProps'],
  },
  {
    code: `<RnFlatList
  data={orders}
  keyExtractor={order => order.id}
  renderItem={({item}) => (
    <Island>
      <ListItem title={item.title} />
    </Island>
  )}
/>`,
    exports: ['RnFlatList', 'RnSectionList'],
    group: 'primitives',
    host: 'rn',
    id: 'rn-flat-list',
    name: 'RnFlatList',
    notes: [
      'The list to reach for when rows host native views: cells stay in normal flow, so a hosted view stays where the layout put it.',
      '`RnSectionList` is the sectioned sibling. Its sticky headers are off by default.',
    ],
    renders: {android: 'React Native FlatList', ios: 'React Native FlatList'},
    summary: 'React Native lists for rows that host native views.',
    types: ['RnFlatListProps', 'RnSectionListProps'],
  },
  {
    code: `<ScrollView p="s16" spacing="s12">
  <Text variant="headline">Order #1024</Text>
  <Text color="content.secondary">Shipped · arrives Friday</Text>
</ScrollView>`,
    exports: ['ScrollView'],
    group: 'primitives',
    host: 'native',
    id: 'scroll-view',
    name: 'ScrollView',
    notes: [
      'The native scroll container, for a subtree that is native all the way down. Its `sx` styles the scrolling content.',
      'For a React Native subtree, use `RnScrollView` instead.',
    ],
    renders: {android: 'Compose scrollable Column', ios: 'SwiftUI ScrollView'},
    summary: 'A native scroll view.',
    types: ['ScrollViewProps'],
  },
]

const BY_ID = new Map(COMPONENTS.map(component => [component.id, component]))

export const componentDoc = (id: string) => BY_ID.get(id)

export const componentsIn = (group: ComponentGroupId) => COMPONENTS.filter(component => component.group === group)
