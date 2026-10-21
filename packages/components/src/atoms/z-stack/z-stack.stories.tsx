import type {Meta, StoryObj} from '@storybook/react-native'

import {insideIsland} from '../../story-decorators'
import {Text} from '../text'
import {ZStack} from './z-stack'

const meta = {
  args: {align: 'center'},
  argTypes: {align: {control: 'radio', options: ['top', 'center', 'bottom']}},
  component: ZStack,
  decorators: [insideIsland],
  parameters: {notes: 'Layers its children on one another — the last child is drawn on top.'},
  title: 'Atoms/ZStack',
} satisfies Meta<typeof ZStack>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <ZStack {...args} bg="fill.accent.primary" borderRadius="medium" h={96} wide>
      <Text color="content.on.bg" variant="headingXs">
        over accent
      </Text>
    </ZStack>
  ),
}

export const Top: Story = {args: {align: 'top'}, render: Default.render}

export const Bottom: Story = {args: {align: 'bottom'}, render: Default.render}
