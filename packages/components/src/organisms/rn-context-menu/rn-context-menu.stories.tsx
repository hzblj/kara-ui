import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {Box} from '../../atoms/box'
import {Pressable} from '../../atoms/pressable'
import {RnText} from '../../atoms/rn-text'
import type {MenuAction} from '../menu'
import {RnContextMenu} from './rn-context-menu'

const ACTIONS: MenuAction[] = [
  {icon: 'share', label: 'Share', onPress: fn()},
  {icon: 'star', label: 'Favourite', onPress: fn()},
  {destructive: true, icon: 'trash', label: 'Delete', onPress: fn()},
]

const Card = () => (
  <Box bg="surface.primary" borderRadius="medium" gap="s8" p="s16">
    <RnText variant="headline">Long-press this card</RnText>
    <RnText color="content.secondary" variant="footnote">
      The button below is excluded — a long press there does not open the menu.
    </RnText>
    <RnContextMenu.Exclusion>
      <Pressable align="center" bg="fill.tertiary" borderRadius="full" onPress={fn()} py="s8">
        <RnText variant="labelMedium">Excluded button</RnText>
      </Pressable>
    </RnContextMenu.Exclusion>
  </Box>
)

const Preview = () => (
  <Box bg="surface.primary" gap="s8" p="s24" w={320}>
    <RnText variant="headingS">The card, larger</RnText>
    <RnText color="content.secondary">What iOS lifts while the menu is open. Tap it to commit.</RnText>
  </Box>
)

/** `children` and `preview` are elements, which never go in `args` — the renders build them. */
const meta = {
  args: {actions: ACTIONS, children: null, onPreviewPress: fn()},
  component: RnContextMenu,
  parameters: {
    notes:
      'A context menu on a React Native subtree. iOS: `UIContextMenuInteraction`, lifting the trigger — or `preview` ' +
      'when given, mounted only once a finger rests on the trigger — with `onPreviewPress` for a tap on it. ' +
      'Android: a Material dropdown under the trigger; no preview. `RnContextMenu.Exclusion` keeps a control inside ' +
      'the trigger from opening the menu.',
  },
  title: 'Organisms/RnContextMenu',
} satisfies Meta<typeof RnContextMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <RnContextMenu {...args}>
      <Card />
    </RnContextMenu>
  ),
}

export const WithPreview: Story = {
  render: args => (
    <RnContextMenu {...args} preview={<Preview />}>
      <Card />
    </RnContextMenu>
  ),
}
