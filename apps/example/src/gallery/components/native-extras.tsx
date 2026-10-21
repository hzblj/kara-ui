import {
  ActionSheet,
  Button,
  ColorPicker,
  Fab,
  Form,
  HStack,
  IconButton,
  Island,
  List,
  ListItem,
  Menu,
  type MenuAction,
  RadioGroup,
  RnText,
  Stepper,
  Surface,
  SwipeActions,
  Switch,
  Text,
  TextField,
  Tooltip,
  VStack,
} from '@hzblj/kara-ui'
import {useState} from 'react'
import {Platform} from 'react-native'

const RADIO_OPTIONS = [
  {label: 'Automatic', value: 'auto'},
  {label: 'Always on', value: 'on'},
  {label: 'Always off', value: 'off'},
]

export const IconButtonStepperSection = () => {
  const [count, setCount] = useState(2)

  return (
    <Island>
      <VStack spacing="s12" wide>
        <HStack spacing="s8">
          <IconButton name="add" onPress={() => undefined} />
          <IconButton name="trash" onPress={() => undefined} />
          <IconButton disabled name="lock" />
        </HStack>
        <Stepper label="Quantity" max={5} min={0} onValueChange={setCount} value={count} />
      </VStack>
    </Island>
  )
}

export const RadioGroupSection = () => {
  const [radio, setRadio] = useState('auto')

  return (
    <Island>
      <RadioGroup onValueChange={setRadio} options={RADIO_OPTIONS} value={radio} />
    </Island>
  )
}

export const SurfaceSection = () => (
  <Island>
    <VStack spacing="s12" wide>
      <Surface wide>
        <Text variant="labelMedium">Surface plain</Text>
      </Surface>
      <Surface bg="fill.accent.base" glass wide>
        <Text variant="labelMedium">Surface glass (iOS 26 glassEffect / M3 tonal)</Text>
      </Surface>
    </VStack>
  </Island>
)

/**
 * SwiftUI's `Form` scrolls like a `List`, so on iOS it gets a height to fill rather than sizing the island itself.
 * Android's is a column of cards, which sizes itself.
 */
const FORM_ISLAND = Platform.OS === 'ios' ? {matchContents: false, style: {height: 420}} : {}

export const FormSection = () => (
  <Island {...FORM_ISLAND}>
    <Form>
      <Form.Section footer="Sections are native on iOS, Cards on Android." title="Preferences">
        <Switch label="Notifications" value />
        <Switch label="Analytics" value={false} />
      </Form.Section>
      <Form.Section title="Account">
        <TextField label="Display name" />
      </Form.Section>
    </Form>
  </Island>
)

export const MenuSection = () => {
  const [actionSheetVisible, setActionSheetVisible] = useState(false)
  const [lastAction, setLastAction] = useState('none')

  const actions: MenuAction[] = [
    {icon: 'share', label: 'Share', onPress: () => setLastAction('share')},
    {icon: 'star', label: 'Favourite', onPress: () => setLastAction('favourite')},
    {destructive: true, icon: 'trash', label: 'Delete', onPress: () => setLastAction('delete')},
  ]

  return (
    <Island>
      <VStack spacing="s12" wide>
        <Menu actions={actions} label="Open menu" />
        <HStack onPress={() => setActionSheetVisible(true)} py="s8" wide>
          <Text color="content.accent">Open action sheet</Text>
        </HStack>
        <Text color="content.secondary" variant="footnote">
          last action · {lastAction}
        </Text>
        <ActionSheet
          actions={actions}
          onDismiss={() => setActionSheetVisible(false)}
          title="Choose an action"
          visible={actionSheetVisible}
        />
      </VStack>
    </Island>
  )
}

export const TooltipSection = () => {
  const [tooltipVisible, setTooltipVisible] = useState(false)

  return (
    <Island>
      <Tooltip
        onDismiss={() => setTooltipVisible(false)}
        text="Popover on iOS, TooltipBox on Android"
        visible={tooltipVisible}
      >
        <HStack onPress={() => setTooltipVisible(true)} py="s8">
          <Text color="content.accent">Show tooltip</Text>
        </HStack>
      </Tooltip>
    </Island>
  )
}

/**
 * Where a component has no Android implementation the gallery says so, rather than mounting the stub — which renders
 * nothing and reports the gap as a dev error, the way any call site that forgot to branch on the platform would.
 */
/** A list scrolls, so its island takes a height rather than sizing to it — see `ListProps`. */
const SWIPE_LIST_HEIGHT = {height: 200}

const IosOnly = ({name}: {name: string}) => (
  <RnText color="content.secondary" variant="footnote">
    {name} is iOS only — SwiftUI has it, Compose does not.
  </RnText>
)

export const ColorPickerSection = () => {
  const [color, setColor] = useState<string | null>('#FF5A1F')

  if (Platform.OS !== 'ios') {
    return <IosOnly name="ColorPicker" />
  }

  return (
    <Island>
      <VStack spacing="s8" wide>
        <ColorPicker label="Accent" onValueChange={setColor} value={color} />
        <ColorPicker label="With opacity" onValueChange={setColor} supportsOpacity value={color} />
        <Text color="content.secondary" variant="footnote">
          selection · {color}
        </Text>
      </VStack>
    </Island>
  )
}

export const SwipeActionsSection = () =>
  Platform.OS !== 'ios' ? (
    <IosOnly name="SwipeActions" />
  ) : (
    <Island matchContents={false} style={SWIPE_LIST_HEIGHT}>
      <List>
        <SwipeActions>
          <ListItem subtitle="Swipe from the trailing edge" title="Swipe me" />
          <SwipeActions.Actions>
            <Button label="Delete" variant="destructive" />
          </SwipeActions.Actions>
        </SwipeActions>
        <SwipeActions>
          <ListItem subtitle="Leading edge, no full swipe" title="Swipe me too" />
          <SwipeActions.Actions allowsFullSwipe={false} edge="leading">
            <Button label="Pin" variant="secondary" />
          </SwipeActions.Actions>
        </SwipeActions>
      </List>
    </Island>
  )

export const FabSection = () => (
  <Island>
    <HStack spacing="s12">
      <Fab name="add" onPress={() => undefined} />
      <Fab name="search" onPress={() => undefined} />
    </HStack>
  </Island>
)
