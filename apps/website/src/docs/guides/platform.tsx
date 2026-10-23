import Link from 'next/link'

import {CodeBlock} from '../../ui/code-block'
import {Inline} from '../../ui/inline'
import {docsStyles} from '../docs-styles'
import {readChangelog} from '../source/changelog'
import type {Guide} from './guide'
import {Callout, Hero, List, P, Section, Table} from './parts'

const docs = docsStyles()

export const icons: Guide = {
  Content: () => (
    <>
      <Hero id="icons" kicker="Core concepts" title="Icons">
        <P>
          {
            'kara ships no icon set and no icon font. Your app brings a folder of SVGs; the config plugin turns each one into an asset-catalog image on iOS and a vector drawable on Android at prebuild, and writes their names as a type, so `<Icon name="bolt" />` only compiles for an icon you have.'
          }
        </P>
      </Hero>

      <Section id="setup" title="Set up">
        <CodeBlock
          code={"plugins: [['@hzblj/kara-ui', {icons: {source: './assets/icons'}}]]"}
          language="ts"
          title="app.config.ts"
        />
        <CodeBlock
          code={
            'assets/icons/bolt.svg   →   <Icon name="bolt" />\nassets/icons/arrow-left.svg   →   <Icon name="arrow-left" />'
          }
          language="bash"
          title="assets/icons"
        />
        <P>
          {
            'The names land in `kara-icons.d.ts` (the global `KaraIcons`) whenever the config is read (`expo start` included), so a new SVG type-checks at once. Commit that file so a fresh clone type-checks too. The native assets still need a prebuild.'
          }
        </P>
      </Section>

      <Section id="svg-rules" title="What an SVG may contain">
        <List
          items={[
            'Single-colour `<path>`s only: the platform tints every icon, with `color` or the surrounding tint. Anything else fails the prebuild, naming the file.',
            '`share.android.svg` replaces `share.svg` on Android (and `.ios.svg` on iOS), for the glyphs the platforms draw differently.',
          ]}
        />
      </Section>

      <Section id="tiers" title="Icon and RnIcon">
        <Table
          columns={['Component', 'Draws', 'Where']}
          rows={[
            [
              '`Icon`',
              'SwiftUI `Image` from the asset catalog, Compose `Icon` with the drawable',
              'Inside a `Screen` or `Island`',
            ],
            ['`RnIcon`', 'A `UIImageView` / `ImageView` of the same asset', 'Anywhere, which is what a list row wants'],
          ]}
        />
        <P>
          {
            'Every prop that takes an icon (`IconButton`, `Fab`, `ListItem`, `Label`, `LabeledContent`, `Link`, `EmptyState`, menu actions, `Tabs`) takes one of these names.'
          }
        </P>
      </Section>

      <Section id="ci" title="Without Expo">
        <P>
          {
            '`kara-icons` validates a folder and writes the declaration without a prebuild: for CI, or a project that has not added the plugin yet.'
          }
        </P>
        <CodeBlock code="npx kara-icons ./assets/icons" language="bash" title="Terminal" />
      </Section>
    </>
  ),
  headings: [
    {id: 'icons', label: 'Icons'},
    {id: 'setup', label: 'Set up'},
    {id: 'svg-rules', label: 'What an SVG may contain'},
    {id: 'tiers', label: 'Icon and RnIcon'},
    {id: 'ci', label: 'Without Expo'},
  ],
  id: 'icons',
}

const HAPTICS_INSTALL = 'npx expo install @hzblj/expo-rich-haptics'

const HAPTICS_USAGE = `import {haptics, useHapticFeedback} from '@hzblj/expo-rich-haptics'

haptics.success()                   // a name you know: one function per haptic
haptics.play(haptic)                // a name that arrives as data
haptics.light({intensity: 0.6})     // impacts scale
haptics.prepare('selection')        // iOS: warm the Taptic Engine as a gesture begins
haptics.setEnabled(userPreference)  // silences every haptic, kara's components' own too

// Plays on every change of a value, never on mount.
useHapticFeedback(selectedIndex, 'selection')
useHapticFeedback(count, (previous, next) => (next > previous ? 'tick' : false))`

