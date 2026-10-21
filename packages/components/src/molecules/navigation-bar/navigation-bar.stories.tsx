import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {NavigationBar} from './navigation-bar'

const meta = {
  args: {onBack: fn(), onClose: fn(), title: 'Choose a size'},
  component: NavigationBar,
  parameters: {
    notes:
      'For a sheet that is not a navigation screen. iOS: a standalone `UINavigationBar`, so the back and close items ' +
      'are real bar items — on iOS 26 they share the bar glass instead of swelling like standalone glass buttons. ' +
      'Android: a Material row with a start-aligned title, in its own island. `backTestID`/`closeTestID` reach the ' +
      'iOS items only. An item shows when its handler is set.',
  },
  title: 'Molecules/NavigationBar',
} satisfies Meta<typeof NavigationBar>

export default meta

type Story = StoryObj<typeof meta>

export const BackAndClose: Story = {}

export const CloseOnly: Story = {args: {onBack: undefined}}

export const Untitled: Story = {args: {title: undefined}}
