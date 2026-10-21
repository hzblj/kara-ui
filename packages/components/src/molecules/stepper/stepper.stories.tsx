import type {Meta, StoryObj} from '@storybook/react-native'
import {useArgs} from 'storybook/preview-api'

import {insideIsland} from '../../story-decorators'
import {Stepper} from './stepper'
import type {StepperProps} from './stepper.types'

const ControlledStepper = (args: StepperProps) => {
  const [, updateArgs] = useArgs<StepperProps>()

  return <Stepper {...args} onValueChange={value => updateArgs({value})} />
}

const meta = {
  args: {label: 'Quantity', max: 5, min: 0, onValueChange: () => undefined, value: 2},
  component: Stepper,
  decorators: [insideIsland],
  render: ControlledStepper,
  title: 'Molecules/Stepper',
} satisfies Meta<typeof Stepper>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const AtMinimum: Story = {args: {value: 0}}

export const AtMaximum: Story = {args: {value: 5}}

export const Stepped: Story = {args: {label: 'Minutes', max: 60, min: 0, step: 15, value: 30}}
