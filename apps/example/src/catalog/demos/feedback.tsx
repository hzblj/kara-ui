import {
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
  </>
)

const SkeletonDemo = () => (
  <Section caption="Placeholders while content loads.">
    <Box bg="surface.primary" borderRadius="large" flexDirection="row" gap="s12" p="s16">
      <Skeleton borderRadius="full" height={48} width={48} />
      <Box flex={1} gap="s8" justify="center">
        <Skeleton height={16} width={160} />
        <Skeleton height={16} />
      </Box>
    </Box>
  </Section>
)

const SnackbarDemo = () => {
  const [visible, setVisible] = useState(false)

  return (
    <Section caption="A short message with an optional action.">
      <Island>
        <VStack wide>
          <Button
            label={visible ? 'Hide' : 'Delete item'}
            onPress={() => setVisible(value => !value)}
            variant="secondary"
          />
        </VStack>
      </Island>
      <Snackbar actionLabel="Undo" message="Item deleted" onAction={() => setVisible(false)} visible={visible} />
    </Section>
  )
}

const AlertDemo = () => {
  const [visible, setVisible] = useState(false)

  return (
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
  )
}

const TooltipDemo = () => {
  const [visible, setVisible] = useState(false)

  return (
    <Section caption="A popover on iOS. Material shows its tooltip on a long press.">
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
    summary: 'How far along something is — or that it is still going.',
    tags: NATIVE,
  },
  {
    code: '<Skeleton height={16} width={160} />',
    Demo: SkeletonDemo,
    id: 'skeleton',
    name: 'Skeleton',
    summary: 'Shimmering placeholders for content on its way.',
    tags: REACT_NATIVE,
  },
  {
    code: '<Snackbar message="Item deleted" actionLabel="Undo" onAction={undo} visible={shown} />',
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
