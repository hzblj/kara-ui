import type {Meta, StoryObj} from '@storybook/react-native'

import {insideIsland} from '../../utils/story-decorators'
import {Text} from '../text'
import {VStack} from '../v-stack'
import {Surface} from './surface'

const meta = {
  component: Surface,
  decorators: [insideIsland],
  parameters: {
    notes:
      '`glass` reaches for the iOS 26 `glassEffect` and a Material 3 tonal surface on Android. The two do not look alike, and are not meant to.',
  },
  title: 'Atoms/Surface',
} satisfies Meta<typeof Surface>

export default meta

type Story = StoryObj<typeof meta>

export const Plain: Story = {
  render: () => (
    <Surface wide>
      <Text variant="labelMedium">Surface plain</Text>
    </Surface>
  ),
}

export const Glass: Story = {
  render: () => (
    <Surface bg="fill.accent.base" glass wide>
      <Text variant="labelMedium">Surface glass</Text>
    </Surface>
  ),
}

export const Both: Story = {
  render: () => (
    <VStack spacing="s12" wide>
      <Surface wide>
        <Text variant="labelMedium">plain</Text>
      </Surface>
      <Surface bg="fill.accent.base" glass wide>
        <Text variant="labelMedium">glass</Text>
      </Surface>
    </VStack>
  ),
}
