import type {Meta, StoryObj} from '@storybook/react-native'
import {useState} from 'react'

import {Box} from '../box'
import {Pressable} from '../pressable'
import {RnText} from '../rn-text'
import {Stagger} from './stagger'
import type {StaggerProps} from './stagger.types'

const LINES = ['Linen shirt', 'Canvas tote', 'Wool socks, 2 pairs', 'Leather belt', 'Gift wrap']

const Replayed = (args: StaggerProps) => {
  const [round, setRound] = useState(0)

  return (
    <Box gap="s12">
      <Stagger {...args} key={round}>
        {LINES.map(line => (
          <Box bg="surface.primary" borderRadius="medium" key={line} px="s16" py="s12">
            <RnText variant="body">{line}</RnText>
          </Box>
        ))}
      </Stagger>
      <Pressable
        alignSelf="flex-start"
        bg="fill.tertiary"
        borderRadius="full"
        onPress={() => setRound(value => value + 1)}
        px="s16"
        py="s8"
      >
        <RnText variant="labelMedium">Play again</RnText>
      </Pressable>
    </Box>
  )
}

const meta = {
  args: {gap: 's8'},
  argTypes: {
    entering: {control: 'radio', options: ['fadeUp', 'fadeDown', 'fade', 'scale']},
    from: {control: 'radio', options: ['start', 'end']},
    interval: {control: 'radio', options: ['stagger', 'micro', 'quick']},
  },
  component: Stagger,
  parameters: {
    notes:
      'React Native tier: a `Box` whose children take turns arriving. A `Box`, `RnText` or `Pressable` child takes ' +
      'the motion itself; any other child is wrapped in a `Box`. Only children that arrive together take turns, so a ' +
      'single item added later appears at once. With Reduce Motion on, every child fades.',
  },
  render: Replayed,
  title: 'Atoms/Stagger',
} satisfies Meta<typeof Stagger>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FromTheEnd: Story = {args: {from: 'end'}}

export const Slower: Story = {args: {entering: {duration: 'slow', preset: 'fadeUp'}, interval: 'micro'}}
