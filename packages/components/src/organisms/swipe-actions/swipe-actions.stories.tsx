import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {List} from '../../atoms/list'
import {ListItem} from '../../molecules/list-item'
import {insideIsland} from '../../story-decorators'
import {SwipeActions} from './swipe-actions'

/** `children` is `null` here on purpose — see `list.stories.tsx`; the rows come from the render. */
const meta = {
  args: {children: null},
  component: SwipeActions,
  decorators: [insideIsland],
  parameters: {
    notes:
      "SwiftUI's `swipeActions` on iOS; on Android kara's own anchored drag, the buttons in the strip the row leaves. " +
      'One row is open at a time, and a tap on an open row closes it. It belongs inside a `List`.',
  },
  title: 'Organisms/SwipeActions',
} satisfies Meta<typeof SwipeActions>

export default meta

type Story = StoryObj<typeof meta>

export const TrailingEdge: Story = {
  render: args => (
    <List>
      <SwipeActions
        {...args}
        trailing={[
          {destructive: true, icon: 'trash', label: 'Delete', onPress: fn()},
          {icon: 'share', label: 'Share', onPress: fn()},
        ]}
      >
        <ListItem subtitle="Swipe toward the leading edge" title="Swipe me" />
      </SwipeActions>
    </List>
  ),
}

export const BothEdges: Story = {
  render: () => (
    <List>
      <SwipeActions
        leading={[{icon: 'star', label: 'Pin', onPress: fn()}]}
        trailing={[{destructive: true, icon: 'trash', label: 'Delete', onPress: fn()}]}
      >
        <ListItem subtitle="Either way" title="Swipe me" />
      </SwipeActions>
      <SwipeActions allowsFullSwipe={false} trailing={[{icon: 'heart', label: 'Save', onPress: fn()}]}>
        <ListItem subtitle="No full swipe on iOS" title="Swipe me too" />
      </SwipeActions>
    </List>
  ),
}
