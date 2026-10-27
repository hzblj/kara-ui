import type {Meta, StoryObj} from '@storybook/react-native'
import {useArgs} from 'storybook/preview-api'
import {fn} from 'storybook/test'

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

export const Submit: Story = {
  args: {onSubmit: fn(), placeholder: 'Search stores'},
  parameters: {
    notes:
      'The return key reads Search on both platforms and calls `onSubmit` with the query; the keyboard goes down ' +
      'after it. Capitals and corrections are off unless `autoCapitalize` or `autoCorrect` ask for them.',
  },
}

export const AutoFocus: Story = {args: {autoFocus: true, placeholder: 'Search components'}}
