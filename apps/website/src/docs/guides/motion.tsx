import {CodeBlock} from '../../ui/code-block'
import {PropsTable} from '../components/props-table'
import type {Guide} from './guide'
import {Callout, Hero, List, P, Section, Table} from './parts'

const PRESETS_USAGE = `<Box entering="fadeUp" exiting="fade">
  <OrderShipped />
</Box>

// A preset adjusted: every field a token, but the delay
<Box entering={{preset: 'scale', duration: 'slow', delay: 120}} />

// On a spring: a pop that overshoots and settles
<Box entering={{preset: 'scale', spring: 'bouncy'}} />

// Reanimated's own, as it is
<Box entering={FadeInLeft.springify()} />`

const ANIMATE_USAGE = `<Pressable
  animate
  bg={selected ? 'fill.accent.base' : 'surface.primary'}
  borderColor={selected ? 'content.accent' : 'border.tertiary'}
  borderWidth={1}
  onPress={pick}
/>

<Box animate="slow" offsetY={open ? 0 : 8} opacity={open ? 'o100' : 'o0'} />

// A spring token runs the change on that spring
<Box animate="snappy" scale={liked ? 1.1 : 1} />

// Sizes go through layout on every frame, so they animate only when named
<Box animate={{keys: ['h', 'opacity']}} h={expanded ? 240 : 96} />`

const LAYOUT_USAGE = `<Box layout>{/* into place on the smooth spring when a sibling comes or goes */}</Box>
<Box layout="bouncy" />
<Box layout={{duration: 'slow', easing: 'inOut'}} />

<Stagger exiting="scale" gap="s8" layout row wrap>
  {tags.map(tag => <Tag key={tag.id} tag={tag} />)}
</Stagger>
<Box layout>{/* what sits below follows */}</Box>`

const SPRINGS_USAGE = `import {spring, timing} from '@hzblj/kara-ui'

offset.value = withSpring(0, spring('smooth')) // let go of a drag
pressed.value = withSpring(1, spring('interactive')) // under a finger
progress.value = withTiming(1, timing('fast')) // arriving, on smoothOut`

const NATIVE_USAGE = `<Island>
  <HStack
    animate="snappy"
    bg={saved ? 'fill.accent.base' : 'surface.primary'}
    onPress={toggle}
    p="s16"
    scale={saved ? 1 : 0.97}
  >
    <Text>{saved ? 'Saved for later' : 'Save for later'}</Text>
  </HStack>
</Island>`

const STAGGER_USAGE = `<Stagger gap="s8">
  {lines.map(line => (
    <Box bg="surface.primary" borderRadius="medium" key={line.id} p="s16">
      <RnText>{line.title}</RnText>
    </Box>
  ))}
</Stagger>

<Stagger entering="scale" from="end" interval="micro">{sizes}</Stagger>`

const REANIMATED_USAGE = `import {Box, timing, useEntering} from '@hzblj/kara-ui'
import {useEffect} from 'react'
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'

const Progress = ({value}: {value: number}) => {
  const fill = useSharedValue(value)

  useEffect(() => {
    fill.value = withTiming(value, timing('fast'))
  }, [fill, value])

  const style = useAnimatedStyle(() => ({transform: [{scaleX: fill.value}]}))

  // An animated style makes the Box an Animated.View by itself
  return <Box bg="fill.accent.primary" h={4} style={style} />
}

// kara's presets on a Reanimated view of your own
const Photo = () => <Animated.Image entering={useEntering('fade')} source={photo} />`