const HAPTICS_PATTERN = `const heartbeat: HapticPattern = [
  {primitive: 'thud'},
  {at: 140, intensity: 0.6, primitive: 'thud'},
]

haptics.play(heartbeat)`

export const haptics: Guide = {
  Content: () => (
    <>
      <Hero id="haptics" kicker="Core concepts" title="Haptics">
        <P>
          {
            'kara plays its haptics through [@hzblj/expo-rich-haptics](https://github.com/hzblj/expo-rich-haptics), a package of its own that any Expo app can use. Names play the platform’s own feedback: UIKit’s feedback generators on iOS, the system’s haptic feedback constants on Android. Patterns of your own play Android’s haptic primitives, which iOS builds with Core Haptics. Never a raw vibration, and every call is synchronous.'
          }
        </P>
      </Hero>

      <Section id="usage" title="Usage">
        <P>
          {
            'kara depends on the package, so its components play haptics with nothing to set up. To play them yourself, add it to the app, so your calls and kara’s share one `setEnabled`.'
          }
        </P>
        <CodeBlock code={HAPTICS_INSTALL} language="bash" />
        <CodeBlock code={HAPTICS_USAGE} language="ts" />
        <Callout>
          {'Haptics are felt, not seen: the simulator and the emulator play nothing. Check them on a device.'}
        </Callout>
      </Section>

      <Section id="names" title="Haptics">
        <Table
          columns={['Name', 'For']}
          rows={[
            ['`selection`', 'A choice changed: a segment, a chip, a picker row.'],
            ['`tick`', 'One step of a continuous gesture: a slider detent, a scrubbed value.'],
            ['`toggleOn`, `toggleOff`', 'A switch flipped.'],
            ['`success`, `warning`, `error`', 'How a task ended.'],
            ['`longPress`, `dragStart`', 'A long press was recognised; an item lifted to be dragged.'],
            ['`thresholdActivate`, `thresholdDeactivate`', 'A gesture crossed its commit point, or went back over it.'],
            ['`keyPress`', 'A key of the app’s own keypad.'],
            [
              '`soft`, `light`, `medium`, `rigid`, `heavy`',
              'A collision none of the names above describes. `intensity` scales them.',
            ],
          ]}
        />
        <P>
          {
            'On Android the names that came with Android 14 fall back to the nearest older feedback, so every name plays on every version.'
          }
        </P>
      </Section>

      <Section id="patterns" title="Patterns">
        <P>
          {
            'A pattern is a list of events on one timeline: a primitive (`click`, `tick`, `lowTick`, `thud`, `spin`, `quickRise`, `slowRise`, `quickFall`), when it starts in milliseconds and how strong it is. Each Android device plays the primitives as its manufacturer tuned them; iOS builds the same ones from Core Haptics events.'
          }
        </P>
        <CodeBlock code={HAPTICS_PATTERN} language="ts" />
        <P>
          {
            'The [package’s README](https://github.com/hzblj/expo-rich-haptics#readme) has every primitive, and what each platform plays where a device lacks one.'
          }
        </P>
      </Section>

      <Section id="components" title="In the components">
        <P>
          {
            'A component plays a haptic only where the platform’s own control would and kara’s does not. Compose’s Material controls play none, so on Android `Switch` plays `toggleOn` and `toggleOff`, a stepped `Slider` ticks at every stop, `SegmentedControl` plays `selection` and `ContextMenu` its long press. iOS’s controls keep their own feedback. `Chip` plays `selection`, and `Pressable` plays whatever its `haptic` names.'
          }
        </P>
      </Section>
    </>
  ),
  headings: [
    {id: 'haptics', label: 'Haptics'},
    {id: 'usage', label: 'Usage'},
    {id: 'names', label: 'Haptics'},
    {id: 'patterns', label: 'Patterns'},
    {id: 'components', label: 'In the components'},
  ],
  id: 'haptics',
}

