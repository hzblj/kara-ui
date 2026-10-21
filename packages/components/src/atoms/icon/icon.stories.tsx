import type {Meta, StoryObj} from '@storybook/react-native'

import {insideIsland} from '../../story-decorators'
import {HStack} from '../h-stack'
import {VStack} from '../v-stack'
import {Icon} from './icon'
import type {IconName} from './icon.types'

const NAMES: IconName[] = [
  'add',
  'arrowLeft',
  'arrowRight',
  'calendar',
  'check',
  'chevronDown',
  'chevronRight',
  'close',
  'error',
  'grid',
  'heart',
  'home',
  'info',
  'lock',
  'more',
  'notification',
  'search',
  'settings',
  'share',
  'star',
  'trash',
  'user',
  'warning',
]

const ROW_LENGTH = 6

const ROWS = Array.from({length: Math.ceil(NAMES.length / ROW_LENGTH)}, (_, row) =>
  NAMES.slice(row * ROW_LENGTH, row * ROW_LENGTH + ROW_LENGTH)
)

const meta = {
  args: {name: 'home'},
  argTypes: {
    color: {
      control: 'select',
      options: ['content.primary', 'content.secondary', 'content.accent', 'content.destructive', 'content.success'],
    },
    name: {control: 'select', options: NAMES},
    size: {control: 'select', options: ['s12', 's16', 's20', 's24', 's32', 's48']},
  },
  component: Icon,
  decorators: [insideIsland],
  parameters: {
    notes: 'One name, two mappings: an SF Symbol on iOS and a Material icon on Android. Compare both platforms.',
  },
  title: 'Atoms/Icon',
} satisfies Meta<typeof Icon>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const AllNames: Story = {
  render: () => (
    <VStack spacing="s16" wide>
      {ROWS.map(row => (
        <HStack key={row.join()} spacing="s16" wide>
          {row.map(name => (
            <Icon key={name} name={name} />
          ))}
        </HStack>
      ))}
    </VStack>
  ),
}

export const Sizes: Story = {
  render: () => (
    <HStack align="center" spacing="s12" wide>
      <Icon name="star" size="s12" />
      <Icon name="star" size="s16" />
      <Icon name="star" size="s24" />
      <Icon name="star" size="s32" />
      <Icon name="star" size="s48" />
    </HStack>
  ),
}

export const Colors: Story = {
  render: () => (
    <HStack spacing="s16" wide>
      <Icon color="content.primary" name="heart" />
      <Icon color="content.secondary" name="heart" />
      <Icon color="content.accent" name="heart" />
      <Icon color="content.destructive" name="heart" />
      <Icon color="content.success" name="heart" />
    </HStack>
  ),
}
