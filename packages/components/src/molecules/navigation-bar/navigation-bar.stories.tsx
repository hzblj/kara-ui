import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {NavigationBar} from './navigation-bar'

const meta = {
  args: {
    leadingItems: [{onPress: fn(), type: 'back'}],
    title: 'Choose a size',
    trailingItems: [{onPress: fn(), type: 'close'}],
  },
  component: NavigationBar,
  parameters: {
    notes:
      'For a header that is not a navigation screen (`Sheet.Header` is built on it). iOS: a standalone ' +
      '`UINavigationBar`, so the items are real bar items; on iOS 26 neighbours share one glass capsule, and ' +
      '`separated` gives an item its own. Android: Material’s top app bar (`separated` has no counterpart there). ' +
      'Items go where they are put: a close works on either side. `search` replaces the title on iOS only.',
  },
  title: 'Molecules/NavigationBar',
} satisfies Meta<typeof NavigationBar>

export default meta

type Story = StoryObj<typeof meta>

export const BackAndClose: Story = {}

export const GroupedActions: Story = {
  args: {
    trailingItems: [
      {icon: 'share', label: 'Share', onPress: fn(), type: 'icon'},
      {icon: 'heart', label: 'Favourite', onPress: fn(), type: 'icon'},
      {onPress: fn(), separated: true, type: 'close'},
    ],
  },
}

export const CloseOnTheLeft: Story = {
  args: {leadingItems: [{onPress: fn(), type: 'close'}], titleAlignment: 'leading', trailingItems: undefined},
}

export const Untitled: Story = {args: {title: undefined}}

export const Search: Story = {
  args: {search: {onChangeText: fn(), placeholder: 'Search'}, title: undefined},
  parameters: {notes: 'iOS: a `UISearchBar` in place of the title. Android keeps the bar without it.'},
}
