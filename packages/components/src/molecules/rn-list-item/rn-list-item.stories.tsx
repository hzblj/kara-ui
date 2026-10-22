import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {RnListItem} from './rn-list-item'

const meta = {
  args: {icon: 'user', onPress: fn(), subtitle: 'Name, email, password', title: 'Account'},
  component: RnListItem,
  parameters: {
    notes:
      'The React Native tier of `ListItem`: no host, so it is cheap to mount by the dozen. A ripple across the whole ' +
      'row on Android, a highlight on iOS. `px` pads it inside its press area.',
  },
  title: 'Molecules/RnListItem',
} satisfies Meta<typeof RnListItem>

export default meta

type Story = StoryObj<typeof meta>

export const Tappable: Story = {}

export const Padded: Story = {args: {px: 's16'}}

export const Plain: Story = {args: {icon: undefined, onPress: undefined, subtitle: undefined, title: 'Title only'}}
