import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {ListItem} from '../../molecules/list-item'
import {insideIslandOfHeight} from '../../story-decorators'
import {List} from './list'

const settle = () => new Promise<void>(resolve => setTimeout(resolve, 1200))

/**
 * `children` is declared here only because it is a required prop, and `null` is the one value that can
 * stand in — a React element in `args` is walked by Storybook when it serialises the Controls panel, and
 * that walk reaches React's own element internals. The rows come from `render` instead.
 */
const meta = {
  args: {children: null},
  component: List,
  // A list scrolls, so its island cannot size to it — on Android Compose throws on the infinite height.
  decorators: [insideIslandOfHeight(240)],
  parameters: {
    notes:
      'A native `List` / `LazyColumn`, so its rows must be native too. `onRefresh` is async by design: the ' +
      'spinner runs until the promise settles, which is what SwiftUI’s `refreshable` expects and what ' +
      'Compose’s controlled indicator is driven from — neither needs a `refreshing` flag kept in sync by hand.',
  },
  title: 'Atoms/List',
} satisfies Meta<typeof List>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <List {...args}>
      <ListItem icon="home" onPress={fn()} subtitle="With chevron" title="Tappable row" />
      <ListItem icon="settings" subtitle="No chevron" title="Plain row" />
      <ListItem title="Title only" />
    </List>
  ),
}

export const Refreshable: Story = {args: {onRefresh: settle}, render: Default.render}
