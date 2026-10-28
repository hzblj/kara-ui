import {type TextVariant, textStyles} from '@hzblj/kara-theme'
import type {Meta, StoryObj} from '@storybook/react-native'
import {useEffect, useState} from 'react'

import {insideIsland} from '../../utils/story-decorators'
import {VStack} from '../v-stack'
import {Text} from './text'

const VARIANTS = Object.keys(textStyles) as TextVariant[]

const SAMPLE = 'The quick brown fox jumps over the lazy dog'

const meta = {
  args: {children: SAMPLE},
  argTypes: {
    align: {control: 'radio', options: ['left', 'center', 'right']},
    color: {
      control: 'select',
      options: [
        'content.primary',
        'content.secondary',
        'content.tertiary',
        'content.accent',
        'content.destructive',
        'content.success',
      ],
    },
    decoration: {control: 'radio', options: ['none', 'underline', 'strikethrough']},
    monospaced: {control: 'boolean'},
    monospacedDigit: {control: 'boolean'},
    transform: {control: 'radio', options: ['uppercase', 'lowercase']},
    truncation: {control: 'radio', options: ['head', 'middle', 'tail']},
    variant: {control: 'select', options: VARIANTS},
  },
  component: Text,
  decorators: [insideIsland],
  parameters: {
    notes:
      'A native `SwiftUI.Text` / Compose `Text`, not a styled RN one. Sizes stay exact while the variant picks ' +
      'the rate Dynamic Type grows it at, so the same story looks different once the OS text size moves.',
  },
  title: 'Atoms/Text',
} satisfies Meta<typeof Text>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: () => (
    <VStack bg="surface.primary" borderRadius="medium" p="s12" spacing="s2" wide>
      {VARIANTS.map(variant => (
        <Text key={variant} variant={variant}>
          {variant}
        </Text>
      ))}
    </VStack>
  ),
}

export const Colors: Story = {
  render: () => (
    <VStack spacing="s4" wide>
      <Text color="content.primary">content.primary</Text>
      <Text color="content.secondary">content.secondary</Text>
      <Text color="content.tertiary">content.tertiary</Text>
      <Text color="content.accent">content.accent</Text>
      <Text color="content.destructive">content.destructive</Text>
      <Text color="content.success">content.success</Text>
    </VStack>
  ),
}

export const Alignment: Story = {
  render: () => (
    <VStack spacing="s4" wide>
      <Text align="left">align left</Text>
      <Text align="center">align center</Text>
      <Text align="right">align right</Text>
    </VStack>
  ),
}

export const TransformAndDecoration: Story = {
  render: () => (
    <VStack spacing="s4" wide>
      <Text transform="uppercase">transform uppercase</Text>
      <Text transform="lowercase">TRANSFORM LOWERCASE</Text>
      <Text decoration="underline">decoration underline</Text>
      <Text decoration="strikethrough">decoration strikethrough</Text>
    </VStack>
  ),
}

export const Truncated: Story = {
  args: {numberOfLines: 1},
}

const PATH = 'Projects/kara-ui/apps/example/src/catalog/demos/selection.tsx'

export const Truncation: Story = {
  parameters: {
    notes:
      'Where the ellipsis goes in a text cut short: the tail by default, the head to keep the end, the middle to keep ' +
      'both ends of a path or a file name. SwiftUI’s `truncationMode` on iOS. Android puts it at the head or in the ' +
      'middle of a single line only, as Compose does, drawn by kara’s own Compose text; a longer text ends at the tail.',
  },
  render: () => (
    <VStack align="start" spacing="s8" wide>
      <Text numberOfLines={1}>{PATH}</Text>
      <Text numberOfLines={1} truncation="middle">
        {PATH}
      </Text>
      <Text numberOfLines={1} truncation="head">
        {PATH}
      </Text>
    </VStack>
  ),
}

export const Monospaced: Story = {
  parameters: {
    notes:
      '`monospaced` sets the theme’s fixed-width face (`fonts.mono`, else Menlo on iOS and `monospace` on Android) at ' +
      'the variant’s size. `monospacedDigit` keeps the face and gives its digits one width, so the prices line up. ' +
      'Android draws a `monospacedDigit` text with kara’s own Compose text, since `@expo/ui`’s sets no font features.',
  },
  render: () => (
    <VStack align="start" spacing="s12" wide>
      <Text monospaced variant="footnote">
        npx expo install @hzblj/kara-ui
      </Text>
      <VStack align="start" spacing="s2">
        <Text>£1,118.40 proportional</Text>
        <Text>£911.11 proportional</Text>
      </VStack>
      <VStack align="start" spacing="s2">
        <Text monospacedDigit>£1,118.40 tabular</Text>
        <Text monospacedDigit>£911.11 tabular</Text>
      </VStack>
    </VStack>
  ),
}

export const Spans: Story = {
  render: () => (
    <Text variant="headline">
      Box, box. <Text color="content.accent">Box this lap</Text>, we are{' '}
      <Text color="content.tertiary">going to plan B.</Text>
    </Text>
  ),
}

const WORDS = 'Box box, box this lap. We are going to plan B, the tyres are gone.'.split(' ')

/** Lit word by word, as a transcript is while its audio plays: each span eases to its colour. */
const Karaoke = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setIndex(current => (current + 1) % (WORDS.length + 1)), 420)
    return () => clearInterval(timer)
  }, [])

  return (
    <Text animate color="content.tertiary" variant="headline">
      {WORDS.map((word, position) => (
        <Text
          color={position < index ? 'content.primary' : position === index ? 'content.accent' : 'content.tertiary'}
          key={word + String(position)}
        >
          {`${word} `}
        </Text>
      ))}
    </Text>
  )
}

export const AnimatedSpans: Story = {
  parameters: {
    notes:
      'With `animate`, a span that changes colour eases there on the motion tokens (`fast`, `smoothOut` by default): ' +
      'SwiftUI interpolates the text, Compose animates each span. Colours keep easing with Reduce Motion on.',
  },
  render: () => <Karaoke />,
}
