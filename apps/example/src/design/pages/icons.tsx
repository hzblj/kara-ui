import {Box, HStack, Icon, type IconName, Island, RnIcon} from '@hzblj/kara-ui'

import {CodeBlock, Section} from '../../ui'

const ICONS: IconName[] = [
  'home',
  'search',
  'heart',
  'star',
  'share',
  'notification',
  'settings',
  'user',
  'calendar',
  'lock',
  'trash',
  'bolt',
]

export const IconsPage = () => (
  <>
    <Section
      caption="Each is an SVG in this app’s assets/icons, turned into an asset-catalog image on iOS and a vector drawable on Android at build time."
      title="This app’s icons"
    >
      <Island>
        <HStack spacing="s16" wide>
          {ICONS.slice(0, 6).map(name => (
            <Icon key={name} name={name} />
          ))}
        </HStack>
      </Island>
      <Box flexDirection="row" gap="s16">
        {ICONS.slice(6).map(name => (
          <RnIcon key={name} name={name} />
        ))}
      </Box>
    </Section>
    <Section
      caption="Add an SVG, and its name type-checks at once; rebuild to get the native asset."
      title="Add your own"
    >
      <CodeBlock code={"// app.config.ts\nplugins: [['@hzblj/kara-ui', {icons: {source: './assets/icons'}}]]"} />
      <CodeBlock code={'assets/icons/bolt.svg  →  <Icon name="bolt" />'} />
    </Section>
  </>
)
