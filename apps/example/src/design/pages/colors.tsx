import {
  type BorderToken,
  Box,
  type ColorToken,
  type ContentToken,
  type FillToken,
  gray,
  green,
  orange,
  RnText,
  red,
  type SurfaceToken,
} from '@hzblj/kara-ui'

import {Section} from '../../ui'

const SURFACES: SurfaceToken[] = ['base', 'depth', 'primary', 'high.contrast']
const CONTENTS: ContentToken[] = ['primary', 'secondary', 'tertiary', 'quaternary', 'accent', 'destructive', 'success']
const FILLS: FillToken[] = [
  'accent.primary',
  'accent.base',
  'destructive.primary',
  'destructive.base',
  'success.primary',
  'tertiary',
  'quaternary',
]
const BORDERS: BorderToken[] = ['secondary.base', 'secondary.muted', 'tertiary', 'quinary', 'accent', 'destructive']

const RAMPS = [
  {name: 'Gray', values: gray},
  {name: 'Orange', values: orange},
  {name: 'Red', values: red},
  {name: 'Green', values: green},
] as const

const Swatch = ({name, token}: {name: string; token: ColorToken}) => (
  <Box align="center" flexDirection="row" gap="s12" py="s6">
    <Box bg={token} borderColor="border.tertiary" borderRadius="small" borderWidth={1} h={32} w={48} />
    <RnText variant="subheadline">{name}</RnText>
  </Box>
)

const Group = ({children, title}: {children: React.ReactNode; title: string}) => (
  <Section title={title}>
    <Box bg="surface.primary" borderRadius="large" px="s16" py="s8">
      {children}
    </Box>
  </Section>
)

export const ColorsPage = () => (
  <>
    <Group title="Surface">
      {SURFACES.map(token => (
        <Swatch key={token} name={`surface.${token}`} token={`surface.${token}`} />
      ))}
    </Group>
    <Group title="Content">
      {CONTENTS.map(token => (
        <RnText color={`content.${token}`} key={token} variant="subheadline">
          {`content.${token}`}
        </RnText>
      ))}
    </Group>
    <Group title="Fill">
      {FILLS.map(token => (
        <Swatch key={token} name={`fill.${token}`} token={`fill.${token}`} />
      ))}
    </Group>
    <Group title="Border">
      {BORDERS.map(token => (
        <Swatch key={token} name={`border.${token}`} token={`border.${token}`} />
      ))}
    </Group>
    <Section
      caption="Most tokens are the platform’s own colours (UIKit semantic colours and Material roles), so they adapt by themselves."
      title="Ramps"
    >
      <Box gap="s12">
        {RAMPS.map(ramp => (
          <Box gap="s4" key={ramp.name}>
            <RnText color="content.secondary" variant="footnote">
              {ramp.name}
            </RnText>
            <Box borderRadius="small" flexDirection="row" overflow="hidden">
              {ramp.values.map((color, index) => (
                <Box flex={1} h={28} key={`${ramp.name}-${index}`} style={{backgroundColor: color}} />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Section>
  </>
)
