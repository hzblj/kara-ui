import type {Meta, StoryObj} from '@storybook/react-native'

import {Box} from '../box'
import {Image} from './image'

const PHOTO = {uri: 'https://picsum.photos/seed/kara-ui/480/320'}

const LANDSCAPE = {height: 160, width: '100%'} as const

const SQUARE = {height: 120, width: 120}

const meta = {
  args: {source: PHOTO, style: LANDSCAPE},
  argTypes: {contentFit: {control: 'radio', options: ['cover', 'contain', 'fill', 'none', 'scale-down']}},
  component: Image,
  parameters: {
    notes:
      '`expo-image` with the design system’s own 100ms linear fade already applied, so a loaded image never ' +
      'pops in. It needs the network — offline the frame stays empty, which is the component working as ' +
      'intended rather than a broken story.',
  },
  title: 'Atoms/Image',
} satisfies Meta<typeof Image>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Contain: Story = {args: {contentFit: 'contain'}}

export const Rounded: Story = {
  render: args => (
    <Box borderRadius="large" overflow="hidden" w={120}>
      <Image {...args} style={SQUARE} />
    </Box>
  ),
}
