import {type TextVariant, textStyles} from '@hzblj/kara-theme'
import type {Meta, StoryObj} from '@storybook/react-native'
import {useEffect, useState} from 'react'

import {insideIsland} from '../../story-decorators'
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
    transform: {control: 'radio', options: ['uppercase', 'lowercase']},
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
