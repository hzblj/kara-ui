import type {Meta, StoryObj} from '@storybook/react-native'
import {useArgs} from 'storybook/preview-api'

import {HStack} from '../../atoms/h-stack'
import {Text} from '../../atoms/text'
import {VStack} from '../../atoms/v-stack'
import {insideIsland} from '../../story-decorators'
import {Sheet} from './sheet'
import type {SheetProps} from './sheet.types'

const ControlledSheet = (args: SheetProps) => {
  const [, updateArgs] = useArgs<SheetProps>()

  return (
    <VStack spacing="s8" wide>
      <HStack onPress={() => updateArgs({visible: true})} py="s8" wide>
        <Text color="content.accent">Open sheet</Text>
      </HStack>
      <Sheet {...args} onDismiss={() => updateArgs({visible: false})}>
        <VStack p="s24" spacing="s8">
          <Text variant="headingXs">Native bottom sheet</Text>
          <Text color="content.secondary" variant="footnote">
            A `BottomSheet` on iOS, a `ModalBottomSheet` on Android.
          </Text>
        </VStack>
      </Sheet>
    </VStack>
  )
}

/** `children` is `null` here on purpose — see `list.stories.tsx`; the sheet body comes from the render. */
const meta = {
  args: {children: null, onDismiss: () => undefined, visible: false},
  component: Sheet,
  decorators: [insideIsland],
  render: ControlledSheet,
  title: 'Organisms/Sheet',
} satisfies Meta<typeof Sheet>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FitToContents: Story = {args: {fitToContents: true}}
