# @hzblj/kara-components

The component library. Components render **real SwiftUI / Jetpack Compose views** through
`@expo/ui`, not styled `View`s — which is why almost everything here is split per platform. Sorted
by Atomic Design; consumers import it through `@hzblj/kara-ui`. Depends on `@hzblj/kara-theme`, `@hzblj/kara-sx`
and `@hzblj/kara-native` — through their entry points only.

## Map

| Path | What it is |
| --- | --- |
| `src/atoms/` | Primitives: Box, Text, Button, TextField, Switch, Checkbox, Slider, Picker, Icon, Image, the stacks (`VStack`/`HStack`/`ZStack`), Divider, Spacer, Surface, Card, Badge, Progress, Fab, Island, List, ScrollView. |
| `src/atoms/stagger/` | `Stagger`: a `Box` whose children arrive one after another. Only the children new in a render take turns (a first batch, the next page), a single one added later arrives at once. A motion component child is cloned with the props, any other is wrapped in a `Box`. |
| `src/atoms/rn-*` | The React Native tier — `RnView`, `RnText`, `RnIcon`, `RnScrollView`, `RnFlatList`, `RnSectionList`. Plain RN views with the same `sx` surface, for rows that host native views. |
| `src/atoms/glass-view/` | A React Native-tier atom over the native module: iOS 26 Liquid Glass around RN children (a translucent capsule elsewhere). |
| `src/molecules/` | Label, LabeledContent, ListItem (and `RnListItem`, its React Native-tier row for long lists), Link, SearchBar, EmptyState, Collapsible, Pager, RadioGroup, Stepper, Tooltip — and over the native module: NavigationBar, ScrollEdgeContainer, RnTooltip. |
| `src/organisms/` | Sheet (TrueSheet with a native header: `Sheet.Header`, `Sheet.ScrollView`, `useSheetScroll`), ActionSheet, Alert, Menu, Form, SwipeActions, Snackbar — and over the native module: ContextMenu (long-press on React Native content, with a custom preview on iOS), FabMenu. (`Tabs` lives in `@hzblj/kara-router`, behind the `@hzblj/kara-ui/router` entry, so the main entry never imports expo-router.) |
| `src/templates/screen/` | `Screen` — the full-bleed native host every screen starts with. |
| `src/host-context.tsx` | `HostBoundary` + `useHostGuard`: dev warning when a native atom renders outside `Screen`/`Island`. `useInsideHost`: whether one already encloses it, for the atoms that otherwise bring their own. |
| `src/story-decorators.tsx` | `insideIsland` / `insideIslandOfHeight` — the host a story mounts its subject in. Internal: not exported from `index.ts`. |
| `src/use-refresh-state.ts` | Bridges SwiftUI's promise-driven `refreshable` and Compose's controlled `PullToRefreshBox` into one async `onRefresh`. |

## Component shape

A split component is always four files, with **no fallback `.tsx`**:

```
button/
  button.types.ts     the shared contract (ButtonProps + ButtonComponent)
  button.ios.tsx      SwiftUI implementation
  button.android.tsx  Compose implementation
  contract.check.ts   assigns both to ButtonComponent — this is what keeps them honest
  index.ts            named re-exports
```

Single-implementation components (`chip`, `skeleton`, `image`, the `rn-*` tier) drop the split and
ship one `.tsx`. Tokens shared by both sides live in `*-tokens.ts`.

## Rules

**Never add a plain `x.tsx` next to a split pair** — resolution relies on `moduleSuffixes`, and a
fallback file would quietly win on both platforms. Run `yarn typecheck` (it checks the iOS and
Android configs separately); a mismatch surfaces in `contract.check.ts`.

**Native atoms need a host.** They only render inside `<Screen>` or `<Island>`.

**An atom that drops into React Native layout joins a host it finds itself in.** `Picker`, `SegmentedControl`,
`ActivityIndicator` and `DatePicker` work without a `Screen` or `Island`, so each brings its own host or is a plain
React Native view. Each asks `useInsideHost()` and, inside one, renders straight into that host; a React Native view
(iOS's `SegmentedControl` and `ActivityIndicator`, Android's `DatePicker` field) goes in through `RNHostView`. A host
nested in another breaks the outer one: on Android it is a real view beside the outer host's `ComposeView`, in a
horizontal `LinearLayout` that measures the `ComposeView` in the width the nested host leaves (none, for a full-width
one), and on iOS it gets no height in the outer stack. A new atom of this kind does the same.

