import {
  type BorderToken,
  Box,
  blackAlpha,
  type ContentToken,
  type FillToken,
  gray,
  green,
  orange,
  type ResolvedColor,
  RnText,
  red,
  type ShadowName,
  type SurfaceToken,
  shadowNames,
  type TextVariant,
  textStyles,
  useAppTheme,
  whiteAlpha,
} from '@hzblj/kara-ui'
import type {ReactNode} from 'react'

const RAMPS = [
  {name: 'gray', values: gray},
  {name: 'orange', values: orange},
  {name: 'red', values: red},
  {name: 'green', values: green},
  {name: 'blackAlpha', values: blackAlpha},
  {name: 'whiteAlpha', values: whiteAlpha},
] as const

const SURFACES: SurfaceToken[] = ['base', 'depth', 'primary', 'high.contrast']

const CONTENTS: ContentToken[] = ['primary', 'secondary', 'tertiary', 'quaternary', 'accent', 'destructive', 'success']

const FILLS: FillToken[] = [
  'tertiary',
  'quaternary',
  'accent.primary',
  'accent.base',
  'destructive.primary',
  'destructive.base',
  'success.primary',
]

const BORDERS: BorderToken[] = ['secondary.base', 'secondary.muted', 'tertiary', 'quinary', 'accent', 'destructive']

const SHADOWS: ShadowName[] = shadowNames

const VARIANTS = Object.keys(textStyles) as TextVariant[]

const GroupLabel = ({children}: {children: ReactNode}) => (
  <RnText color="content.tertiary" variant="captionMedium">
    {children}
  </RnText>
)

const Swatch = ({color}: {color: ResolvedColor}) => <Box h={24} style={{backgroundColor: color}} w={14} />

const Ramp = ({name, values}: {name: string; values: readonly string[]}) => (
  <Box gap="s6">
    <GroupLabel>
      {name} · {values.length} steps
    </GroupLabel>
    <Box flexDirection="row" wrap="wrap">
      {values.map((color, index) => (
        <Swatch color={color} key={`${name}-${index}`} />
      ))}
    </Box>
  </Box>
)

const ColorRow = ({children, color}: {children: string; color: ResolvedColor}) => (
  <Box align="center" flexDirection="row" gap="s8">
    <Box
      borderColor="fill.quaternary"
      borderRadius="small"
      borderWidth={1}
      h={24}
      style={{backgroundColor: color}}
      w={48}
    />
    <RnText color="content.secondary" variant="cardSubtitle">
      {children}
    </RnText>
  </Box>
)

export const TokenGrid = () => {
  const theme = useAppTheme()

  return (
    <Box gap="s20">
      <RnText variant="headline">Design tokens · {theme.dark ? 'dark' : 'light'}</RnText>

      {RAMPS.map(ramp => (
        <Ramp key={ramp.name} name={ramp.name} values={ramp.values} />
      ))}

      <Box gap="s6">
        <GroupLabel>surface.*</GroupLabel>
        {SURFACES.map(token => (
          <ColorRow color={theme.color(`surface.${token}`)} key={token}>
            {token}
          </ColorRow>
        ))}
      </Box>

      <Box gap="s6">
        <GroupLabel>content.* — on surface.base</GroupLabel>
        <Box bg="surface.base" p="s8">
          {CONTENTS.map(token => (
            <RnText color={`content.${token}`} key={token} variant="subheadline">
              content.{token} — žluťoučký kůň
            </RnText>
          ))}
        </Box>
      </Box>

      <Box gap="s6">
        <GroupLabel>fill.*</GroupLabel>
        {FILLS.map(token => (
          <ColorRow color={theme.color(`fill.${token}`)} key={token}>
            {token}
          </ColorRow>
        ))}
      </Box>

      <Box gap="s6">
        <GroupLabel>border.*</GroupLabel>
        {BORDERS.map(token => (
          <ColorRow color={theme.color(`border.${token}`)} key={token}>
            {token}
          </ColorRow>
        ))}
      </Box>

      <Box gap="s6">
        <GroupLabel>shadow.* — via the Box shadow token (ring + drop, no inset)</GroupLabel>
        {SHADOWS.map(name => (
          <Box bg="surface.primary" borderRadius="medium" key={name} my="s6" p="s12" shadow={name}>
            <RnText variant="cardSubtitle">{name}</RnText>
          </Box>
        ))}
      </Box>

      <Box gap="s6">
        <GroupLabel>textStyles.* — {VARIANTS.length} variants</GroupLabel>
        {VARIANTS.map(variant => (
          <RnText key={variant} variant={variant}>
            {variant} · Příšerně žluťoučký kůň
          </RnText>
        ))}
      </Box>
    </Box>
  )
}
