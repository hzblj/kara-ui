import type {Meta, StoryObj} from '@storybook/react-native'

import {insideIsland} from '../../story-decorators'
import {Text} from '../text'
import {VStack} from '../v-stack'
import {Card} from './card'

const meta = {
  component: Card,
  decorators: [insideIsland],
  parameters: {
    notes:
      'Carries `surface.primary`, the `card` shadow and a large radius on both platforms. Pass `sx` to override any of them.',
  },
  title: 'Atoms/Card',
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card>
      <VStack spacing="s4">
        <Text variant="headingXs">Card title</Text>
        <Text color="content.secondary" variant="footnote">
          surface.primary · shadow card · radius large
        </Text>
      </VStack>
    </Card>
  ),
}

export const Padded: Story = {
  render: () => (
    <Card p="s24">
      <Text variant="headingXs">p s24</Text>
    </Card>
  ),
}

export const Accent: Story = {
  render: () => (
    <Card bg="fill.accent.primary">
      <Text color="content.on.bg" variant="headingXs">
        bg fill.accent.primary
      </Text>
    </Card>
  ),
}
