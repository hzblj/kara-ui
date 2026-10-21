import {Button, type ButtonVariant, Island, Text, type TextVariant, textStyles, VStack} from '@hzblj/kara-ui'

export const TEXT_VARIANTS = Object.keys(textStyles) as TextVariant[]

const BUTTON_VARIANTS: ButtonVariant[] = ['accent', 'secondary', 'destructive', 'glass']

const TextVariantRow = ({variant}: {variant: TextVariant}) => <Text variant={variant}>{variant}</Text>

const ButtonRow = ({variant}: {variant: ButtonVariant}) => <Button label={variant} variant={variant} />

const DisabledButtonRow = ({variant}: {variant: ButtonVariant}) => (
  <Button disabled label={`${variant} disabled`} variant={variant} />
)

export const TextVariantsSection = () => (
  <Island>
    <VStack bg="surface.primary" borderRadius="medium" p="s12" spacing="s2" wide>
      {TEXT_VARIANTS.map(variant => (
        <TextVariantRow key={variant} variant={variant} />
      ))}
    </VStack>
  </Island>
)

export const TextStylesSection = () => (
  <Island>
    <VStack bg="surface.primary" borderRadius="medium" p="s12" spacing="s4" wide>
      <Text color="content.accent">content.accent</Text>
      <Text color="content.destructive">content.destructive</Text>
      <Text color="content.success">content.success</Text>
      <Text color="content.tertiary">content.tertiary</Text>
      <Text align="center">align center</Text>
      <Text align="right">align right</Text>
      <Text transform="uppercase">transform uppercase</Text>
      <Text decoration="underline">decoration underline</Text>
      <Text decoration="strikethrough">decoration strikethrough</Text>
      <Text numberOfLines={1}>numberOfLines 1 — příšerně žluťoučký kůň úpěl ďábelské ódy a nikdo ho neposlouchal</Text>
    </VStack>
  </Island>
)

export const ButtonSection = () => (
  <Island>
    <VStack spacing="s8" wide>
      {BUTTON_VARIANTS.map(variant => (
        <ButtonRow key={variant} variant={variant} />
      ))}
      {BUTTON_VARIANTS.map(variant => (
        <DisabledButtonRow key={`${variant}-disabled`} variant={variant} />
      ))}
      <Button label="glass tinted" tint="fill.accent.primary" variant="glass" />
      <Button buttonStyle="glassProminent" label="glass prominent tinted" tint="fill.accent.primary" />
      <Button buttonStyle="glassProminent" label="glass prominent muted" tint="fill.accent.base" />
    </VStack>
  </Island>
)
