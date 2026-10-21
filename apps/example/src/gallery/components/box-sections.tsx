import {Box, Island, RnText, RnView, Text, VStack} from '@hzblj/kara-ui'

export const RadiiSection = () => (
  <Box flexDirection="row" gap="s8" wrap="wrap">
    <Box bg="fill.accent.primary" borderRadius="none" h={48} w={48} />
    <Box bg="fill.accent.primary" borderRadius="small" h={48} w={48} />
    <Box bg="fill.accent.primary" borderRadius="medium" h={48} w={48} />
    <Box bg="fill.accent.primary" borderRadius="large" h={48} w={48} />
    <Box bg="fill.accent.primary" borderRadius="full" h={48} w={48} />
  </Box>
)

export const BoxCornerRadiiSection = () => (
  <Box gap="s8">
    <Box align="center" bg="fill.tertiary" borderTopRadius="large" h={48} justify="center" wide>
      <RnText variant="labelMedium">borderTopRadius large</RnText>
    </Box>
    <Box align="center" bg="fill.tertiary" borderBottomRadius="large" h={48} justify="center" wide>
      <RnText variant="labelMedium">borderBottomRadius large</RnText>
    </Box>
    <Box align="center" bg="fill.tertiary" borderBottomRadius="none" borderRadius="large" h={48} justify="center" wide>
      <RnText variant="labelMedium">borderRadius large + borderBottomRadius none</RnText>
    </Box>
    <Box align="center" bg="fill.tertiary" borderTopLeftRadius="full" h={48} justify="center" wide>
      <RnText variant="labelMedium">borderTopLeftRadius full</RnText>
    </Box>
  </Box>
)

export const BoxBordersSection = () => (
  <Box gap="s8">
    <Box borderBottomWidth={1} borderColor="fill.quaternary" pb="s8" wide>
      <RnText variant="labelMedium">borderBottomWidth 1 — a one-sided divider</RnText>
    </Box>
    <Box borderColor="content.accent" borderLeftWidth={3} pl="s8" wide>
      <RnText variant="labelMedium">borderLeftWidth 3 — a quote rule</RnText>
    </Box>
    <Box borderColor="fill.quaternary" borderRadius="medium" borderStyle="dashed" borderWidth={1} p="s12" wide>
      <RnText variant="labelMedium">borderStyle dashed</RnText>
    </Box>
    <Box bg="fill.quaternary" borderRadius="small" p="s8" w="50%">
      <RnText variant="labelMedium">w 50%</RnText>
    </Box>
    <Box align="center" aspectRatio={3} bg="fill.success.primary" borderRadius="small" justify="center" wide>
      <RnText color="content.on.bg" variant="labelMedium">
        aspectRatio 3
      </RnText>
    </Box>
    <Box bg="fill.tertiary" borderRadius="small" maxW={200} minH={56} p="s8">
      <RnText variant="labelMedium">minH 56 · maxW 200</RnText>
    </Box>
  </Box>
)

export const ShadowTokensSection = () => (
  <Island>
    <VStack spacing="s12" wide>
      <VStack bg="surface.primary" borderRadius="medium" p="s12" shadow="card" wide>
        <Text variant="label">shadow card</Text>
      </VStack>
      <VStack bg="surface.primary" borderRadius="medium" p="s12" shadow="snackbar" wide>
        <Text variant="label">shadow snackbar</Text>
      </VStack>
      <VStack bg="surface.primary" borderRadius="medium" p="s12" shadow="input" wide>
        <Text variant="label">shadow input</Text>
      </VStack>
    </VStack>
  </Island>
)

export const RnViewSection = () => (
  /*
    `matchContents` off, with an explicit height, on purpose: RnView drives its SwiftUI frame from the
    child's Yoga-laid-out bounds while an auto-sizing island writes its own measured size back into
    the Yoga style, and the pair loops until the main thread hangs. The label is a SwiftUI Text beside
    the host rather than RN text inside it — see RnViewProps.
  */
  <Island matchContents={false} style={{height: 76}}>
    <VStack bg="surface.primary" borderRadius="medium" p="s8" spacing="s8" wide>
      <Text variant="label">plain RN Boxes below</Text>
      <RnView>
        <Box bg="fill.quaternary" borderRadius="small" flexDirection="row" gap="s8" p="s12">
          <Box bg="fill.accent.primary" borderRadius="small" h={24} w={24} />
          <Box bg="fill.destructive.primary" borderRadius="small" h={24} w={24} />
          <Box bg="fill.success.primary" borderRadius="small" h={24} w={24} />
        </Box>
      </RnView>
    </VStack>
  </Island>
)

export const BoxMarginsSection = () => (
  <Box>
    <Box bg="fill.tertiary" borderRadius="small" mb="s8" p="s12" wide>
      <RnText>mb s8 · flexDirection row below</RnText>
    </Box>
    <Box bg="fill.quaternary" borderRadius="small" flexDirection="row" gap="s8" p="s12" wide>
      <Box bg="fill.accent.primary" borderRadius="small" h={24} w={24} />
      <Box bg="fill.destructive.primary" borderRadius="small" h={24} w={24} />
      <Box bg="fill.success.primary" borderRadius="small" h={24} w={24} />
    </Box>
  </Box>
)