**No raw style values.** Components take `sx` props resolved by `@hzblj/kara-sx` against `@hzblj/kara-theme`.
A component that owns its own `style` prop uses `useSplitSx` instead of the `sx()` wrapper.

**Two `sx` surfaces, and they are not interchangeable.** Native atoms take `ResponsiveSx` — only
what SwiftUI and Compose both honour. `Box` and the `Rn*` tier take `ResponsiveViewSx`, which adds
the React Native style keys (`flexDirection`, `gap`, margins, flex, per-corner radii). Reaching for
`gap` on a `VStack` does not compile; it wants `spacing`.

**Where `sx` goes: anything with a box to lay out.** Every container (the stacks, `Surface`, `Card`, the scroll
views, `GlassView`, `BlurView`, `Pressable`, `Sheet`, `ContextMenu`), `Text` and `RnText`, and the React Native views
that have to be sized in Yoga (`Image` is `sx(expo-image)`, `Island` takes `h`). Controls and glyphs — `Button`,
`Switch`, `Icon`, `Avatar`, `ActivityIndicator` — take none: their size is a token prop, the stack around them places
them, and their look is the design system's. A component sized by props uses the `sx` names (`Skeleton`'s `w`, `h`,
`borderRadius`).

## Stories

Every component here has a `*.stories.tsx` beside it, and Storybook is wired up in `apps/example`
(`.rnstorybook/main.ts` globs the three tiers of this package). It runs **on device**, because these
components are real SwiftUI and Compose views — there is nothing for a browser to render.

```
button/
  button.stories.tsx  title 'Atoms/Button', one export per state worth seeing
```

**A story mounts its subject in a host, or it shows nothing.** Native atoms take
`decorators: [insideIsland]` from `story-decorators.tsx`; `insideIslandOfHeight(n)` is for a
subtree containing `RnView`, and for native views with no intrinsic height (`ScrollView`, `Pager`).
The React Native tier — `Box`, the `Rn*` atoms, `Chip`, `Avatar`, `Skeleton`, `Snackbar`,
`SearchBar`, `SegmentedControl`, `Picker`, `DatePicker`, the lists — takes **no** decorator.

**`templates/` has no stories, by design.** `Screen` is full-bleed and owns the viewport, so a story
frame would show nothing it can vary — and `main.ts` lists the tiers one by one to keep it that way.
`Tabs` is the other exception: it is an Expo Router layout and throws outside one, so its story
documents the contract rather than mounting it.

**Never put a React element in `args`.** Storybook walks args to serialise the Controls panel, and in a
dev build that walk reaches React's own element internals — where it finds cycles, and can reach a
context object whose default value throws by design (expo-router's `UnhandledLinkingContext` does). The
symptom is `Couldn't find an UnhandledLinkingContext context.` thrown out of `createPreparedStoryMapping`,
next to a pile of "We've detected a cycle in arg" warnings. Children belong in `render`; where the prop is
required, `args` carries `children: null` purely to satisfy the type.

**A controlled component writes its value back through `useArgs`**, not local state — that is what
keeps the Controls panel showing what is actually on screen.

**Divergence goes in `parameters.notes`.** A platform's own implementation (`ColorPicker` on Android), SwiftUI-only
props (`buttonStyle`, `controlSize`), Android-only ones (`pageSpacing`) — the notes tab is where a
reader finds out before the other platform surprises them.

New components: obvious primitives go straight into `atoms/`; feature-specific UI stays in its
feature until a second call site needs it. See the atomic-design and component-architecture skills.

## Over the native module

Some components wrap views of the KaraUI Expo module (`@hzblj/kara-native` — Swift, Kotlin and raw bindings)
rather than `@expo/ui`. Same shape and rules; three things differ.

**`Rn*` means the React Native tier, not a duplicate.** `RnTooltip` takes a React Native anchor and needs no host;
`Tooltip` stays the native-tier version whose anchor is a native view inside a `Screen`/`Island`. Pick by what the
anchor is. `ContextMenu` has one implementation only — the native module's, on a React Native trigger — because it is
the better one: a real `UIContextMenuInteraction` with a lifted preview.

**Bindings live in `@hzblj/kara-native`, components never call `requireNativeView` themselves.** `requireKaraView`
registers a view lazily, so a view only one platform implements fails when rendered there, never on import —
which is what lets `index.ts` export everything on both platforms. `isLiquidGlassAvailable` and
`isScrollEdgeEffectAvailable` answer `false` on Android and below iOS 26.

**Never name a native prop after a React Native style key** (`width`, `backgroundColor`, `shadowColor`…):
Fabric reads it as layout or style. Prefix it (`bubbleWidth`). A new native view needs a pod install / Gradle
sync and a native rebuild of the app; a new `.ios.tsx`/`.android.tsx` caller needs Metro `--clear`.

## Accessibility

**Every native component that lays out a box takes `AccessibilityProps`** (`@hzblj/kara-sx`): split them off with
`splitAccessibility`, turn them into modifiers with `useAccessibilityModifiers(props, pressable)` and place those as
the engine's CLAUDE.md says (last on iOS, after the `clickable` on Android; `use-stack-modifiers.ts` does it for the
Compose stacks). A React Native tier component maps the same props with `accessibilityProps`. A pressable thing is a
`button` unless its props say otherwise, and reads its children as one element.