export const motion: Guide = {
  Content: () => (
    <>
      <Hero id="motion" kicker="Core concepts" title="Motion">
        <P>
          {
            'Every `sx` view moves the same way: `Box`, `RnText`, `Pressable` and `Image` take `entering`, `exiting`, `layout` and `animate`, timed by the [motion tokens](/docs/tokens#durations) and [springs](/docs/tokens#springs) and reduced with the user’s setting. Any of them makes the view a Reanimated one by itself, so there is no animated twin to import; without them it stays a plain view and costs nothing more. The native views take `animate` as well, run by SwiftUI and Compose.'
          }
        </P>
      </Hero>

      <Section id="presets" title="Arriving and leaving">
        <P>
          {
            '`entering` plays when the view mounts, `exiting` when it is the one removed. A preset is named by the way the view moves, both ways: `fadeUp` rises into place and floats away upward. Arriving takes `fast`, leaving `quick`, both on `smoothOut`.'
          }
        </P>
        <Table
          columns={['Preset', 'Arriving', 'Leaving']}
          rows={[
            ['`fade`', 'fades in', 'fades out'],
            ['`fadeUp`', 'rises 12 pt into place', 'floats 12 pt upward'],
            ['`fadeDown`', 'settles 12 pt from above', 'sinks 12 pt'],
            ['`scale`', 'grows from 92 %', 'shrinks to 92 %'],
          ]}
        />
        <CodeBlock code={PRESETS_USAGE} language="tsx" />
        <P>
          {
            'A preset adjusted takes `duration`, `easing` and `distance` as tokens and `delay` in milliseconds, or a `spring` token instead of the duration and the curve. Every view asking for the same one shares a single worklet. Reanimated’s own builders, keyframes and worklets pass through untouched.'
          }
        </P>
      </Section>

      <Section id="animate" title="Animating a change">
        <P>
          {
            '`animate` carries every change of the keys it covers over to the new value instead of jumping: change `bg`, `opacity` or `offsetY` and the view moves there, on the UI thread, through Reanimated’s CSS transitions. Nothing runs in JavaScript while it moves. `true` takes `fast` on `smoothOut`; a duration token, a spring token or a config picks another timing. A spring runs as the curve it draws, sampled into CSS `linear()`.'
          }
        </P>
        <CodeBlock code={ANIMATE_USAGE} language="tsx" />
        <List
          items={[
            'Unless told otherwise it animates the colours (`bg`, `borderColor`), `opacity` and the transform (`offsetX`, `offsetY`, `rotate`, `scale`): what the compositor moves without laying anything out.',
            'Sizes (`w`, `h`, the minima and maxima), `borderRadius`, `borderWidth` and `blur` animate when `keys` names them.',
            'Write both ends: `offsetY={open ? 0 : 8}` rather than leaving it out when open, so there is a value to go back to.',
            'On iOS most colours are UIKit’s own, which Reanimated cannot interpolate. kara asks UIKit for the colour it draws in the current appearance and transitions between those, so a selected row blends on both platforms.',
          ]}
        />
      </Section>

      <Section id="layout" title="Making room">
        <P>
          {
            '`layout` moves the view to its new place and size when the layout around it changes: a chip removed before it, a sibling growing. `true` is the `smooth` spring, which keeps its speed when another change arrives halfway; a spring token, a timed config or Reanimated’s own transition picks another. Only views with `layout` move, so give what sits after a changing list `layout` too, or it jumps while the list glides.'
          }
        </P>
        <CodeBlock code={LAYOUT_USAGE} language="tsx" />
      </Section>

      <Section id="springs" title="Springs">
        <P>
          {
            'What a finger drives moves on a spring, and so does anything that should keep its speed when interrupted: a press let go halfway eases back instead of turning on the spot. kara has [four of them](/docs/tokens#springs), SwiftUI’s set, and each is one curve everywhere it runs. `spring(name)` is the token as `withSpring`’s config, `timing(size, curve)` a duration token as `withTiming`’s; both leave Reanimated’s own Reduce Motion check off, because kara has honoured the setting already.'
          }
        </P>
        <CodeBlock code={SPRINGS_USAGE} language="tsx" />
        <Callout>
          {
            '`Pressable` presses on springs: down on `interactive`, back on `smooth`, neither with a bounce. Keep `bouncy` for an emphasised moment, never for a control.'
          }
        </Callout>
      </Section>

      <Section id="native" title="On native views">
        <P>
          {
            'The stacks, `Surface`, `Card`, `Text` and every native view with an `sx` take `animate` too, run by the platform: SwiftUI’s `.animation(_:value:)` on iOS, and on Android animated `graphicsLayer` values, a `background` with an animation spec, and `animateContentSize` for sizes. The same token is the same spring on both. `smoothOut` is SwiftUI’s `.smooth` spring and its Compose twin, since neither takes a bézier from `@expo/ui`; the other curves map to the nearest platform timing.'
          }
        </P>
        <CodeBlock code={NATIVE_USAGE} language="tsx" />
        <List
          items={[
            'On iOS a change of any covered key animates everything that changes with it in that render, the frame and the background included.',
            'On Android the colours, the opacity and the transform animate, and the sizes when `keys` names them. A border colour, a radius and a blur change at once; a spring takes no delay.',
          ]}
        />
      </Section>

      <Section id="stagger" title="One after another">
        <P>
          {
            '[`Stagger`](/docs/components/stagger) plays its children’s `entering` one step apart, `stagger` (40 ms) by default. Only the children that arrive together take turns: the first ones, or the next page of a list. A single item added later arrives at once, not after everything above it. A `Box`, `RnText` or `Pressable` child takes the motion itself, with no view added around it.'
          }
        </P>
        <CodeBlock code={STAGGER_USAGE} language="tsx" />
      </Section>

      <Section id="reanimated" title="With Reanimated of your own">
        <P>
          {
            'An animated `style` from `useAnimatedStyle` makes a `Box` or an `RnText` an animated view too, as do `animatedProps`. For a Reanimated view of your own, `useEntering`, `useExiting` and `useLayoutTransition` hand over kara’s presets, reduced, and `timing(size, curve)` is a `withTiming` config from the tokens.'
          }
        </P>
        <CodeBlock code={REANIMATED_USAGE} language="tsx" />
        <Callout>
          {
            'A view picks Reanimated when it mounts and keeps it, because changing the component later would remount everything under it. One whose animated style or motion arrives after mount takes `animated` from the start; development builds warn when it is missing.'
          }
        </Callout>
      </Section>

      <Section id="reduce-motion" title="Reduce Motion">
        <Table
          columns={['', 'Motion', 'With motion reduced']}
          rows={[
            ['`entering`, `exiting`', 'the preset', 'every preset fades'],
            [
              '`animate`',
              'colours, opacity and the transform',
              'the colours and the opacity blend; the rest arrives at once',
            ],
            ['`layout`', 'moves into place on a spring', 'snaps'],
            ['`Stagger`', 'one after another', 'fades, one after another'],
          ]}
        />
        <P>
          {
            'The setting is followed live, and `KaraProvider reduceMotion` overrides it, as for every component. Reanimated builders of your own follow the device’s setting themselves.'
          }
        </P>
      </Section>

      <Section id="props" title="The props">
        <PropsTable name="MotionProps" />
      </Section>
    </>
  ),
  headings: [
    {id: 'motion', label: 'Motion'},
    {id: 'presets', label: 'Arriving and leaving'},
    {id: 'animate', label: 'Animating a change'},
    {id: 'layout', label: 'Making room'},
    {id: 'springs', label: 'Springs'},
    {id: 'native', label: 'On native views'},
    {id: 'stagger', label: 'One after another'},
    {id: 'reanimated', label: 'With Reanimated of your own'},
    {id: 'reduce-motion', label: 'Reduce Motion'},
    {id: 'props', label: 'The props'},
  ],
  id: 'motion',
}
