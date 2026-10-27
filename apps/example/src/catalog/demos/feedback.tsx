import {
  ActivityIndicator,
  Alert,
  Box,
  Button,
  HStack,
  Island,
  Pressable,
  Progress,
  RnText,
  RnTooltip,
  Skeleton,
  Snackbar,
  Text,
  Tooltip,
  VStack,
} from '@hzblj/kara-ui'
import {useState} from 'react'

import {Section} from '../../ui'
import type {CatalogEntry} from '../catalog.types'
import {KARA_MODULE, NATIVE, REACT_NATIVE} from './tags'

const ProgressDemo = () => (
  <>
    <Section caption="With a value it shows how far along; without one it just spins." title="Linear">
      <Island>
        <VStack spacing="s16" wide>
          <Progress value={0.35} />
          <Progress />
        </VStack>
      </Island>
    </Section>
    <Section title="Circular">
      <Island>
        <HStack spacing="s20">
          <Progress circular value={0.6} />
          <Progress circular />
        </HStack>
      </Island>
    </Section>
    <Section caption="Any colour token: red for storage nearly full, green for a goal reached." title="Colours">
      <Island>
        <VStack spacing="s16" wide>
          <Progress accessibilityLabel="Storage used" color="fill.destructive.primary" value={0.92} />
          <Progress accessibilityLabel="Daily goal" color="fill.success.primary" value={1} />
        </VStack>
      </Island>
    </Section>
  </>
)

const ActivityIndicatorDemo = () => (
  <>
    <Section
      caption="Beside what is loading. iOS turns UIKit’s spinner; Android morphs Material 3’s expressive shapes."
      title="Small"
    >
      <Box align="center" bg="surface.primary" borderRadius="large" flexDirection="row" gap="s12" p="s16">
        <ActivityIndicator />
        <RnText color="content.secondary">Loading your orders…</RnText>
      </Box>
    </Section>
    <Section caption="Holding a screen while it loads." title="Large">
      <Box align="center" bg="surface.primary" borderRadius="large" justify="center" p="s32">
        <ActivityIndicator size="large" />
      </Box>
    </Section>
    <Section caption="Inside an island it joins the island’s stack, beside native text." title="In an island">
      <Island>
        <HStack align="center" spacing="s12">
          <ActivityIndicator />
          <Text color="content.secondary">Loading your orders…</Text>
        </HStack>
      </Island>
    </Section>
  </>
)

const SkeletonDemo = () => (
  <Section caption="Placeholders while content loads.">
    <Box bg="surface.primary" borderRadius="large" flexDirection="row" gap="s12" p="s16">
      <Skeleton borderRadius="full" h={48} w={48} />
      <Box flex={1} gap="s8" justify="center">
        <Skeleton h={16} w={160} />
        <Skeleton h={16} />
      </Box>
    </Box>
  </Section>
)

const SnackbarDemo = () => {
  const [deleted, setDeleted] = useState(false)
  const [copied, setCopied] = useState(false)

  return (
    <Section caption="The action at the trailing end. Delete waits 4 s with a dismiss button; Copy sits at the top and goes by itself.">
      <Island>
        <HStack spacing="s12" wide>
          <Button label="Delete item" onPress={() => setDeleted(true)} variant="secondary" wide />
          <Button label="Copy link" onPress={() => setCopied(true)} variant="secondary" wide />
        </HStack>
      </Island>
      <Snackbar
        actionLabel="Undo"
        dismissible
        duration="short"
        message="Item deleted"
        onAction={() => setDeleted(false)}
        onDismiss={() => setDeleted(false)}
        visible={deleted}
      />
      <Snackbar
        duration="short"
        message="Link copied"
        onDismiss={() => setCopied(false)}
        position="top"
        visible={copied}
      />
    </Section>
  )
}