**An icon has no words.** `IconButton`, `Fab` and `FabMenu` require `accessibilityLabel`, carried by the icon inside, as
Material's own icon buttons carry it. `Icon`, `Glyph`, `Avatar` without a label, and `Skeleton` are hidden from screen
readers. Native controls (`Button`, `Switch`, `Slider`, `TextField`…) are read from their own labels; do not add one.

## Motion

**Durations, curves and springs are tokens, picked by what the motion does** (`timing(size, curve)` and
`spring(name)` from `@hzblj/kara-sx` for Reanimated): arriving `fast`, leaving `quick`, a touch `micro`, `smoothOut`
unless it is a swap, a small fade or a loop. What a finger drives is a spring, so it keeps its speed when interrupted:
`Pressable` scales down on `interactive` and back on `smooth`. No bounce in a control; `bouncy` is for an emphasised
moment. Both helpers pass `ReduceMotion.Never`, because the component has honoured the preference first.

**Motion props are the engine's, not each component's.** `Box` (and every `sx()` component), `RnText`, `Pressable` and
`Stagger` take `entering`, `exiting`, `layout` and `animate` and become Reanimated views by themselves; there is no
`ABox`. A component that owns its `style` and wants them uses `useSplitSxMotion`, passes `motion.entering` / `exiting` /
`layout` and `motion.style` to its Reanimated view, latches with `useAnimatedLatch` unless it is always animated, and
marks itself with `markMotionComponent` so `Stagger` hands it the props instead of wrapping it.

**`Text` spans are nested `Text`, and `animate` eases their colours.** `spansOf` (`atoms/text/spans.ts`) reads the
children: strings and nested `Text` become runs, a span keeping only its `color`. iOS renders them as `@expo/ui` Text
children, which SwiftUI concatenates into one `Text`; with `animate`, `textColorTransition` (`@hzblj/kara-sx`) adds
`.contentTransition(.interpolate)` and `.animation(value:)` keyed on the colours and the text (`spansKey`), so SwiftUI
interpolates a colour that changes. Android renders them as `@expo/ui` Text spans, which animate nothing; with
`animate` it renders kara-native's `AnimatedText` instead, a Compose `Text` whose spans each run `animateColorAsState`
on the same timing (`smoothOut` a no-bounce spring over its duration, a spring token's physics, the other curves as
tweens along their béziers). Colours keep easing with Reduce Motion on, as `animate`'s colours do everywhere. A span
keeps its animation by position, so give a karaoke one span per word: regrouping words into runs would hand a run's
animation to different words.

**`monospaced` is a face, `monospacedDigit` a feature of whichever face is set.** `Text` and `RnText` read
`theme.monoTypography` for the first. The second is SwiftUI's `monospacedDigit()`, React Native's
`fontVariant: ['tabular-nums']`, and on Compose `fontFeatureSettings` `tnum`, which `@expo/ui`'s text cannot set, so a
`monospacedDigit` `Text` on Android draws kara-native's `AnimatedText` (no `animation` unless `animate` asks, so a colour
still switches). There is no `ios.monospacedDigit` in `sx` any more: the prop covers both platforms.

**`RnText` takes 0.01 pt off every line on iOS** (`LINE_HEIGHT_SLACK`). React Native draws a paragraph into the frame
Yoga rounded, which can come back a hair short of the exact height of fixed-height lines, and the last line vanished.

**Every animation answers `useReducedMotion()`.** With it on, nothing slides, scales, turns or loops; what needs a
transition to read fades (`Pressable` dims instead of scaling, `Snackbar` fades, `Skeleton` holds still). Compose and
SwiftUI follow the device's setting by themselves, but not `KaraProvider reduceMotion`, so a Compose or SwiftUI
animation kara drives (`Collapsible`'s turn, `Stepper`'s `numericText`) reads the hook too.

## Haptics

