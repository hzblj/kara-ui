import {CodeBlock} from '../../ui/code-block'
import {PropsTable} from '../components/props-table'
import type {Guide} from './guide'
import {Callout, Hero, P, Section, Table} from './parts'

const ONE_SURFACE = `<VStack bg="fill.accent.base" borderRadius="large" p="s16" wide>   {/* SwiftUI / Compose modifiers */}
<Box bg="fill.accent.base" borderRadius="large" p="s16">             {/* a React Native style */}`

const BUCKETS = `<HStack
  borderRadius="large"
  ios={{glass: 'regular'}}
  android={{weight: 1}}
  p="s16"
/>`

const SHORTHANDS = `<Box row wrap gap="s8">{tags}</Box>             {/* flexDirection row, flexWrap wrap */}
<Box center size={48} borderRadius="full" />   {/* centred children, a 48 pt square */}
<Box absolute bg="fill.accent.base" />        {/* over its parent, all four edges at 0 */}
<Box fill />                                   {/* flex: 1, the room left in its parent */}
<Box grow shrink />                            {/* flexGrow 1, flexShrink 1 */}`

const RESPONSIVE = `<Box gap="s16" p={{base: 's16', md: 's32'}} row={{base: false, md: true}} />`

const OWN = `import {sx} from '@hzblj/kara-ui'
import {Image as ExpoImage} from 'expo-image'

/** Any component that takes \`style\`, wrapped once, at module scope. */
export const Photo = sx(ExpoImage)

<Photo borderRadius="large" h={220} source={photo} w="100%" />`

export const styling: Guide = {
  Content: () => (
    <>
      <Hero id="styling" kicker="Core concepts" title="Styling with sx">
        <P>
          {
            'Every kara component is styled through props, and every value is a token: `p="s16"`, `bg="surface.primary"`, `borderRadius="large"`. One `sx` surface resolves to SwiftUI modifiers on iOS, Compose modifiers on Android, or a React Native style, so call sites never branch on the platform. A raw number or hex where a token belongs does not type-check.'
          }
        </P>
      </Hero>

      <Section id="one-surface" title="One surface, three targets">
        <CodeBlock code={ONE_SURFACE} />
        <P>
          {
            'The two lines look alike and resolve differently: the native stack becomes a background, a clip and padding modifiers; the `Box` becomes a `View` style. Both read the same tokens from the same theme.'
          }
        </P>
        <Callout>
          {
            'There are **two surfaces, and they are not interchangeable**. Native components take the native `sx`: only what SwiftUI and Compose both honour. `Box` and the React Native tier take the wider view `sx`, with flexbox, `gap`, margins and per-corner radii. `gap` on a `VStack` does not compile; it wants `spacing`.'
          }
        </Callout>
      </Section>

      <Section id="native" title="Native sx">
        <P>{'What every native component takes, with the same meaning on both platforms.'}</P>
        <PropsTable name="SxCore" />
      </Section>

      <Section id="platform-buckets" title="Platform buckets">
        <P>
          {
            'What only one platform can express goes in its own bucket: `ios` for SwiftUI modifiers with no honest Compose counterpart, `android` for the reverse. A bucket is inert on the other platform rather than a type error, so a call site never has to branch.'
          }
        </P>
        <CodeBlock code={BUCKETS} />
        <h3>ios</h3>
        <PropsTable name="IosSx" />
        <h3>android</h3>
        <PropsTable name="AndroidSx" />
      </Section>

      <Section id="react-native" title="React Native sx">
        <P>
          {
            'The React Native tier (`Box`, `Pressable`, `GlassView`, the `Rn*` views) takes everything above except the buckets, plus the layout only a React Native style has. Lengths there may also be percentages: `w="50%"`.'
          }
        </P>
        <h3>Shorthands</h3>
        <P>
          {
            'The layouts written every day have a word of their own: `row`, `wrap`, `center`, `fill`, `absolute` and `size`, with `grow` and `shrink` taking `true`. Each one gives way to the key it stands in for, so `row flexDirection="column"` is a column, and `absolute top={16}` keeps its own top.'
          }
        </P>
        <CodeBlock code={SHORTHANDS} />
        <h3>Flex</h3>
        <PropsTable name="ViewFlexSx" />
        <h3>Margins</h3>
        <PropsTable name="ViewMarginSx" />
        <h3>Position and overflow</h3>
        <PropsTable name="ViewLayoutSx" />
        <h3>Sizing</h3>
        <PropsTable name="ViewSizingSx" />
        <h3>Borders and corners</h3>
        <PropsTable name="ViewBorderSx" />
        <PropsTable name="ViewRadiiSx" />
      </Section>

      <Section id="responsive" title="Responsive values">
        <P>
          {
            'Layout keys take a value per breakpoint (mobile first, from `base` up) as well as a single one. Colours, radii, shadows and the platform buckets stay scalar.'
          }
        </P>
        <CodeBlock code={RESPONSIVE} />
        <Table
          columns={['Breakpoint', 'From']}
          rows={[
            ['`base`', '0'],
            ['`sm`', '576'],
            ['`md`', '768'],
            ['`lg`', '992'],
            ['`xl`', '1200'],
          ]}
        />
      </Section>

      <Section id="opacity" title="Dimmed colours">
        <P>
          {
            'A colour token takes an opacity token after a colon: `bg="fill.accent.base:o50"`. It multiplies whatever the colour already is. Tokens iOS resolves by name (UIKit semantic colours) have no alpha to multiply, so only the ones kara owns the value of can be dimmed; the types say which.'
          }
        </P>
      </Section>

      <Section id="your-components" title="Your own components">
        <P>
          {
            '`sx(Component)` gives any component that takes `style` the same props, memoised. `useSx` and `useSplitSx` are the hooks underneath, for a component that owns its `style` prop.'
          }
        </P>
        <CodeBlock code={OWN} />
      </Section>
    </>
  ),
  headings: [
    {id: 'styling', label: 'Styling with sx'},
    {id: 'one-surface', label: 'One surface'},
    {id: 'native', label: 'Native sx'},
    {id: 'platform-buckets', label: 'Platform buckets'},
    {id: 'react-native', label: 'React Native sx'},
    {id: 'responsive', label: 'Responsive values'},
    {id: 'opacity', label: 'Dimmed colours'},
    {id: 'your-components', label: 'Your own components'},
  ],
  id: 'styling',
}