const AlertDemo = () => {
  const [visible, setVisible] = useState(false)
  const [placed, setPlaced] = useState(false)

  return (
    <>
      <Section caption="A SwiftUI alert on iOS, Material’s dialog on Android.">
        <Island>
          <VStack wide>
            <Button label="Delete account" onPress={() => setVisible(true)} variant="destructive" />
            <Alert
              confirmLabel="Delete"
              destructive
              message="This removes your orders and wishlist. It cannot be undone."
              onDismiss={() => setVisible(false)}
              title="Delete account?"
              visible={visible}
            />
          </VStack>
        </Island>
      </Section>
      <Section caption="With cancelLabel null the alert has only its confirm button, for news that needs no decision. cancelLabel also puts Cancel in the app’s language.">
        <Island>
          <VStack wide>
            <Button label="Place order" onPress={() => setPlaced(true)} variant="secondary" />
            <Alert
              cancelLabel={null}
              message="We will email you when it ships."
              onDismiss={() => setPlaced(false)}
              title="Order placed"
              visible={placed}
            />
          </VStack>
        </Island>
      </Section>
    </>
  )
}

const TooltipDemo = () => {
  const [visible, setVisible] = useState(false)

  return (
    <Section caption="Tap the link: a popover on iOS, Material’s plain tooltip on Android. A tap outside dismisses it.">
      <Island>
        <Tooltip onDismiss={() => setVisible(false)} text="Free returns within 30 days" visible={visible}>
          <HStack onPress={() => setVisible(true)} py="s8">
            <Text color="content.accent">What is this?</Text>
          </HStack>
        </Tooltip>
      </Island>
    </Section>
  )
}

const RnTooltipDemo = () => {
  const [visible, setVisible] = useState(false)

  return (
    <Section caption="A rich tooltip with a title and actions, anchored to React Native content.">
      <Box align="flex-start">
        <RnTooltip
          actions={[{label: 'Got it', onPress: () => setVisible(false)}]}
          message="Save items you like and find them here later."
          onDismiss={() => setVisible(false)}
          title="Your wishlist"
          visible={visible}
        >
          <Pressable bg="fill.tertiary" borderRadius="medium" onPress={() => setVisible(true)} px="s16" py="s12">
            <RnText variant="labelMedium">Show tip</RnText>
          </Pressable>
        </RnTooltip>
      </Box>
    </Section>
  )
}

export const FEEDBACK: CatalogEntry[] = [
  {
    code: '<Progress value={0.35} />\n<Progress circular />',
    Demo: ProgressDemo,
    id: 'progress',
    name: 'Progress',
    summary: 'How far along something is, or that it is still going.',
    tags: NATIVE,
  },
  {
    code: '<ActivityIndicator />\n<ActivityIndicator size="large" />',
    Demo: ActivityIndicatorDemo,
    id: 'activity-indicator',
    name: 'ActivityIndicator',
    summary: 'That something is loading, for as long as it takes.',
    tags: KARA_MODULE,
  },
  {
    code: '<Skeleton h={16} w={160} />',
    Demo: SkeletonDemo,
    id: 'skeleton',
    name: 'Skeleton',
    summary: 'Shimmering placeholders for content on its way.',
    tags: REACT_NATIVE,
  },
  {
    code: '<Snackbar actionLabel="Undo" duration="short" message="Item deleted" onAction={undo} onDismiss={hide} visible={shown} />',
    Demo: SnackbarDemo,
    id: 'snackbar',
    name: 'Snackbar',
    summary: 'A brief message at the bottom of the screen.',
    tags: REACT_NATIVE,
  },
  {
    code: '<Alert title="Delete account?" destructive confirmLabel="Delete" visible={open} onDismiss={close} />',
    Demo: AlertDemo,
    id: 'alert',
    name: 'Alert',
    summary: 'A question that needs an answer before going on.',
    tags: NATIVE,
  },
  {
    code: '<Tooltip text="Free returns within 30 days" visible={shown} onDismiss={hide}>\n  <Text>What is this?</Text>\n</Tooltip>',
    Demo: TooltipDemo,
    id: 'tooltip',
    name: 'Tooltip',
    summary: 'A short hint pointing at what it explains.',
    tags: NATIVE,
  },
  {
    code: '<RnTooltip title="Your wishlist" message="…" visible={shown} onDismiss={hide}>\n  <Button />\n</RnTooltip>',
    Demo: RnTooltipDemo,
    id: 'rn-tooltip',
    name: 'RnTooltip',
    summary: 'A rich tooltip for React Native content.',
    tags: KARA_MODULE,
  },
]
