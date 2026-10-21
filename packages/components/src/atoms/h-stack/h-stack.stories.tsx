import type {Meta, StoryObj} from '@storybook/react-native'

import {insideIsland} from '../../story-decorators'
import {Icon} from '../icon'
import {Spacer} from '../spacer'
import {Text} from '../text'
import {HStack} from './h-stack'

const meta = {
  args: {spacing: 's8'},
  argTypes: {
    align: {control: 'radio', options: ['start', 'center', 'end']},
    spacing: {control: 'select', options: ['s0', 's4', 's8', 's16', 's24', 's32']},
  },
  component: HStack,
  decorators: [insideIsland],
  title: 'Atoms/HStack',
} satisfies Meta<typeof HStack>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <HStack {...args} bg="surface.primary" borderRadius="medium" p="s12" wide>
      <Text variant="label">one</Text>
      <Text variant="label">two</Text>
      <Text variant="label">three</Text>
    </HStack>
  ),
}

export const SpacedApart: Story = {
  render: args => (
    <HStack {...args} align="center" bg="surface.primary" borderRadius="medium" p="s12" wide>
      <Text variant="label">leading</Text>
      <Spacer />
      <Icon color="content.tertiary" name="chevronRight" size="s16" />
    </HStack>
  ),
}

export const Centered: Story = {args: {align: 'center'}, render: Default.render}
