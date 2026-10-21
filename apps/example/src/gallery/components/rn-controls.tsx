import {
  Avatar,
  Box,
  Chip,
  DatePicker,
  FlashList,
  Picker,
  Pressable,
  RnText,
  SearchBar,
  SegmentedControl,
  Skeleton,
  Snackbar,
} from '@hzblj/kara-ui'
import {useState} from 'react'

const SEGMENTS = ['Day', 'Week', 'Month']

const PICKER_OPTIONS = [
  {label: 'Small', value: 'sm'},
  {label: 'Medium', value: 'md'},
  {label: 'Large', value: 'lg'},
]

const CHIPS = ['react', 'native', 'expo', 'swiftui', 'compose']

type DemoRow = {
  id: string
  label: string
}

const ROWS: DemoRow[] = Array.from({length: 30}, (_, index) => ({
  id: String(index),
  label: `FlashList row ${index}`,
}))

const DemoRowItem = ({label}: {label: string}) => (
  <Box px="s12" py="s8">
    <RnText variant="footnote">{label}</RnText>
  </Box>
)

const renderDemoRow = ({item}: {item: DemoRow}) => <DemoRowItem label={item.label} />

const demoRowKey = (item: DemoRow) => item.id

export const SearchBarSection = () => {
  const [query, setQuery] = useState('')

  return <SearchBar onChangeText={setQuery} value={query} />
}

export const SnackbarSection = () => {
  const [snackbarVisible, setSnackbarVisible] = useState(false)

  return (
    <>
      <Pressable
        align="center"
        bg="fill.tertiary"
        borderRadius="medium"
        onPress={() => setSnackbarVisible(v => !v)}
        p="s12"
        wide
      >
        <RnText variant="labelMedium">{snackbarVisible ? 'Hide snackbar' : 'Show snackbar'}</RnText>
      </Pressable>
      <Snackbar
        actionLabel="Undo"
        message="Item deleted"
        onAction={() => setSnackbarVisible(false)}
        visible={snackbarVisible}
      />
    </>
  )
}

export const SegmentedControlSection = () => {
  const [segment, setSegment] = useState(0)

  return <SegmentedControl onChange={index => setSegment(index)} selectedIndex={segment} values={SEGMENTS} />
}

export const PickerSection = () => {
  const [size, setSize] = useState('md')

  return (
    <Box bg="surface.primary" borderRadius="medium" p="s12">
      <Picker onValueChange={setSize} options={PICKER_OPTIONS} value={size} />
    </Box>
  )
}

export const DatePickerSection = () => {
  const [date, setDate] = useState(new Date(2027, 0, 1))

  return (
    <Box gap="s8">
      <Box bg="surface.primary" borderRadius="medium" p="s12">
        <DatePicker onValueChange={setDate} value={date} />
      </Box>
      <RnText color="content.secondary" variant="footnote">
        {date.toDateString()}
      </RnText>
    </Box>
  )
}

export const PressableSection = () => {
  const [pressCount, setPressCount] = useState(0)

  return (
    <Pressable
      align="center"
      bg="fill.accent.primary"
      borderRadius="medium"
      haptic
      onPress={() => setPressCount(c => c + 1)}
      p="s16"
      wide
    >
      <RnText color="content.on.bg" variant="body">
        Pressed {pressCount}×
      </RnText>
    </Pressable>
  )
}

export const ChipSection = () => {
  const [selectedChips, setSelectedChips] = useState<string[]>(['react'])

  const toggleChip = (name: string) =>
    setSelectedChips(current => (current.includes(name) ? current.filter(c => c !== name) : [...current, name]))

  return (
    <Box flexDirection="row" gap="s8" wrap="wrap">
      {CHIPS.map(name => (
        <Chip key={name} label={name} onPress={() => toggleChip(name)} selected={selectedChips.includes(name)} />
      ))}
    </Box>
  )
}

export const AvatarSection = () => (
  <Box align="center" flexDirection="row" gap="s12">
    <Avatar initials="JB" size="sm" />
    <Avatar initials="JB" size="md" />
    <Avatar initials="JB" size="lg" />
  </Box>
)

export const SkeletonSection = () => (
  <Box gap="s8">
    <Skeleton height={20} width={160} />
    <Skeleton height={20} />
    <Skeleton borderRadius="full" height={48} width={48} />
  </Box>
)

export const FlashListSection = () => (
  <Box bg="surface.primary" borderRadius="medium" h={200} overflow="hidden">
    <FlashList data={ROWS} keyExtractor={demoRowKey} nestedScrollEnabled renderItem={renderDemoRow} />
  </Box>
)
