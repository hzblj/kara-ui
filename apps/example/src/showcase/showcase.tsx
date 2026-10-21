import {
  Badge,
  Box,
  Button,
  Divider,
  HStack,
  Island,
  LabeledContent,
  RnScrollView,
  RnText,
  Switch,
  Text,
  VStack,
} from '@hzblj/kara-ui'
import {router} from 'expo-router'
import {useState} from 'react'

import {AccentControl, ThemePreferenceControl} from '../appearance'

const openGallery = () => router.push('/gallery')

const SectionTitle = ({children}: {children: string}) => (
  <RnText color="content.secondary" variant="footnoteMedium">
    {children}
  </RnText>
)

const Hero = () => (
  <Island>
    <VStack align="start" bg="surface.primary" borderRadius="large" p="s20" spacing="s12" wide>
      <HStack spacing="s6">
        <Badge label="SwiftUI" tone="accent" />
        <Badge label="Compose" tone="neutral" />
        <Badge label="Expo" tone="success" />
      </HStack>
      <Text variant="headingS">Native views, one token system</Text>
      <Text color="content.secondary" variant="subheadline">
        Every control here is a real SwiftUI or Jetpack Compose view, styled by token-typed props that refuse raw
        values.
      </Text>
      <Button label="Browse every component" onPress={openGallery} variant="accent" wide />
    </VStack>
  </Island>
)

/**
 * Both controls change `KaraProvider` live: the preference flips the platform appearance for both tiers, the accent
 * swaps a `defineTheme` override — every accent token, and Android's Material seed with them.
 */
const Appearance = () => (
  <Box gap="s8">
    <SectionTitle>APPEARANCE</SectionTitle>
    <ThemePreferenceControl testID="showcase-theme-preference" />
    <AccentControl testID="showcase-accent" />
  </Box>
)

const Settings = () => {
  const [notifications, setNotifications] = useState(true)
  const [haptics, setHaptics] = useState(false)

  return (
    <Box gap="s8">
      <SectionTitle>SETTINGS</SectionTitle>
      <Island>
        <VStack bg="surface.primary" borderRadius="medium" px="s12" wide>
          <LabeledContent icon="notification" label="Notifications">
            <Switch onValueChange={setNotifications} value={notifications} />
          </LabeledContent>
          <Divider />
          <LabeledContent icon="star" label="Haptics">
            <Switch onValueChange={setHaptics} value={haptics} />
          </LabeledContent>
          <Divider />
          <LabeledContent icon="info" label="Version" value="0.0.0" />
        </VStack>
      </Island>
    </Box>
  )
}

const Actions = () => (
  <Box gap="s8">
    <SectionTitle>ACTIONS</SectionTitle>
    <Island>
      <VStack spacing="s8" wide>
        <Button label="Accent" variant="accent" wide />
        <Button label="Secondary" variant="secondary" wide />
        <Button label="Destructive" variant="destructive" wide />
      </VStack>
    </Island>
  </Box>
)

export const Showcase = () => (
  <RnScrollView
    bg="surface.base"
    content={{gap: 's24', pb: 's32', pt: 's8', px: 's20'}}
    contentInsetAdjustmentBehavior="automatic"
    flex={1}
    testID="showcase"
  >
    <Hero />
    <Appearance />
    <Settings />
    <Actions />
  </RnScrollView>
)
