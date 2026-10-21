import type {Meta, StoryObj} from '@storybook/react-native'
import {useArgs} from 'storybook/preview-api'
import {fn} from 'storybook/test'

import {Box} from '../../atoms/box'
import {Pressable} from '../../atoms/pressable'
import {RnText} from '../../atoms/rn-text'
import {RnTooltip} from './rn-tooltip'
import type {RnTooltipProps} from './rn-tooltip.types'

const ControlledTooltip = (args: RnTooltipProps) => {
  const [, updateArgs] = useArgs<RnTooltipProps>()

  return (
    <Box align="flex-end">
      <RnTooltip {...args} onDismiss={() => updateArgs({visible: false})}>
        <Pressable bg="fill.tertiary" borderRadius="full" onPress={() => updateArgs({visible: true})} px="s16" py="s8">
          <RnText variant="labelMedium">Show tooltip</RnText>
        </Pressable>
      </RnTooltip>
    </Box>
  )
}

/**
 * Stands in for the required anchor — see `list.stories.tsx`: a React element in `args` is walked by Storybook when it
 * serialises the Controls panel. The anchor here must be an element, so `null` needs the cast; the render supplies it.
 */
const NO_ANCHOR = null as unknown as RnTooltipProps['children']

const meta = {
  args: {
    actions: [{label: 'Got it', onPress: fn()}],
    children: NO_ANCHOR,
    message: 'Long-press a card to see what else you can do with it.',
    onDismiss: fn(),
    title: 'New here?',
    visible: false,
  },
  argTypes: {actionsAlignment: {control: 'select', options: ['end', 'start']}},
  component: RnTooltip,
  parameters: {
    notes:
      'Anchored below a React Native view and drawn above every sibling. Controlled: `onDismiss` reports a touch ' +
      'outside or the anchor scrolling out of view, and the caller turns `visible` off. iOS keeps it through a ' +
      'scroll; Material dismisses on any outside touch, the start of a scroll included. `link` actions are ' +
      'underlined text on iOS and a text button on Android.',
  },
  render: ControlledTooltip,
  title: 'Molecules/RnTooltip',
} satisfies Meta<typeof RnTooltip>

export default meta

type Story = StoryObj<typeof meta>

export const Hidden: Story = {}

export const Visible: Story = {args: {visible: true}}

export const WithButtons: Story = {
  args: {
    actions: [
      {label: 'Later', onPress: fn(), variant: 'secondary'},
      {label: 'Show me', onPress: fn(), variant: 'primary'},
    ],
    visible: true,
  },
}
