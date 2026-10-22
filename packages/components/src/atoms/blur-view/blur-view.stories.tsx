import type {Meta, StoryObj} from '@storybook/react-native'

import {Box} from '../box'
import {RnText} from '../rn-text'
import {BlurView} from './blur-view'
import type {BlurMaterial} from './blur-view.types'

const MATERIALS: BlurMaterial[] = ['ultraThin', 'thin', 'regular', 'thick', 'ultraThick']

/** Stripes of the strongest colours, so what each material lets through is plain to see. */
const Backdrop = () => (
  <Box borderRadius="large" flexDirection="row" h={260} overflow="hidden" position="absolute" w="100%">
    <Box bg="fill.accent.primary" flex={1} />
    <Box bg="fill.success.primary" flex={1} />
    <Box bg="fill.destructive.primary" flex={1} />
    <Box bg="content.primary" flex={1} />
  </Box>
)

const meta = {
  args: {borderRadius: 'large', material: 'regular', px: 's16', py: 's12'},
  argTypes: {
    appearance: {control: 'select', options: [undefined, 'light', 'dark']},
    material: {control: 'select', options: MATERIALS},
    vibrancy: {control: 'select', options: [undefined, 'primary', 'secondary', 'tertiary', 'quaternary', 'fill']},
  },
  component: BlurView,
  parameters: {
    notes:
      'The system materials — UIKit `system*Material` on iOS, with vibrancy for the content if asked; on Android what ' +
      'lies behind, blurred and saturated (Android 12+), under a Material tonal surface as thick as the material. No ' +
      'host: it is a plain view, cheap enough for a list cell.',
  },
  render: args => (
    <Box h={260} justify="center" px="s16">
      <Backdrop />
      <BlurView {...args}>
        <RnText variant="headline">{args.material ?? 'regular'}</RnText>
        <RnText color="content.secondary" variant="footnote">
          What lies behind, through the material
        </RnText>
      </BlurView>
    </Box>
  ),
  title: 'Atoms/BlurView',
} satisfies Meta<typeof BlurView>

export default meta

type Story = StoryObj<typeof meta>

export const Regular: Story = {}

export const UltraThin: Story = {args: {material: 'ultraThin'}}

export const UltraThick: Story = {args: {material: 'ultraThick'}}

export const Vibrant: Story = {args: {vibrancy: 'secondary'}}

export const DarkOverAnything: Story = {args: {appearance: 'dark', material: 'thin'}}
