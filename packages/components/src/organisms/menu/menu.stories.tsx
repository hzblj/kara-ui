import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {insideIsland} from '../../story-decorators'
import {Menu} from './menu'
import type {MenuAction} from './menu.types'

const DEMO_ACTIONS: MenuAction[] = [
  {icon: 'share', label: 'Share', onPress: fn()},
  {icon: 'star', label: 'Favourite', onPress: fn()},
  {destructive: true, icon: 'trash', label: 'Delete', onPress: fn()},
]

const SHARE_ONLY: MenuAction[] = [{icon: 'share', label: 'Share', onPress: fn()}]

const meta = {
  args: {actions: DEMO_ACTIONS, label: 'Open menu'},
  component: Menu,
  decorators: [insideIsland],
  parameters: {
    notes:
      'A SwiftUI `Menu` / Material dropdown, opened by its own label. For the long-press variant on arbitrary content, use `ContextMenu`.',
  },
  title: 'Organisms/Menu',
} satisfies Meta<typeof Menu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SingleAction: Story = {args: {actions: SHARE_ONLY, label: 'Share'}}
