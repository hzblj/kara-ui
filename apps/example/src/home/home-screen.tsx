import {haptics} from '@hzblj/expo-rich-haptics'
import {
  Badge,
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  Island,
  Label,
  LabeledContent,
  type NavigationBarItem,
  RadioGroup,
  RnText,
  Sheet,
  Spacer,
  Stepper,
  Switch,
  Text,
  VStack,
  ZStack,
} from '@hzblj/kara-ui'
import {router} from 'expo-router'
import {useMemo, useState} from 'react'
import {Linking} from 'react-native'

import {AccentControl, ThemePreferenceControl} from '../appearance'
import {COMPONENT_COUNT} from '../catalog'
import {InsetDivider, LinkList, Page, Section} from '../ui'

const PRICE = 129

const DELIVERY = [
  {label: 'Standard · free · 3–5 days', value: 'standard'},
  {label: 'Express · €9 · tomorrow', value: 'express'},
]

const Hero = () => (
  <Island>
    <VStack align="start" bg="surface.primary" borderRadius="large" p="s20" spacing="s12" wide>
      <HStack spacing="s6">
        <Badge label="SwiftUI" tone="accent" />
        <Badge label="Jetpack Compose" />
        <Badge label="Expo" tone="success" />
      </HStack>
      <Text variant="headingS">Native UI for Expo</Text>
      <Text color="content.secondary">
        {`Real SwiftUI and Jetpack Compose controls, styled by one set of design tokens, in your colours. ${COMPONENT_COUNT} components, and every one of them is on this phone.`}
      </Text>
      <VStack spacing="s8" wide>
        <Button label="Explore components" onPress={() => router.push('/components')} />
        <Button label="See the design tokens" onPress={() => router.push('/design')} variant="secondary" />
      </VStack>
    </VStack>
  </Island>
)

const MakeItYours = () => (
  <Section
    caption="The whole app follows along, native and React Native views alike. Wallpaper is Material You on Android 12+."
    title="Make it yours"
  >
    <ThemePreferenceControl testID="home-theme-preference" />
    <AccentControl testID="home-accent" />
  </Section>
)

const Order = () => {
  const [quantity, setQuantity] = useState(1)
  const [delivery, setDelivery] = useState('standard')
  const [checkingOut, setCheckingOut] = useState(false)
  const [ordered, setOrdered] = useState(false)
  const close = () => setCheckingOut(false)
  const closeItem = useMemo<NavigationBarItem[]>(() => [{onPress: () => setCheckingOut(false), type: 'close'}], [])
  const shipping = delivery === 'express' ? 9 : 0
  const total = PRICE * quantity + shipping

  const pay = () => {
    setCheckingOut(false)
    setOrdered(true)
  }

  return (
    <Section caption="A real flow: the stepper, the native sheet with its header, the radio group." title="Try it">
      <Island>
        <VStack bg="surface.primary" borderRadius="large" p="s16" spacing="s12" wide>
          <HStack align="center" spacing="s12" wide>
            <ZStack align="center" bg="fill.accent.base" borderRadius="medium" h={56} w={56}>
              <Icon color="content.accent" name="shopping-bag" />
            </ZStack>
            <VStack align="start" spacing="s2">
              <Text variant="headline">Air Max 90</Text>
              <Text color="content.secondary" variant="footnote">
                EU 42 · Black
              </Text>
            </VStack>
            <Spacer />
            <Text variant="headline">{`€${PRICE}`}</Text>
          </HStack>
          <Divider />
          <Stepper label="Quantity" max={5} min={1} onValueChange={setQuantity} value={quantity} />
          {ordered ? (
            <Label color="content.success" icon="check" title="Order placed, arriving Friday" variant="labelMedium" />
          ) : (
            <Button label="Checkout" onPress={() => setCheckingOut(true)} />
          )}
        </VStack>
      </Island>

      <Sheet onDismiss={close} visible={checkingOut}>
        <Sheet.Header title="Checkout" trailingItems={closeItem} />
        <Box gap="s16" pb="s32" px="s20">
          <Island>
            <VStack spacing="s16" wide>
              <VStack bg="surface.base" borderRadius="large" px="s16" wide>
                <LabeledContent label={`Air Max 90 × ${quantity}`} value={`€${PRICE * quantity}`} />
                <Divider />
                <LabeledContent label="Shipping" value={shipping ? `€${shipping}` : 'Free'} />
                <Divider />
                <LabeledContent label="Total" value={`€${total}`} />
              </VStack>
              <RadioGroup onValueChange={setDelivery} options={DELIVERY} value={delivery} />
              <Button label={`Pay €${total}`} onPress={pay} />
            </VStack>
          </Island>
        </Box>
      </Sheet>
    </Section>
  )
}

const Preferences = () => {
  const [updates, setUpdates] = useState(true)
  const [hapticsOn, setHapticsOn] = useState(haptics.isEnabled)
  // A real app stores the preference and calls `setEnabled` at start-up; the example keeps it for the session.
  const toggleHaptics = (on: boolean) => {
    haptics.setEnabled(on)
    setHapticsOn(on)
  }

  return (
    <Section caption="Settings rows, the way each platform draws them." title="Feels at home">
      <Island>
        <VStack bg="surface.primary" borderRadius="large" wide>
          <LabeledContent icon="notification" label="Order updates" px="s16">
            <Switch onValueChange={setUpdates} value={updates} />
          </LabeledContent>
          <InsetDivider />
          <LabeledContent icon="bolt" label="Haptics" px="s16">
            <Switch onValueChange={toggleHaptics} value={hapticsOn} />
          </LabeledContent>
          <InsetDivider />
          <LabeledContent icon="user" label="Account" onPress={() => undefined} px="s16" value="you@example.com" />
        </VStack>
      </Island>
    </Section>
  )
}

const LINKS = [
  {
    icon: 'code' as const,
    id: 'github',
    onPress: () => Linking.openURL('https://github.com/hzblj/kara-ui'),
    subtitle: 'Source, docs and this app',
    title: 'GitHub',
  },
  {
    icon: 'bolt' as const,
    id: 'npm',
    onPress: () => Linking.openURL('https://www.npmjs.com/package/@hzblj/kara-ui'),
    subtitle: 'npx expo install @hzblj/kara-ui',
    title: 'Install from npm',
  },
]

export const HomeScreen = () => (
  <Page testID="home">
    <Hero />
    <MakeItYours />
    <Order />
    <Preferences />
    <Section title="Get kara">
      <LinkList rows={LINKS} />
      <RnText color="content.tertiary" variant="footnote">
        MIT licensed. iOS and Android, Expo SDK 57.
      </RnText>
    </Section>
  </Page>
)
