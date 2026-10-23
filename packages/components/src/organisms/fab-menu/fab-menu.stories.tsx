import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {insideIslandOfHeight} from '../../story-decorators'
import type {MenuAction} from '../menu'
import {FabMenu} from './fab-menu'

const ACTIONS: MenuAction[] = [
  {icon: 'share', label: 'Share', onPress: fn()},
  {icon: 'star', label: 'Favourite', onPress: fn()},
  {destructive: true, icon: 'trash', label: 'Delete', onPress: fn()},
]

/**
 * A fixed-height island: on Android the menu fills its host and unfolds upward from the bottom end, so it needs the
 * room an open menu takes.
 */
const meta = {
  args: {actions: ACTIONS, icon: 'add'},
  argTypes: {icon: {control: 'select', options: ['add', 'more', 'share', 'settings']}},
  component: FabMenu,
  decorators: [insideIslandOfHeight(320)],
  parameters: {
    notes:
      "Android: Material 3 Expressive's FAB menu, where the button turns into a close and the actions rise above it " +
      'as labelled pills. iOS has no such control, so the same button is the label of a SwiftUI `Menu`, which opens ' +
      'its actions as a system menu. Destructive actions are marked on iOS only.',
  },
  title: 'Organisms/FabMenu',
} satisfies Meta<typeof FabMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
