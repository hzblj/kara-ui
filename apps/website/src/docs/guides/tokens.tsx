import {tv} from 'tailwind-variants'

import {type ColorSource, readTokens} from '../source/tokens'
import type {Guide} from './guide'
import {Hero, P, Section} from './parts'

const styles = tv({
  slots: {
    bar: 'h-3 rounded-sm bg-fill-accent-primary/80',
    cell: 'border-t border-border-secondary px-4 py-2.5 align-middle text-[13px] text-content-secondary',
    code: 'font-mono text-[12px] text-content-primary',
    family: 'mb-3 mt-8 text-[13px] font-semibold uppercase tracking-[0.08em] text-content-tertiary first:mt-0',
    head: 'bg-surface-secondary px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-content-tertiary',
    muted: 'font-mono text-[11.5px] text-content-tertiary',
    radius: 'size-9 border border-content-quaternary bg-fill-accent-soft',
    source: 'inline-flex items-center gap-1.5 font-mono text-[11.5px] text-content-secondary',
    swatch: 'inline-block size-4 shrink-0 rounded-[5px] border border-black/10 dark:border-white/15',
    table: 'w-full min-w-[620px] border-collapse',
    wrap: 'overflow-x-auto rounded-xl border border-border-secondary bg-surface-primary',
  },
})

const s = styles()

const Swatch = ({color}: {color: string}) => <span className={s.swatch()} style={{background: color}} />

/** One swatch for a colour that is the same in both appearances, light then dark for one that is not. */
const Appearances = ({dark, light}: {dark?: string; light?: string}) => {
  const differs = Boolean(light && dark && light !== dark)

  return (
    <span className={s.source()}>
      {light ? <Swatch color={light} /> : null}
      {dark && differs ? <Swatch color={dark} /> : null}
      <span>{differs ? `${light} / ${dark}` : (light ?? dark)}</span>
    </span>
  )
}

/** What a token is on one platform: a system colour by name, or the hex values kara owns. */
const PlatformSource = ({platform, source}: {platform: 'android' | 'ios'; source: ColorSource}) => {
  if (source.kind === 'hex') {
    return <Appearances dark={source.value} light={source.value} />
  }

  if (source.kind === 'adaptive') {
    return <Appearances dark={source.dark} light={source.light} />
  }

  const name = source[platform]

  return name ? (
    <span className={s.source()}>{platform === 'ios' ? `UIKit ${name}` : `Material ${name}`}</span>
  ) : (
    <Appearances dark={source.dark} light={source.light} />
  )
}

const Head = ({columns}: {columns: string[]}) => (
  <thead>
    <tr>
      {columns.map(column => (
        <th className={s.head()} key={column}>
          {column}
        </th>
      ))}
    </tr>
  </thead>
)

