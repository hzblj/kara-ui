# @hzblj/kara-components

The component library. Components render **real SwiftUI / Jetpack Compose views** through
`@expo/ui`, not styled `View`s — which is why almost everything here is split per platform. Sorted
by Atomic Design; consumers import it through `@hzblj/kara-ui`. Depends on `@hzblj/kara-theme`, `@hzblj/kara-sx`
and `@hzblj/kara-native` — through their entry points only.

## Map

| Path | What it is |
| --- | --- |
| `src/atoms/` | Primitives: Box, Text, Button, TextField, Switch, Checkbox, Slider, Picker, Icon, Image, the stacks (`VStack`/`HStack`/`ZStack`), Divider, Spacer, Surface, Card, Badge, Progress, Fab, Island, List, ScrollView. |
| `src/atoms/rn-*` | The React Native tier — `RnView`, `RnText`, `RnScrollView`, `RnFlatList`, `RnSectionList`. Plain RN views with the same `sx` surface, for rows that host native views. |
| `src/atoms/glass-view/`, `atoms/countdown/` | React Native-tier atoms over the package's own native views: iOS 26 Liquid Glass around RN children (a tinted capsule elsewhere), and a natively ticking countdown laid over an invisible RN text frame. |
| `src/atoms/flash-list/` | The default list. Recycles and absolutely positions cells, which an `@expo/ui` host does not survive — use `RnFlatList`/`RnSectionList` when rows contain native atoms. |
| `src/molecules/` | Label, LabeledContent, ListItem, Link, SearchBar, EmptyState, Collapsible, Pager, RadioGroup, Stepper, Tooltip — and over the native module: NavigationBar, ScrollEdgeContainer, RnTooltip. |
| `src/organisms/` | Sheet, ActionSheet, Alert, Menu, ContextMenu, Form, SwipeActions, Snackbar — and over the native module: RnContextMenu, FabMenu. (`Tabs` lives in `@hzblj/kara-router`, behind the `@hzblj/kara-ui/router` entry, so the main entry never imports expo-router.) |
| `src/templates/screen/` | `Screen` — the full-bleed native host every screen starts with. |
| `src/host-context.tsx` | `HostBoundary` + `useHostGuard`: dev warning when a native atom renders outside `Screen`/`Island`. |
| `src/platform-support.ts` | `warnUnsupported` — one-per-atom dev error for atoms only one platform can implement. |
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

**No raw style values.** Components take `sx` props resolved by `@hzblj/kara-sx` against `@hzblj/kara-theme`.
A component that owns its own `style` prop uses `useSplitSx` instead of the `sx()` wrapper.

**Two `sx` surfaces, and they are not interchangeable.** Native atoms take `ResponsiveSx` — only
what SwiftUI and Compose both honour. `Box` and the `Rn*` tier take `ResponsiveViewSx`, which adds
the React Native style keys (`flexDirection`, `gap`, margins, flex, per-corner radii). Reaching for
`gap` on a `VStack` does not compile; it wants `spacing`.

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

**Divergence goes in `parameters.notes`.** iOS-only (`ColorPicker`, `SwipeActions`), SwiftUI-only
props (`buttonStyle`, `controlSize`), Android-only ones (`pageSpacing`) — the notes tab is where a
reader finds out before the other platform surprises them.

New components: obvious primitives go straight into `atoms/`; feature-specific UI stays in its
feature until a second call site needs it. See the atomic-design and component-architecture skills.

## Over the native module

Some components wrap views of the KaraUI Expo module (`@hzblj/kara-native` — Swift, Kotlin and raw bindings)
rather than `@expo/ui`. Same shape and rules; three things differ.

**`Rn*` means the React Native tier, not a duplicate.** `RnTooltip` and `RnContextMenu` take React Native
anchors and children and need no host; `Tooltip` and `ContextMenu` stay the native-tier versions whose trigger
is a native view inside a `Screen`/`Island`. Pick by what the trigger is.

**Bindings live in `@hzblj/kara-native`, components never call `requireNativeView` themselves.** `requireKaraView`
registers a view lazily, so a view only one platform implements fails when rendered there, never on import —
which is what lets `index.ts` export everything on both platforms. `isLiquidGlassAvailable` and
`isScrollEdgeEffectAvailable` answer `false` on Android and below iOS 26.

**Never name a native prop after a React Native style key** (`width`, `backgroundColor`, `shadowColor`…):
Fabric reads it as layout or style. Prefix it (`bubbleWidth`). A new native view needs a pod install / Gradle
sync and a native rebuild of the app; a new `.ios.tsx`/`.android.tsx` caller needs Metro `--clear`.

