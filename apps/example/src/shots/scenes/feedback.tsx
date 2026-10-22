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

import type {Scene} from '../shot.types'
import {useOpened} from '../use-timeline'

const noop = () => undefined

/** Fills from 60 % to full, starts over from empty and comes back round to 60 % — one loop per period. */
const ProgressScene: Scene = ({phase}) => (
  <Island>
    <VStack spacing="s24" wide>
      <Progress value={(0.6 + phase) % 1} />
      <Progress />
      <HStack spacing="s24">
        <Progress circular value={(0.6 + phase) % 1} />
        <Progress circular />
      </HStack>
    </VStack>
  </Island>
)

const ActivityIndicatorScene: Scene = () => (
  <Box align="center" bg="surface.primary" borderRadius="large" flexDirection="row" gap="s12" justify="center" p="s20">
    <ActivityIndicator />
    <RnText color="content.secondary" variant="body">
      Loading your orders…
    </RnText>
  </Box>
)

const SkeletonRow = () => (
  <Box flexDirection="row" gap="s12">
    <Skeleton borderRadius="full" height={48} width={48} />
    <Box flex={1} gap="s8" justify="center">
      <Skeleton height={14} width={140} />
      <Skeleton height={14} />
    </Box>
  </Box>
)

const SkeletonScene: Scene = () => (
  <Box bg="surface.primary" borderRadius="large" gap="s20" p="s16">
    <SkeletonRow />
    <SkeletonRow />
  </Box>
)

const SnackbarScene: Scene = ({step}) => (
  <Box h={220}>
    <Box bg="surface.primary" borderRadius="large" gap="s4" p="s16">
      <RnText variant="headline">Air Max 90</RnText>
      <RnText color="content.secondary" variant="footnote">
        Removed from your wishlist
      </RnText>
    </Box>
    <Snackbar actionLabel="Undo" message="Item deleted" onAction={noop} visible={step === 0} />
  </Box>
)

const AlertScene: Scene = ({step}) => {
  const visible = useOpened(step === 0)

  return (
    <Island>
      <VStack wide>
        <Button label="Delete account" variant="destructive" wide />
        <Alert
          confirmLabel="Delete"
          destructive
          message="This removes your orders and wishlist. It cannot be undone."
          onDismiss={noop}
          title="Delete account?"
          visible={visible}
        />
      </VStack>
    </Island>
  )
}

const TooltipScene: Scene = ({step}) => {
  const visible = useOpened(step === 0)

  return (
    <Island>
      {/* Centred, so the tip above it is too. */}
      <VStack align="center" wide>
        <Tooltip onDismiss={noop} text="Free returns within 30 days" visible={visible}>
          <HStack py="s8">
            <Text color="content.accent" variant="labelMedium">
              What is this?
            </Text>
          </HStack>
        </Tooltip>
      </VStack>
    </Island>
  )
}

const RnTooltipScene: Scene = ({step}) => {
  const visible = useOpened(step === 0)

  return (
    <Box align="center" h={200}>
      <RnTooltip
        actions={[{label: 'Got it', onPress: noop}]}
        message="Save items you like and find them here later."
        onDismiss={noop}
        title="Your wishlist"
        visible={visible}
      >
        <Pressable bg="fill.tertiary" borderRadius="medium" onPress={noop} px="s16" py="s12">
          <RnText variant="labelMedium">Show tip</RnText>
        </Pressable>
      </RnTooltip>
    </Box>
  )
}

export const FEEDBACK_SCENES = {
  'activity-indicator': ActivityIndicatorScene,
  alert: AlertScene,
  progress: ProgressScene,
  'rn-tooltip': RnTooltipScene,
  skeleton: SkeletonScene,
  snackbar: SnackbarScene,
  tooltip: TooltipScene,
}
