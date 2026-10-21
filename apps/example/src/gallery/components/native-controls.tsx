import {
  Alert,
  Badge,
  Card,
  Checkbox,
  Collapsible,
  Divider,
  HStack,
  Icon,
  type IconName,
  Island,
  List,
  ListItem,
  Progress,
  Sheet,
  Slider,
  Spacer,
  Switch,
  Text,
  TextField,
  VStack,
} from '@hzblj/kara-ui'
import {useState} from 'react'

const ICONS: IconName[] = ['home', 'search', 'settings', 'heart', 'star', 'user', 'trash', 'share', 'lock', 'warning']

export const SwitchCheckboxSection = () => {
  const [switchOn, setSwitchOn] = useState(true)
  const [checked, setChecked] = useState(false)

  return (
    <Island>
      <VStack spacing="s12" wide>
        <Switch label="Switch with label" onValueChange={setSwitchOn} value={switchOn} />
        <Switch disabled label="Switch disabled" value={false} />
        <Checkbox label="Checkbox with label" onValueChange={setChecked} value={checked} />
        <Checkbox disabled label="Checkbox disabled" value />
      </VStack>
    </Island>
  )
}

export const SliderSection = () => {
  const [volume, setVolume] = useState(0.4)

  return (
    <Island>
      <VStack spacing="s8" wide>
        <Slider onValueChange={setVolume} value={volume} />
        <Text color="content.secondary" variant="footnote">
          value {volume.toFixed(2)}
        </Text>
        <Slider disabled value={0.7} />
      </VStack>
    </Island>
  )
}

export const ProgressSection = () => (
  <Island>
    <VStack spacing="s12" wide>
      <Progress value={0.35} />
      <Progress />
      <HStack spacing="s16">
        <Progress circular value={0.6} />
        <Progress circular />
      </HStack>
    </VStack>
  </Island>
)

export const TextFieldSection = () => (
  <Island>
    <VStack spacing="s12" wide>
      <TextField label="Label" />
      <TextField label="Secure" secure />
      <TextField error label="With error" />
      <TextField disabled label="Disabled" />
    </VStack>
  </Island>
)

export const IconSection = () => (
  <Island>
    <HStack spacing="s12" wide>
      {ICONS.map(name => (
        <Icon key={name} name={name} />
      ))}
    </HStack>
  </Island>
)

export const BadgeSection = () => (
  <Island>
    <HStack spacing="s8" wide>
      <Badge label="neutral" />
      <Badge label="accent" tone="accent" />
      <Badge label="success" tone="success" />
      <Badge label="error" tone="destructive" />
    </HStack>
  </Island>
)

export const CardSection = () => (
  <Island>
    <Card>
      <VStack spacing="s4">
        <Text variant="headingXs">Card title</Text>
        <Text color="content.secondary" variant="footnote">
          surface.primary · shadow card · radius large
        </Text>
      </VStack>
    </Card>
  </Island>
)

export const CollapsibleSection = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Island>
      <Collapsible expanded={expanded} label="Show details" onExpandedChange={setExpanded}>
        <Text color="content.secondary" variant="footnote">
          Hidden content revealed by DisclosureGroup on iOS, AnimatedVisibility on Android.
        </Text>
      </Collapsible>
    </Island>
  )
}

export const ListSection = () => (
  <Island>
    <List>
      <ListItem icon="home" onPress={() => undefined} subtitle="With chevron" title="Tappable row" />
      <Divider />
      <ListItem icon="settings" subtitle="No chevron" title="Plain row" />
      <Divider />
      <ListItem title="Title only" />
    </List>
  </Island>
)

export const SheetAlertSection = () => {
  const [sheetVisible, setSheetVisible] = useState(false)
  const [alertVisible, setAlertVisible] = useState(false)

  return (
    <Island>
      <VStack spacing="s8" wide>
        <HStack onPress={() => setSheetVisible(true)} py="s8" wide>
          <Text color="content.accent">Open sheet</Text>
          <Spacer />
          <Icon color="content.accent" name="chevronRight" size="s16" />
        </HStack>
        <Divider />
        <HStack onPress={() => setAlertVisible(true)} py="s8" wide>
          <Text color="content.destructive">Open alert</Text>
          <Spacer />
          <Icon color="content.destructive" name="chevronRight" size="s16" />
        </HStack>
        <Sheet onDismiss={() => setSheetVisible(false)} visible={sheetVisible}>
          <VStack p="s24" spacing="s8">
            <Text variant="headingXs">Native bottom sheet</Text>
            <Text color="content.secondary" variant="footnote">
              BottomSheet on iOS, ModalBottomSheet on Android.
            </Text>
          </VStack>
        </Sheet>
        <Alert
          confirmLabel="Delete"
          destructive
          message="This maps to a SwiftUI alert and a Material AlertDialog."
          onDismiss={() => setAlertVisible(false)}
          title="Delete item?"
          visible={alertVisible}
        />
      </VStack>
    </Island>
  )
}
