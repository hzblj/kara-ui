import type {Meta, StoryObj} from '@storybook/react-native'
import {useArgs} from 'storybook/preview-api'
import {fn} from 'storybook/test'

import {Pressable} from '../../atoms/pressable'
import {RnText} from '../../atoms/rn-text'
import {Snackbar} from './snackbar'
import type {SnackbarProps} from './snackbar.types'

const ControlledSnackbar = (args: SnackbarProps) => {
  const [, updateArgs] = useArgs<SnackbarProps>()

  return (
    <>
      <Pressable
        align="center"
        bg="fill.tertiary"
        borderRadius="medium"
        onPress={() => updateArgs({visible: !args.visible})}
        p="s12"
        wide
      >
        <RnText variant="labelMedium">{args.visible ? 'Hide snackbar' : 'Show snackbar'}</RnText>
      </Pressable>
      <Snackbar {...args} />
    </>
  )
}

const meta = {
  args: {message: 'Item deleted', visible: false},
  component: Snackbar,
  parameters: {
    notes: 'React Native tier — an overlay drawn above the screen rather than a native control, so it needs no host.',
  },
  render: ControlledSnackbar,
  title: 'Organisms/Snackbar',
} satisfies Meta<typeof Snackbar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithAction: Story = {args: {actionLabel: 'Undo', onAction: fn()}}

export const OpenOnMount: Story = {args: {visible: true}}