const NAVIGATION_THEME = `import {useAppTheme} from '@hzblj/kara-ui'
import {navigationTheme} from '@hzblj/kara-ui/router'
import {ThemeProvider} from 'expo-router'

const Navigation = ({children}: {children: ReactNode}) => {
  const theme = useAppTheme()
  const value = useMemo(() => navigationTheme(theme), [theme])

  return <ThemeProvider value={value}>{children}</ThemeProvider>
}`

export const router: Guide = {
  Content: () => (
    <>
      <Hero id="router" kicker="Core concepts" title="Expo Router">
        <P>
          {
            'What needs Expo Router lives in its own entry point, `@hzblj/kara-ui/router`, so the main entry never imports it. Install `expo-router` to use it.'
          }
        </P>
      </Hero>

      <Section id="navigation-theme" title="navigationTheme">
        <P>
          {
            'Maps the kara theme onto Expo Router’s `ThemeProvider`, so headers, backgrounds and tab bars take the same colours as everything else. It sits inside `KaraProvider`, where the platform’s half of the palette is resolved.'
          }
        </P>
        <CodeBlock code={NAVIGATION_THEME} />
      </Section>

      <Section id="tabs" title="Tabs">
        <p>
          <Inline text="Native tabs for a layout route, on Expo Router’s native tabs. See [Tabs](/docs/components/tabs)." />
        </p>
      </Section>

      <Section id="zoom-transition" title="ZoomTransition">
        <p>
          <Inline text="A push that grows out of the view it was opened from and shrinks back into it. See [ZoomTransition](/docs/components/zoom-transition)." />
        </p>
      </Section>

      <Section id="rules" title="Rules">
        <List
          items={[
            'Nothing may come from the standalone `@react-navigation/*` packages: Expo Router vendors its own fork, and a navigator built against the npm copies throws “Couldn’t register the navigator”.',
            'Every child route of a `Tabs` layout needs a `Tabs.Screen`; a component that merely renders one is invisible to the navigator.',
          ]}
        />
      </Section>
    </>
  ),
  headings: [
    {id: 'router', label: 'Expo Router'},
    {id: 'navigation-theme', label: 'navigationTheme'},
    {id: 'tabs', label: 'Tabs'},
    {id: 'zoom-transition', label: 'ZoomTransition'},
    {id: 'rules', label: 'Rules'},
  ],
  id: 'router',
}

export const changelog: Guide = {
  Content: () => (
    <>
      <Hero id="changelog" kicker="Reference" title="Changelog">
        <P>{'Every release of `@hzblj/kara-ui`. All kara packages are versioned together.'}</P>
      </Hero>
      <section className={docs.section()} id="releases">
        <div className="grid">
          {readChangelog().map(release => (
            <article
              className={docs.changelogRelease()}
              id={`v${release.version.replaceAll('.', '-')}`}
              key={release.version}
            >
              <div className={docs.changelogVersionRow()}>
                <h2 className={docs.changelogVersion()}>{release.version}</h2>
                {release.groups.map(group => (
                  <span className={docs.changelogTag()} key={group.label}>
                    {group.label.replace(' Changes', '')}
                  </span>
                ))}
              </div>
              <div className={docs.changelogEntries()}>
                {release.groups.flatMap(group =>
                  group.entries.map(entry => (
                    <div className={docs.changelogEntry()} key={`${group.label}:${entry.paragraphs[0]}`}>
                      {entry.paragraphs.map(paragraph => (
                        <p className={docs.changelogParagraph()} key={paragraph}>
                          <Inline text={paragraph} />
                        </p>
                      ))}
                      {entry.items.length > 0 ? (
                        <ul className={docs.changelogItems()}>
                          {entry.items.map(item => (
                            <li key={item}>
                              <Inline text={item} />
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {entry.commit ? (
                        <Link className={docs.changelogCommit()} href={entry.commit.href}>
                          {entry.commit.sha}
                        </Link>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  ),
  headings: [
    {id: 'changelog', label: 'Changelog'},
    ...readChangelog().map(release => ({id: `v${release.version.replaceAll('.', '-')}`, label: release.version})),
  ],
  id: 'changelog',
}
