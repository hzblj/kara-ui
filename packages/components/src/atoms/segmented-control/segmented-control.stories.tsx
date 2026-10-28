import type {Meta, StoryObj} from '@storybook/react-native'
import {useArgs} from 'storybook/preview-api'

import {Island} from '../island'
import {TextField} from '../text-field'
import {VStack} from '../v-stack'
import {SegmentedControl} from './segmented-control'
import type {SegmentedControlProps, SegmentedControlSegment} from './segmented-control.types'

const ControlledSegmentedControl = (args: SegmentedControlProps) => {
  const [, updateArgs] = useArgs<SegmentedControlProps>()

  return <SegmentedControl {...args} onChange={selectedIndex => updateArgs({selectedIndex})} />
}

// Made-up carriers' logos as SVG data URIs: what an app would get from its API as URLs, drawn in their own colours.
const svg = (body: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 24">${body}</svg>`)}`

const CARRIERS: SegmentedControlSegment[] = [
  {
    image: {
      uri: svg(
        '<rect x="2" y="3" width="44" height="18" rx="5" fill="#FF6A00"/><path d="M14 9h20v6H14z" fill="#fff"/>'
      ),
    },
    label: 'Parcel box',
  },
  {
    image: {uri: svg('<circle cx="17" cy="12" r="8" fill="#1F6FEB"/><circle cx="31" cy="12" r="8" fill="#FFC300"/>')},
    label: 'Post',
  },
  {image: {uri: svg('<path d="M6 19 18 5h8L14 19zM22 19 34 5h8L30 19z" fill="#12A37F"/>')}, label: 'Courier'},
]

const NOTE = 'Ring twice, the bell is quiet.\nIf nobody answers, leave it with the neighbours at number 12.'

const SegmentedControlInIsland = (args: SegmentedControlProps) => {
  const [, updateArgs] = useArgs<SegmentedControlProps>()

  return (
    <Island>
      <VStack spacing="s12" wide>
        <TextField defaultValue={NOTE} label="Note for the courier" multiline />
        <SegmentedControl {...args} onChange={selectedIndex => updateArgs({selectedIndex})} />
      </VStack>
    </Island>
  )
}

const meta = {
  args: {selectedIndex: 0, values: ['Day', 'Week', 'Month']},
  component: SegmentedControl,
  parameters: {
    notes:
      "kara's own `UISegmentedControl` on iOS, Material segmented buttons on Android, with the selected segment " +
      'in the accent on both. It needs no `Screen` or `Island`.',
  },
  render: ControlledSegmentedControl,
  title: 'Atoms/SegmentedControl',
} satisfies Meta<typeof SegmentedControl>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const TwoSegments: Story = {args: {values: ['Light', 'Dark']}}

export const Disabled: Story = {args: {disabled: true}}

export const Icons: Story = {
  args: {
    values: [
      {icon: 'grid', label: 'Grid'},
      {icon: 'star', label: 'Saved'},
      {icon: 'heart', label: 'Liked'},
    ],
  },
  parameters: {
    notes:
      'An icon leads its label in the label’s colour. iOS draws the two as one image, as a UIKit segment shows a title ' +
      'or an image; Android puts Material’s icon before the text.',
  },
}

export const Images: Story = {
  args: {values: CARRIERS},
  parameters: {
    notes:
      'An image replaces the label in its own colours, loaded natively (SDWebImage on iOS, androidsvg on Android), ' +
      'raster or SVG. The label stays what screen readers say and is shown if the image cannot be loaded.',
  },
}

export const Spacing: Story = {
  args: {
    iconSize: 's24',
    spacing: 's12',
    values: [
      {icon: 'grid', label: 'Grid'},
      {icon: 'star', label: 'Saved'},
    ],
  },
  parameters: {
    notes: '`spacing` adds space above and below the content, and `iconSize` sets the icons’ and images’ height.',
  },
}

export const Track: Story = {
  args: {
    bg: 'surface.primary',
    iconSize: 's24',
    p: 's4',
    spacing: 's10',
    values: CARRIERS.concat({label: 'All'}),
    variant: 'body',
  },
  parameters: {
    notes:
      '`bg` colours the track and `p` is the room around the pill, the `sx` names: on iOS kara draws the track itself, ' +
      'a capsule in exactly that colour under the system pill, and grows it by `p`. `variant` sets the labels like ' +
      '`Text`. Android fills the unselected segments with `bg`.',
  },
}

export const InsideAnIsland: Story = {
  args: {values: ['Door', 'Locker', 'Pickup']},
  parameters: {
    notes:
      'On its own the control needs no host. Inside a `Screen` or `Island` it joins that host instead, so it ' +
      'shares a stack with other native views, a multiline `TextField` here.',
  },
  render: SegmentedControlInIsland,
}
