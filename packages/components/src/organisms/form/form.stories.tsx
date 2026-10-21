import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {Switch} from '../../atoms/switch'
import {TextField} from '../../atoms/text-field'
import {insideIslandOfHeight} from '../../story-decorators'
import {Form} from './form'

/** `children` is `null` here on purpose — see `list.stories.tsx`; the sections come from the render. */
const meta = {
  args: {children: null},
  component: Form,
  decorators: [insideIslandOfHeight(420)],
  parameters: {
    notes: 'The grouped settings layout: a SwiftUI `Form` of `Section`s on iOS, a column of Material cards on Android.',
  },
  title: 'Organisms/Form',
} satisfies Meta<typeof Form>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <Form {...args}>
      <Form.Section footer="Sections are native on iOS and Cards on Android." title="Preferences">
        <Switch label="Notifications" onValueChange={fn()} value />
        <Switch label="Analytics" onValueChange={fn()} value={false} />
      </Form.Section>
      <Form.Section title="Account">
        <TextField label="Display name" />
      </Form.Section>
    </Form>
  ),
}

export const SingleSection: Story = {
  render: args => (
    <Form {...args}>
      <Form.Section title="Account">
        <TextField label="Display name" />
        <TextField label="Email" />
      </Form.Section>
    </Form>
  ),
}
