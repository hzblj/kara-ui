import type {Meta, StoryObj} from '@storybook/react-native'
import {useState} from 'react'
import {fn} from 'storybook/test'

import {Box} from '../box'
import {Chip} from './chip'

const NAMES = ['react', 'native', 'expo', 'swiftui', 'compose']

const SelectableChips = () => {
  const [selected, setSelected] = useState<string[]>(['react'])

  const toggle = (name: string) =>
    setSelected(current => (current.includes(name) ? current.filter(item => item !== name) : [...current, name]))

  return (
    <Box flexDirection="row" gap="s8" wrap="wrap">
      {NAMES.map(name => (
        <Chip key={name} label={name} onPress={() => toggle(name)} selected={selected.includes(name)} />
      ))}
    </Box>
  )
}

const meta = {
  args: {label: 'react', onPress: fn()},
  component: Chip,
  parameters: {notes: 'React Native tier — a filter pill, not a native control. Safe to render outside a host.'},
  title: 'Atoms/Chip',
} satisfies Meta<typeof Chip>

export default meta

type Story = StoryObj<typeof meta>

export const Unselected: Story = {}

export const Selected: Story = {args: {selected: true}}

export const MultiSelect: Story = {render: SelectableChips}
