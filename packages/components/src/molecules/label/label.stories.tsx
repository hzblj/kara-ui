import type {Meta, StoryObj} from '@storybook/react-native'

import {VStack} from '../../atoms/v-stack'
import {insideIsland} from '../../utils/story-decorators'
import {Label} from './label'

const meta = {
  args: {icon: 'home', title: 'Home'},
  argTypes: {
    color: {control: 'select', options: ['content.primary', 'content.accent', 'content.destructive']},
    icon: {control: 'select', options: ['home', 'star', 'trash', 'settings', 'notification']},
    iconSize: {control: 'select', options: ['s12', 's16', 's20', 's24']},
  },
  component: Label,
  decorators: [insideIsland],
  parameters: {
    notes:
      'An inline icon + text pair: what goes inside a button, a menu row or a section header. For a full tappable row with a subtitle and a chevron, use `ListItem`.',
  },
  title: 'Molecules/Label',
} satisfies Meta<typeof Label>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: () => (
    <VStack bg="surface.primary" borderRadius="medium" p="s12" spacing="s8" wide>
      <Label icon="home" title="Default body" />
      <Label color="content.accent" icon="star" title="Accent" variant="labelMedium" />
      <Label color="content.destructive" icon="trash" title="Destructive" variant="footnoteMedium" />
      <Label icon="settings" iconSize="s16" title="Small icon" variant="footnote" />
    </VStack>
  ),
}
