import type {Meta, StoryObj} from '@storybook/react-native'
import {useArgs} from 'storybook/preview-api'

import {insideIsland} from '../../utils/story-decorators'
import {VStack} from '../v-stack'
import {Switch} from './switch'
import type {SwitchProps} from './switch.types'

/**
 * `Switch` is controlled, so a story has to own the value — and it writes it back through `useArgs` rather
 * than local state, which is what keeps the Controls panel showing what is actually on screen.
 */
const ControlledSwitch = (args: SwitchProps) => {
  const [, updateArgs] = useArgs<SwitchProps>()

  return <Switch {...args} onValueChange={value => updateArgs({value})} />
}

const meta = {
  args: {label: 'Notifications', value: true},
  component: Switch,
  decorators: [insideIsland],
  render: ControlledSwitch,
  title: 'Atoms/Switch',
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithoutLabel: Story = {args: {label: undefined}}

export const Disabled: Story = {args: {disabled: true, label: 'Switch disabled'}}

export const States: Story = {
  render: () => (
    <VStack spacing="s12" wide>
      <Switch label="On" value />
      <Switch label="Off" value={false} />
      <Switch disabled label="Disabled on" value />
      <Switch disabled label="Disabled off" value={false} />
    </VStack>
  ),
}
