import type {Meta, StoryObj} from '@storybook/react-native'
import {useArgs} from 'storybook/preview-api'

import {Box} from '../box'
import {RnText} from '../rn-text'
import {DatePicker} from './date-picker'
import type {DatePickerProps} from './date-picker.types'

const ControlledDatePicker = (args: DatePickerProps) => {
  const [, updateArgs] = useArgs<DatePickerProps>()

  return (
    <Box gap="s8">
      <Box bg="surface.primary" borderRadius="medium" p="s12">
        <DatePicker {...args} onValueChange={value => updateArgs({value})} />
      </Box>
      <RnText color="content.secondary" variant="footnote">
        {args.value.toISOString()}
      </RnText>
    </Box>
  )
}

const meta = {
  args: {value: new Date(2027, 0, 1, 9, 30)},
  argTypes: {mode: {control: 'radio', options: ['date', 'time', 'datetime']}},
  component: DatePicker,
  render: ControlledDatePicker,
  title: 'Atoms/DatePicker',
} satisfies Meta<typeof DatePicker>

export default meta

type Story = StoryObj<typeof meta>

export const Date_: Story = {args: {mode: 'date'}, name: 'Date'}

export const Time: Story = {args: {mode: 'time'}}

export const DateTime: Story = {args: {mode: 'datetime'}}

export const Bounded: Story = {
  args: {max: new Date(2027, 11, 31), min: new Date(2027, 0, 1), mode: 'date'},
}