**A component plays a haptic only where the platform's own control would and ours does not.** Compose's Material
controls play none, so on Android `Switch` plays `toggleOn`/`toggleOff`, a stepped `Slider` ticks at every stop,
`SegmentedControl` plays `selection` for a new segment and `ContextMenu` its long press. On iOS `UISwitch` has none,
and iOS 26's slider and segmented control play their own — adding one would double it. Every component haptic goes
through `haptics` from `@hzblj/expo-rich-haptics` (a package of its own, in its own repo, and a dependency here), so
`haptics.setEnabled(false)` silences it too; a `Pressable` with `haptic` prepares it on press-in. kara no longer
exports `haptics`, `useHapticFeedback` or the `Haptic` type: an app imports them from that package.

**Haptics are felt, not seen.** The simulator and the emulator play nothing; check a change on a device.

## Ripples

**An Android ripple only stops at rounded corners if a parent clips it.** `android_ripple` is drawn as the pressable's
foreground, which its own `overflow: hidden` does not clip. A shaped pressable splits its style with `splitForRipple`
(`src/ripple-clip.ts`): the shape, background and outer layout on an outer clipping view, the padding and content layout
on the pressable inside. Compose stacks avoid the problem by ordering: `use-stack-modifiers.ts` puts `clickable` after
the clip and background and before the padding, so the ripple fills the shape edge to edge.

## Sheets

**`Sheet` is the React Native tier on TrueSheet** (`@lodev09/react-native-true-sheet`, a peer dependency): no host,
and never inside one — native atoms in its content go in an `Island`. `<Sheet.Header>` is a slot, not a view: it must
be a direct child, and `split-sheet-children.ts` lifts its props into TrueSheet's own `header`, built from
`NavigationBar` by `use-sheet-header.tsx`.

**On iOS 26 a scrollable sheet's header is laid over the content.** The scroll edge effect only blurs what scrolls
*under* the header, so the header is absolutely positioned and `Sheet.ScrollView` (or a scroll view of your own reading
`useSheetScroll`) pads its content by the header's measured height. Elsewhere the header sits above the content and
the inset is 0. A `large` title lives inside the scroll view and flips the bar's own title on once it has scrolled away.

**`systemBackground` leaves iOS its own sheet background.** TrueSheet draws the system's when it gets no
`backgroundColor`: untinted Liquid Glass on iOS 26, a material blur before it. The corner radius is already the
system's on iOS. Android keeps `bg`, since Material's sheet has no glass.

**`onDismiss` is the user's dismissal only.** `visible` going false dismisses without calling it, and a sheet
unmounted while presented dismisses itself — otherwise it would stay on screen over everything.

**`NavigationBar` places nothing.** Items go on the side and in the order the caller gives; the close-on-the-right
convention belongs to call sites. `separated` (iOS 26 glass capsules) has no Material counterpart, and `search` is
iOS-only for now.

## Icons

**The library has no icon set; apps bring SVGs.** `IconName` is `NativeIconName` from `@hzblj/expo-native-icons`: the
keys of the global `NativeIcons`, which the config plugin writes into the app's `native-icons.d.ts` from its icon
folder, any string until it exists. Every icon prop (`Icon`, `RnIcon`, `IconButton`, `Fab`, `ListItem`, `Label`,
`LabeledContent`, `Link`, `EmptyState`, `FabMenu`, menu actions, `Tabs`) takes one, and resolves it through that
package's `iconResourceName` to the native asset the plugin generated (`native_icon_<name>`): an asset-catalog template
image on iOS, a vector drawable on Android.

**`Icon` lives in a host, `RnIcon` anywhere.** `Icon` is SwiftUI `Image(assetName)` / Compose `Icon(painterResource)`;
`RnIcon` is `@hzblj/expo-native-icons`' `NativeIcon` (a `UIImageView`, one Android view drawing the drawable), what a
list row wants rather than a host per row. Same props, same asset, same size. An Android `RnGlyph` draws its drawable
through the same package's `NativeIconView`; an iOS one is kara's own `IconView` (an SF Symbol).

**`src/glyph/` is internal.** The handful of glyphs kara's own chrome draws — a search field's magnifier, a row's
chevron, a stepper's plus and minus, a bar's back and close — come from `GLYPHS` in `@hzblj/kara-native`: SF Symbols
on iOS, Material Symbols drawables the module ships on Android. `Glyph`, `RnGlyph` and `GlyphButton` are not
exported; a component that needs a new glyph adds it to `packages/native/glyphs.json`. App-facing props never take a
glyph.

