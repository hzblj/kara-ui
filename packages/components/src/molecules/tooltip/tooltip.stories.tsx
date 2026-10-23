import type {Meta, StoryObj} from '@storybook/react-native'
import {useArgs} from 'storybook/preview-api'

import {HStack} from '../../atoms/h-stack'
import {Text} from '../../atoms/text'
import {insideIsland} from '../../story-decorators'
import {Tooltip} from './tooltip'
import type {TooltipProps} from './tooltip.types'

const ControlledTooltip = (args: TooltipProps) => {
  const [, updateArgs] = useArgs<TooltipProps>()

  return (
    <Tooltip {...args} onDismiss={() => updateArgs({visible: false})}>
      <HStack onPress={() => updateArgs({visible: true})} py="s8">
        <Text color="content.accent">Show tooltip</Text>
      </HStack>
    </Tooltip>
  )
}

/** `children` is `null` here on purpose — see `list.stories.tsx`; the anchor comes from the render. */
const meta = {
  args: {
    children: null,
    onDismiss: () => undefined,
    text: 'A popover on iOS, a plain tooltip on Android',
    visible: false,
  },
  component: Tooltip,
  decorators: [insideIsland],
  parameters: {
    notes:
      'Anchored to its child, and dismissed by the platform, which is why `visible` is controlled and ' +
      '`onDismiss` is not optional.',
  },
  render: ControlledTooltip,
  title: 'Molecules/Tooltip',
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<typeof meta>

export const Hidden: Story = {}

export const Visible: Story = {args: {visible: true}}