const Colours = () => {
  const {colors} = readTokens()
  const families = [...new Set(colors.map(token => token.name.split('.')[0] ?? ''))]

  return (
    <>
      {families.map(family => (
        <div key={family}>
          <p className={s.family()}>{family}</p>
          <div className={s.wrap()}>
            <table className={`${s.table()} table-fixed`}>
              <colgroup>
                <col className="w-[34%]" />
                <col className="w-[33%]" />
                <col className="w-[33%]" />
              </colgroup>
              <Head columns={['Token', 'iOS', 'Android']} />
              <tbody>
                {colors
                  .filter(token => token.name.startsWith(`${family}.`))
                  .map(token => (
                    <tr key={token.name}>
                      <td className={s.cell()}>
                        <code className={s.code()}>{token.name}</code>
                      </td>
                      <td className={s.cell()}>
                        <PlatformSource platform="ios" source={token.source} />
                      </td>
                      <td className={s.cell()}>
                        <PlatformSource platform="android" source={token.source} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </>
  )
}

const Scale = ({
  entries,
  render,
  unit,
}: {
  entries: [string, number][]
  render?: (value: number) => React.ReactNode
  unit: string
}) => (
  <div className={s.wrap()}>
    <table className={s.table()}>
      <Head columns={render ? ['Token', 'Value', ''] : ['Token', 'Value']} />
      <tbody>
        {entries.map(([name, value]) => (
          <tr key={name}>
            <td className={s.cell()}>
              <code className={s.code()}>{name}</code>
            </td>
            <td className={s.cell()}>
              <span className={s.muted()}>{`${value}${unit}`}</span>
            </td>
            {render ? <td className={`${s.cell()} w-1/2`}>{render(value)}</td> : null}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const Typography = () => (
  <div className={s.wrap()}>
    <table className={s.table()}>
      <Head columns={['Variant', 'Size / line', 'Weight', 'Grows with', 'Sample']} />
      <tbody>
        {readTokens().textStyles.map(style => (
          <tr key={style.name}>
            <td className={s.cell()}>
              <code className={s.code()}>{style.name}</code>
            </td>
            <td className={s.cell()}>
              <span className={s.muted()}>{`${style.fontSize} / ${style.lineHeight}`}</span>
            </td>
            <td className={s.cell()}>
              <span className={s.muted()}>{`${style.weight}${style.role === 'display' ? ' · display' : ''}`}</span>
            </td>
            <td className={s.cell()}>
              <span className={s.muted()}>{style.scalesWith}</span>
            </td>
            <td className={s.cell()}>
              <span
                className="block max-w-[260px] truncate text-content-primary"
                style={{
                  fontSize: Math.min(style.fontSize, 32),
                  fontWeight: {bold: 700, medium: 500, regular: 400, semibold: 600}[style.weight],
                  letterSpacing: style.fontSize >= 24 ? '-0.02em' : undefined,
                  lineHeight: `${Math.min(style.lineHeight, 40)}px`,
                }}
              >
                Order summary
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export const tokens: Guide = {
  Content: () => {
    const {breakpoints, durations, opacity, radii, spacing} = readTokens()

    return (
      <>
        <Hero id="tokens" kicker="Core concepts" title="Design tokens">
          <P>
            {
              'Every value an `sx` prop takes, read straight from `@hzblj/kara-theme` when this page was built. Colours are named by what they are for; whose colour each one is — the platform’s, or a hex kara owns — is the value’s business.'
            }
          </P>
        </Hero>

        <Section id="colours" title="Colours">
          <P>
            {
              'A system name resolves on the device — so it follows the user’s appearance, contrast setting and, on Android, the Material scheme. Swatches show light, then dark, for the colours kara owns. Any colour can be overridden in the theme.'
            }
          </P>
          <Colours />
        </Section>

        <Section id="spacing" title="Spacing">
          <P>{'Padding, margins, `gap`, `spacing`, an icon’s size. Points on iOS, dp on Android.'}</P>
          <Scale
            entries={spacing}
            render={value => <span className={s.bar()} style={{display: 'block', width: Math.max(1, value * 2.5)}} />}
            unit=""
          />
        </Section>

        <Section id="radii" title="Radii">
          <Scale
            entries={radii}
            render={value => (
              <span className={s.radius()} style={{borderRadius: Math.min(value, 18), display: 'block'}} />
            )}
            unit=""
          />
        </Section>

        <Section id="typography" title="Typography">
          <P>
            {
              'Every variant is set in the platform’s face unless the theme names one, and grows with the user’s text size the way the platform style beside it does.'
            }
          </P>
          <Typography />
        </Section>

        <Section id="opacity" title="Opacity">
          <P>{'For `opacity`, and after a colon on a colour token: `fill.accent.base:o50`.'}</P>
          <Scale
            entries={opacity}
            render={value => (
              <span className={s.radius()} style={{background: `rgb(255 87 0 / ${value})`, display: 'block'}} />
            )}
            unit=""
          />
        </Section>

        <Section id="durations" title="Durations">
          <Scale entries={durations} unit=" ms" />
        </Section>

        <Section id="breakpoints" title="Breakpoints">
          <P>{'For responsive layout values, mobile first. `base` is everything narrower than `sm`.'}</P>
          <Scale entries={breakpoints} unit=" pt" />
        </Section>
      </>
    )
  },
  headings: [
    {id: 'tokens', label: 'Design tokens'},
    {id: 'colours', label: 'Colours'},
    {id: 'spacing', label: 'Spacing'},
    {id: 'radii', label: 'Radii'},
    {id: 'typography', label: 'Typography'},
    {id: 'opacity', label: 'Opacity'},
    {id: 'durations', label: 'Durations'},
    {id: 'breakpoints', label: 'Breakpoints'},
  ],
  id: 'tokens',
}
