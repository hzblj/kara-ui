import type {Meta, StoryObj} from '@storybook/react-native'
import {useArgs} from 'storybook/preview-api'

import {insideIsland} from '../../story-decorators'
import {Text} from '../text'
import {VStack} from '../v-stack'
import {ColorPicker} from './color-picker'
import type {ColorPickerProps} from './color-picker.types'

const ControlledColorPicker = (args: ColorPickerProps) => {
  const [, updateArgs] = useArgs<ColorPickerProps>()

  return (
    <VStack spacing="s8" wide>
      <ColorPicker {...args} onValueChange={value => updateArgs({value})} />
      <Text color="content.secondary" variant="footnote">
        selection · {args.value ?? 'none'}
      </Text>
    </VStack>
  )
}

const meta = {
  args: {label: 'Accent', value: '#f57c1f'},
  component: ColorPicker,
  decorators: [insideIsland],
  parameters: {
    notes:
      'SwiftUI’s `ColorPicker` on iOS. On Android, kara’s own Compose well and sheet in the iOS picker’s shape: a grid of swatches, a spectrum and RGB sliders, with an opacity slider when `supportsOpacity` is on.',
  },
  render: ControlledColorPicker,
  title: 'Atoms/ColorPicker',
} satisfies Meta<typeof ColorPicker>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithOpacity: Story = {args: {label: 'With opacity', supportsOpacity: true}}
