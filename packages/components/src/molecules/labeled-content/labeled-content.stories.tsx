import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {Divider} from '../../atoms/divider'
import {Switch} from '../../atoms/switch'
import {VStack} from '../../atoms/v-stack'
import {insideIsland} from '../../utils/story-decorators'
import {LabeledContent} from './labeled-content'

const meta = {
  args: {label: 'Version', value: '0.0.1'},
  component: LabeledContent,
  decorators: [insideIsland],
  parameters: {notes: 'Pass `children` instead of `value` when the trailing side is a control rather than text.'},
  title: 'Molecules/LabeledContent',
} satisfies Meta<typeof LabeledContent>

export default meta

type Story = StoryObj<typeof meta>

export const Value: Story = {}

export const WithIcon: Story = {args: {icon: 'notification', label: 'Notifications', value: 'On'}}

export const Tappable: Story = {args: {label: 'Account', onPress: fn(), value: 'jan@example.com'}}

export const SettingsRows: Story = {
  render: () => (
    <VStack bg="surface.primary" borderRadius="medium" px="s12" wide>
      <LabeledContent label="Version" value="0.0.1" />
      <Divider />
      <LabeledContent icon="notification" label="Notifications" value="On" />
      <Divider />
      <LabeledContent label="Account" onPress={fn()} value="jan@example.com" />
      <Divider />
      <LabeledContent label="Analytics">
        <Switch onValueChange={fn()} value />
      </LabeledContent>
    </VStack>
  ),
}
