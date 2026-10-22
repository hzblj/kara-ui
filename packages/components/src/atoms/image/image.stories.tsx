import type {Meta, StoryObj} from '@storybook/react-native'

import {Image} from './image'

const PHOTO = {uri: 'https://picsum.photos/seed/kara-ui/480/320'}

const meta = {
  args: {h: 160, source: PHOTO, w: '100%'},
  argTypes: {contentFit: {control: 'radio', options: ['cover', 'contain', 'fill', 'none', 'scale-down']}},
  component: Image,
  parameters: {
    notes:
      '`expo-image` with the `sx` props and the design system’s own 100ms linear fade already applied, so a ' +
      'loaded image never pops in. It needs the network — offline the frame stays empty, which is the component ' +
      'working as intended rather than a broken story.',
  },
  title: 'Atoms/Image',
} satisfies Meta<typeof Image>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Contain: Story = {args: {contentFit: 'contain'}}

export const Rounded: Story = {args: {borderRadius: 'large', h: 120, w: 120}}
