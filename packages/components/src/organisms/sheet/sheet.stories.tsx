import type {Meta, StoryObj} from '@storybook/react-native'
import {useArgs} from 'storybook/preview-api'
import {fn} from 'storybook/test'

import {Box} from '../../atoms/box'
import {Pressable} from '../../atoms/pressable'
import {RnText} from '../../atoms/rn-text'
import {Sheet} from './sheet'
import type {SheetHeaderProps, SheetProps} from './sheet.types'

type StoryArgs = SheetProps & {header?: SheetHeaderProps}

const ROWS = Array.from({length: 30}, (_, index) => `Row ${index + 1}`)

const ControlledSheet = ({header, ...args}: StoryArgs) => {
  const [, updateArgs] = useArgs<StoryArgs>()
  const close = () => updateArgs({visible: false})

  return (
    <Box p="s16">
      <Pressable onPress={() => updateArgs({visible: true})} py="s8">
        <RnText color="content.accent" variant="body">
          Open sheet
        </RnText>
      </Pressable>
      <Sheet {...args} onDismiss={close}>
        {header ? <Sheet.Header {...header} /> : null}
        {args.scrollable ? (
          <Sheet.ScrollView content={{pb: 's32', px: 's16'}}>
            {ROWS.map(row => (
              <Box borderBottomWidth={1} borderColor="border.tertiary" key={row} py="s12">
                <RnText variant="body">{row}</RnText>
              </Box>
            ))}
          </Sheet.ScrollView>
        ) : (
          <Box gap="s8" pb="s32" px="s16">
            <RnText color="content.secondary" variant="body">
              A native sheet: UISheetPresentationController on iOS, Material’s bottom sheet on Android.
            </RnText>
          </Box>
        )}
      </Sheet>
    </Box>
  )
}

/** `children` is `null` here on purpose — see `list.stories.tsx`; the sheet body comes from the render. */
const meta = {
  args: {children: null, onDismiss: () => undefined, visible: false},
  component: Sheet,
  parameters: {
    notes:
      'The React Native tier: no host, and never inside one — native atoms in the content go in an `Island`. ' +
      '`<Sheet.Header>` (a direct child) is a native bar with a title and items; `<Sheet.ScrollView>` is the body of ' +
      'a `scrollable` sheet. On iOS 26 a scrollable sheet’s content scrolls under the header with the soft edge ' +
      'effect, and a `large` title fades into the bar once it has scrolled away.',
  },
  render: ControlledSheet,
  title: 'Organisms/Sheet',
} satisfies Meta<StoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const TitleAndClose: Story = {
  args: {header: {title: 'Choose a size', trailingItems: [{onPress: fn(), type: 'close'}]}},
}

export const LargeTitleScrolling: Story = {
  args: {
    detents: [0.6, 1],
    header: {title: 'Nearby stores', titleStyle: 'large', trailingItems: [{onPress: fn(), type: 'close'}]},
    scrollable: true,
  },
}

export const BackActionsAndClose: Story = {
  args: {
    header: {
      leadingItems: [{onPress: fn(), type: 'back'}],
      title: 'Air Max 90',
      trailingItems: [
        {icon: 'share', label: 'Share', onPress: fn(), type: 'icon'},
        {icon: 'heart', label: 'Favourite', onPress: fn(), type: 'icon'},
        {onPress: fn(), separated: true, type: 'close'},
      ],
    },
  },
}

export const NoHeader: Story = {}
