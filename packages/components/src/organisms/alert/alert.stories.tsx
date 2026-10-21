import type {Meta, StoryObj} from '@storybook/react-native'
import {useArgs} from 'storybook/preview-api'
import {fn} from 'storybook/test'

import {HStack} from '../../atoms/h-stack'
import {Text} from '../../atoms/text'
import {VStack} from '../../atoms/v-stack'
import {insideIsland} from '../../story-decorators'
import {Alert} from './alert'
import type {AlertProps} from './alert.types'

const ControlledAlert = (args: AlertProps) => {
  const [, updateArgs] = useArgs<AlertProps>()

  return (
    <VStack spacing="s8" wide>
      <HStack onPress={() => updateArgs({visible: true})} py="s8" wide>
        <Text color="content.accent">Open alert</Text>
      </HStack>
      <Alert {...args} onDismiss={() => updateArgs({visible: false})} />
    </VStack>
  )
}

const meta = {
  args: {
    message: 'This maps to a SwiftUI alert and a Material `AlertDialog`.',
    onDismiss: () => undefined,
    title: 'Delete item?',
    visible: false,
  },
  component: Alert,
  decorators: [insideIsland],
  parameters: {
    notes:
      'A system modal, so it is drawn by the platform above everything — nothing about the story frame contains it.',
  },
  render: ControlledAlert,
  title: 'Organisms/Alert',
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Destructive: Story = {args: {confirmLabel: 'Delete', destructive: true, onConfirm: fn()}}

export const TitleOnly: Story = {args: {message: undefined, title: 'Are you sure?'}}

export const OpenOnMount: Story = {args: {visible: true}}
