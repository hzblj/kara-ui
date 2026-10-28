import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {List} from '../../atoms/list'
import {insideIsland} from '../../utils/story-decorators'
import {ListItem} from './list-item'

const meta = {
  args: {title: 'Tappable row'},
  argTypes: {icon: {control: 'select', options: ['home', 'settings', 'star', 'notification', 'user']}},
  component: ListItem,
  decorators: [insideIsland],
  parameters: {notes: 'Passing `onPress` is what earns the row its chevron; a row without one stays plain.'},
  title: 'Molecules/ListItem',
} satisfies Meta<typeof ListItem>

export default meta

type Story = StoryObj<typeof meta>

export const TitleOnly: Story = {args: {title: 'Title only'}}

export const WithSubtitle: Story = {args: {subtitle: 'And a subtitle', title: 'Two lines'}}

export const Tappable: Story = {args: {icon: 'home', onPress: fn(), subtitle: 'With chevron', title: 'Tappable row'}}

export const InAList: Story = {
  render: () => (
    <List>
      <ListItem icon="home" onPress={fn()} subtitle="With chevron" title="Tappable row" />
      <ListItem icon="settings" subtitle="No chevron" title="Plain row" />
      <ListItem title="Title only" />
    </List>
  ),
}
