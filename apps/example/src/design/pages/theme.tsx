import {Button, HStack, Island, Progress, Slider, Switch, VStack} from '@hzblj/kara-ui'
import {useState} from 'react'

import {AccentControl, ThemePreferenceControl} from '../../appearance'
import {CodeBlock, Section} from '../../ui'

const THEME_CODE = `const theme = defineTheme({
  colors: {fill: {accent: {primary: '#4f46e5'}}},
  fonts: {text: {regular: 'Inter-Regular', medium: 'Inter-Medium'}},
  dynamicColor: true, // Material You on Android 12+
})

<KaraProvider theme={theme} themePreference="system">`

const Preview = () => {
  const [on, setOn] = useState(true)
  const [value, setValue] = useState(0.6)

  return (
    <Island>
      <VStack bg="surface.primary" borderRadius="large" p="s16" spacing="s16" wide>
        <Switch label="Notifications" onValueChange={setOn} value={on} />
        <Slider onValueChange={setValue} value={value} />
        <Progress value={value} />
        <HStack spacing="s8" wide>
          <Button label="Accent" />
        </HStack>
      </VStack>
    </Island>
  )
}

export const ThemePage = () => (
  <>
    <Section
      caption="System follows the device. Light and dark pin it, for both native and React Native views."
      title="Appearance"
    >
      <ThemePreferenceControl testID="theme-preference" />
    </Section>
    <Section
      caption="Each accent is a defineTheme override of the accent tokens. Wallpaper is Material You on Android 12+; iOS keeps the default accent."
      title="Accent"
    >
      <AccentControl testID="theme-accent" />
    </Section>
    <Section caption="Everything here — and across the app — follows along." title="Preview">
      <Preview />
    </Section>
    <Section caption="Override values, never names: every token keeps type-checking." title="Your own theme">
      <CodeBlock code={THEME_CODE} />
    </Section>
  </>
)
