import {CodeBlock} from '../../ui/code-block'
import {PropsTable} from '../components/props-table'
import type {Guide} from './guide'
import {Callout, Hero, List, P, Section, Table} from './parts'

const PROPS_USAGE = `<HStack accessibilityHint="open the order" onPress={openOrder} spacing="s12">
  <Icon name="shopping-bag" />
  <Text>Order #1024</Text>
  <Text color="content.secondary">Shipped</Text>
</HStack>
// VoiceOver: "Order #1024, Shipped, Button. Open the order."
// TalkBack:  "Order #1024, Shipped, Button, double tap to open the order."

<IconButton accessibilityLabel="Share" name="share" onPress={share} />
<Text accessibilityRole="header" variant="title2">Orders</Text>
<Icon name="info" /> {/* no label: decorative, hidden from both readers */}`

const MOTION_USAGE = `import {duration, easing, useReducedMotion} from '@hzblj/kara-ui'
import {useEffect} from 'react'
import {Easing, ReduceMotion, useSharedValue, withTiming} from 'react-native-reanimated'

// Arriving: \`fast\` on \`smoothOut\`.
const POP = {
  duration: duration.fast,
  easing: Easing.bezier(...easing.smoothOut),
  reduceMotion: ReduceMotion.Never, // honoured below already
}

const Badge = ({count}: {count: number}) => {
  const reduced = useReducedMotion()
  const scale = useSharedValue(1)

  useEffect(() => {
    if (reduced) {
      return // the new number is enough; nothing pops
    }

    scale.value = 0.8
    scale.value = withTiming(1, POP)
  }, [count, reduced, scale])
  // ...
}`

export const accessibility: Guide = {
  Content: () => (
    <>
      <Hero id="accessibility" kicker="Core concepts" title="Accessibility and motion">
        <P>
          {
            'kara’s components are read by VoiceOver and TalkBack the way the platform’s own controls are, and their motion follows the user’s Reduce Motion setting. For what a component cannot know (what an icon means, where a row leads), one set of props says it on both platforms: SwiftUI’s accessibility modifiers on iOS, Compose semantics on Android.'
          }
        </P>
      </Hero>

      <Section id="props" title="The props">
        <P>
          {
            'The stacks, `Text`, `Card`, `Surface`, `ListItem`, `LabeledContent`, `Link` and `Pressable` take all of them; `IconButton`, `Fab`, `Button`, `Avatar`, `Progress` and `ActivityIndicator` take the ones they can use. They are named as React Native names them.'
          }
        </P>
        <CodeBlock code={PROPS_USAGE} language="tsx" />
        <PropsTable name="AccessibilityProps" />
      </Section>

      <Section id="defaults" title="What the components do by themselves">
        <List
          items={[
            'A stack with `onPress` is one button: its children are read as one label, in order, and VoiceOver and TalkBack say “Button”. `Pressable` is a button too.',
            '`ListItem`, `RnListItem` and a `LabeledContent` with a `value` are read as one element. `Link` is announced as a link on iOS.',
            '`IconButton`, `Fab` and `FabMenu` require an `accessibilityLabel`: an icon has no words of its own.',
            '`Icon`, `Avatar` and the glyphs kara draws (a chevron, a close) are decorative and hidden unless they are given a label. `Skeleton` is always hidden: what is loading is for the screen to say.',
            '`Snackbar` is announced when it appears, and its close button is labelled.',
            'The native controls (`Button`, `Switch`, `Checkbox`, `Slider`, `TextField`, `Picker`, `Stepper`, `SegmentedControl`) are read by the platform from their own labels and values.',
          ]}
        />
      </Section>

      <Section id="platforms" title="On each platform">
        <Table
          columns={['Prop', 'iOS', 'Android']}
          rows={[
            [
              '`accessibilityLabel`',
              '`accessibilityLabel`',
              '`contentDescription`, which replaces the children’s on an element read as one',
            ],
            [
              '`accessibilityHint`',
              '`accessibilityHint`, read after a pause',
              'the click action’s label, “double tap to …”, on a pressable view only',
            ],
            [
              '`accessibilityRole`',
              'a trait: `isButton`, `isHeader`, `isImage`, `isLink`, `isStaticText`',
              '`Role.Button`, `Role.Image` or `heading()`; no link role',
            ],
            ['`accessibilityValue`', '`accessibilityValue`', '`stateDescription`'],
            ['`accessible`', '`accessibilityElement(children: .combine)`', '`mergeDescendants`'],
            ['`accessibilityHidden`', '`accessibilityHidden`', '`clearAndSetSemantics {}`'],
          ]}
        />
        <Callout>
          {
            'Phrase a hint as an action (“open the order”): iOS reads it as a sentence of its own, Android after “double tap to”.'
          }
        </Callout>
      </Section>

      <Section id="motion" title="Reduce Motion">
        <P>
          {
            'With Reduce Motion on (iOS) or Remove animations (Android), nothing in kara slides, scales, turns or loops, and what needs a transition to read fades instead, as Apple and Material both advise. The setting is read live: a user can flip it while the app is open.'
          }
        </P>
        <Table
          columns={['Component', 'Motion', 'With motion reduced']}
          rows={[
            ['`Pressable`', 'eases down to `pressedScale`', 'dims to `pressedOpacity` instead'],
            ['`Snackbar`', '`slide` or `scale` in and out', 'fades'],
            ['`Skeleton`', 'pulses', 'holds still'],
            ['`Collapsible` (Android)', 'expands, the chevron turns', 'fades, the chevron snaps'],
            ['`Stepper` (iOS)', 'the value rolls to the next one', 'cross-fades'],
          ]}
        />
        <P>
          {
            'The system controls, sheets and navigation transitions follow the setting themselves. `KaraProvider reduceMotion` overrides it: `always` for an app with a setting of its own or a screenshot run, `never` to ignore it.'
          }
        </P>
      </Section>

      <Section id="your-motion" title="Your own animations">
        <P>
          {
            '`useReducedMotion()` says whether motion is reduced, by the device or by the provider. Time an animation with the [duration and easing tokens](/docs/tokens#durations), picked by what the motion does: `fast` and `smoothOut` for something arriving, `quick` for it leaving. Pass `ReduceMotion.Never` once you have honoured the preference yourself, because Reanimated reads the setting only at launch and never hears of the provider’s.'
          }
        </P>
        <CodeBlock code={MOTION_USAGE} language="tsx" />
      </Section>
    </>
  ),
  headings: [
    {id: 'accessibility', label: 'Accessibility and motion'},
    {id: 'props', label: 'The props'},
    {id: 'defaults', label: 'What the components do'},
    {id: 'platforms', label: 'On each platform'},
    {id: 'motion', label: 'Reduce Motion'},
    {id: 'your-motion', label: 'Your own animations'},
  ],
  id: 'accessibility',
}
