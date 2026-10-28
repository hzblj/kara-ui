import type {Meta, StoryObj} from '@storybook/react-native'
import {useArgs} from 'storybook/preview-api'

import {Text} from '../../atoms/text'
import {VStack} from '../../atoms/v-stack'
import {ZStack} from '../../atoms/z-stack'
import {insideIslandOfHeight} from '../../utils/story-decorators'
import {Pager} from './pager'
import type {PagerProps} from './pager.types'

const PAGE_BACKGROUNDS = ['fill.accent.primary', 'fill.success.primary', 'fill.destructive.primary'] as const

const ControlledPager = (args: PagerProps) => {
  const [, updateArgs] = useArgs<PagerProps>()

  return (
    <VStack spacing="s8" wide>
      <Pager {...args} onPageChange={page => updateArgs({page})}>
        {PAGE_BACKGROUNDS.map((bg, index) => (
          <ZStack align="center" bg={bg} key={bg} wide>
            <Text color="content.on.accent" variant="headingS">
              Page {index + 1}
            </Text>
          </ZStack>
        ))}
      </Pager>
      <Text color="content.secondary" variant="footnote">
        page {(args.page ?? 0) + 1} of {PAGE_BACKGROUNDS.length}
      </Text>
    </VStack>
  )
}

const meta = {
  args: {page: 0},
  component: Pager,
  decorators: [insideIslandOfHeight(220)],
  parameters: {
    notes:
      'Pages are addressed by index, not by name: Compose’s pager is index-native while SwiftUI’s tab values are ' +
      'strings, and synthesising the string from a child’s position is the lossless direction. `pageSpacing` and ' +
      '`scrollEnabled` are Android-only: a page-style SwiftUI `TabView` has no gap, and can only be disabled ' +
      'as a whole.',
  },
  render: ControlledPager,
  title: 'Molecules/Pager',
} satisfies Meta<typeof Pager>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithIndicators: Story = {args: {indicators: true}}

export const SpacedPages: Story = {args: {indicators: true, pageSpacing: 's16'}}
