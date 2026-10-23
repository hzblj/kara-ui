import type {Meta, StoryObj} from '@storybook/react-native'
import {useArgs} from 'storybook/preview-api'

import {SearchBar} from './search-bar'
import type {SearchBarProps} from './search-bar.types'

const ControlledSearchBar = (args: SearchBarProps) => {
  const [, updateArgs] = useArgs<SearchBarProps>()

  return <SearchBar {...args} onChangeText={value => updateArgs({value})} />
}

const meta = {
  args: {value: ''},
  component: SearchBar,
  parameters: {notes: 'React Native tier: it hosts nothing native, so it renders outside `Screen` and `Island` too.'},
  render: ControlledSearchBar,
  title: 'Molecules/SearchBar',
} satisfies Meta<typeof SearchBar>

export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = {}

export const WithQuery: Story = {args: {value: 'swiftui'}}

export const CustomPlaceholder: Story = {args: {placeholder: 'Search components'}}
