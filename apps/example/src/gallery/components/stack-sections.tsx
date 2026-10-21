import {Divider, HStack, Island, Spacer, Text, VStack, ZStack} from '@hzblj/kara-ui'

export const VStackSection = () => (
  <Island>
    <VStack align="center" bg="surface.primary" borderRadius="medium" p="s12" spacing="s8" wide>
      <Text variant="label">align center</Text>
      <Text variant="label">spacing s8</Text>
    </VStack>
  </Island>
)

export const HStackSection = () => (
  <Island>
    <HStack align="center" bg="surface.primary" borderRadius="medium" p="s12" wide>
      <Text variant="label">leading</Text>
      <Spacer />
      <Text variant="label">trailing</Text>
    </HStack>
  </Island>
)

export const ZStackSection = () => (
  <Island>
    <ZStack bg="fill.accent.primary" borderRadius="medium" h={80} wide align="center">
      <Text color="content.on.bg" variant="headingXs">
        centred over accent
      </Text>
    </ZStack>
  </Island>
)

export const DividerSection = () => (
  <Island>
    <VStack spacing="s8" wide>
      <Text variant="label">above</Text>
      <Divider />
      <Text variant="label">below</Text>
    </VStack>
  </Island>
)
