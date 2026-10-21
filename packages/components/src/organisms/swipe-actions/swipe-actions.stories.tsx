import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {Button} from '../../atoms/button'
import {Divider} from '../../atoms/divider'
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
      'iOS only. Compose ships no equivalent, so on Android the row renders exactly as it would without this ' +
      'wrapper and the buttons are dropped — degrading to the row rather than to nothing keeps the content on ' +
      'screen. It belongs inside a `List`.',
  },
  title: 'Organisms/SwipeActions',
} satisfies Meta<typeof SwipeActions>

export default meta

type Story = StoryObj<typeof meta>

export const TrailingEdge: Story = {
  render: args => (
    <List>
      <SwipeActions {...args}>
        <ListItem subtitle="Swipe from the trailing edge" title="Swipe me" />
        <SwipeActions.Actions>
          <Button label="Delete" onPress={fn()} variant="destructive" />
        </SwipeActions.Actions>
      </SwipeActions>
    </List>
  ),
}

export const BothEdges: Story = {
  render: () => (
    <List>
      <SwipeActions>
        <ListItem subtitle="Swipe from the trailing edge" title="Swipe me" />
        <SwipeActions.Actions>
          <Button label="Delete" onPress={fn()} variant="destructive" />
        </SwipeActions.Actions>
      </SwipeActions>
      <Divider />
      <SwipeActions>
        <ListItem subtitle="Leading edge, no full swipe" title="Swipe me too" />
        <SwipeActions.Actions allowsFullSwipe={false} edge="leading">
          <Button label="Pin" onPress={fn()} variant="secondary" />
        </SwipeActions.Actions>
      </SwipeActions>
    </List>
  ),
}
