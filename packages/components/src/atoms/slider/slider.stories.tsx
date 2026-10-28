import type {Meta, StoryObj} from '@storybook/react-native'
import {useState} from 'react'
import {useArgs} from 'storybook/preview-api'

import {insideIsland} from '../../utils/story-decorators'
import {Text} from '../text'
import {VStack} from '../v-stack'
import {Slider} from './slider'
import type {SliderProps} from './slider.types'

const ControlledSlider = (args: SliderProps) => {
  const [, updateArgs] = useArgs<SliderProps>()

  return (
    <VStack spacing="s8" wide>
      <Slider {...args} onValueChange={value => updateArgs({value})} />
      <Text color="content.secondary" variant="footnote">
        value {args.value.toFixed(2)}
      </Text>
    </VStack>
  )
}

/** A seek bar: the position follows the thumb, the player seeks once the finger lifts. */
const SeekSlider = (args: SliderProps) => {
  const [, updateArgs] = useArgs<SliderProps>()
  const [committed, setCommitted] = useState(args.value)

  return (
    <VStack spacing="s8" wide>
      <Slider {...args} onValueChange={value => updateArgs({value})} onValueChangeEnd={setCommitted} />
      <Text color="content.secondary" variant="footnote">
        position {args.value.toFixed(2)} · seeked to {committed.toFixed(2)}
      </Text>
    </VStack>
  )
}

const meta = {
  args: {value: 0.4},
  argTypes: {value: {control: {max: 1, min: 0, step: 0.01, type: 'range'}}},
  component: Slider,
  decorators: [insideIsland],
  render: ControlledSlider,
  title: 'Atoms/Slider',
} satisfies Meta<typeof Slider>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Stepped: Story = {args: {max: 10, min: 0, step: 1, value: 4}}

export const Disabled: Story = {args: {disabled: true, value: 0.7}}

export const CommitOnRelease: Story = {
  parameters: {
    notes:
      '`onValueChange` follows the thumb; `onValueChangeEnd` comes once, with the final value, when the finger lifts: ' +
      'where a seek or a volume commits. SwiftUI’s `onEditingChanged` on iOS, Material’s `onValueChangeFinished` on ' +
      'Android.',
  },
  render: SeekSlider,
}
