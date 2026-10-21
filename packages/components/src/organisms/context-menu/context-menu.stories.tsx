import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {Surface} from '../../atoms/surface'
import {Text} from '../../atoms/text'
import {insideIsland} from '../../story-decorators'
import type {MenuAction} from '../menu'
import {ContextMenu} from './context-menu'

const ACTIONS: MenuAction[] = [
  {icon: 'share', label: 'Share', onPress: fn()},
  {icon: 'star', label: 'Favourite', onPress: fn()},
  {destructive: true, icon: 'trash', label: 'Delete', onPress: fn()},
]

/** `children` is `null` here on purpose — see `list.stories.tsx`; the target comes from the render. */
const meta = {
  args: {actions: ACTIONS, children: null},
  component: ContextMenu,
  decorators: [insideIsland],
  parameters: {
    notes: 'Opened by a long press on its child, and the platform lifts that child while the menu is up.',
  },
  title: 'Organisms/ContextMenu',
} satisfies Meta<typeof ContextMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <ContextMenu {...args}>
      <Surface bg="fill.tertiary" wide>
        <Text variant="labelMedium">Long-press me</Text>
      </Surface>
    </ContextMenu>
  ),
}
