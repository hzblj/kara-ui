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

/** A curve drawn the way an editor draws one: time across, progress up, its two handles as faint lines. */
const Curve = ({points: [x1 = 0, y1 = 0, x2 = 1, y2 = 1]}: {points: number[]}) => {
  const W = 72
  const H = 44
  const at = (x: number, y: number) => `${(x * W).toFixed(1)} ${((1 - y) * H).toFixed(1)}`

  return (
    <svg aria-hidden="true" className="overflow-visible" height={H} viewBox={`0 0 ${W} ${H}`} width={W}>
      <rect className="fill-none stroke-border-secondary" height={H} rx="4" width={W} />
      <path className="stroke-content-quaternary" d={`M${at(0, 0)} L${at(x1, y1)} M${at(1, 1)} L${at(x2, y2)}`} />
      <path
        className="fill-none stroke-fill-accent-primary"
        d={`M${at(0, 0)} C${at(x1, y1)} ${at(x2, y2)} ${at(1, 1)}`}
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  )
}

/**
 * A spring's step response, drawn like `Curve`: the same physics the library runs (mass 1, stiffness from the response,
 * damping from the bounce), over the time it takes to rest. A bounce shows as the line rising past the top and back.
 */
const SpringCurve = ({bounce, duration}: {bounce: number; duration: number}) => {
  const W = 72
  const H = 44
  const omega = (2 * Math.PI * 1000) / duration
  const zeta = 1 - bounce
  const position = (t: number) => {
    if (zeta >= 1) {
      return 1 - Math.exp(-omega * t) * (1 + omega * t)
    }

    const damped = omega * Math.sqrt(1 - zeta * zeta)

    return 1 - Math.exp(-zeta * omega * t) * (Math.cos(damped * t) + ((zeta * omega) / damped) * Math.sin(damped * t))
  }
  // Drawn over 1.5 times the perceptual duration, the span Reanimated gives a spring to rest in.
  const span = (duration * 1.5) / 1000
  const at = (x: number, y: number) => `${(x * W).toFixed(1)} ${((1 - y / 1.25) * H).toFixed(1)}`
  const path = Array.from({length: 49}, (_, index) => {
    const x = index / 48

    return `${index === 0 ? 'M' : 'L'}${at(x, position(x * span))}`
  }).join(' ')

  return (
    <svg aria-hidden="true" className="overflow-visible" height={H} viewBox={`0 0 ${W} ${H}`} width={W}>
      <rect className="fill-none stroke-border-secondary" height={H} rx="4" width={W} />
      <path className="stroke-content-quaternary" d={`M${at(0, 1)} L${at(1, 1)}`} />
      <path className="fill-none stroke-fill-accent-primary" d={path} strokeLinecap="round" strokeWidth="2" />
    </svg>
  )
}

const Springs = ({entries}: {entries: [string, {bounce: number; duration: number}][]}) => (
  <div className={s.wrap()}>
    <table className={s.table()}>
      <Head columns={['Token', 'Duration / bounce', '']} />
      <tbody>
        {entries.map(([name, spring]) => (
          <tr key={name}>
            <td className={s.cell()}>
              <code className={s.code()}>{name}</code>
            </td>
            <td className={s.cell()}>
              <span className={s.muted()}>{`${spring.duration} ms / ${spring.bounce}`}</span>
            </td>
            <td className={s.cell()}>
              <SpringCurve {...spring} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const Easings = ({entries}: {entries: [string, number[]][]}) => (
  <div className={s.wrap()}>
    <table className={s.table()}>
      <Head columns={['Token', 'Curve', '']} />
      <tbody>
        {entries.map(([name, points]) => (
          <tr key={name}>
            <td className={s.cell()}>
              <code className={s.code()}>{name}</code>
            </td>
            <td className={s.cell()}>
              <span className={s.muted()}>{`cubic-bezier(${points.join(', ')})`}</span>
            </td>
            <td className={s.cell()}>
              <Curve points={points} />
            </td>
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
    const {breakpoints, durations, easings, opacity, radii, spacing, springs} = readTokens()
    const longest = Math.max(...durations.map(([, value]) => value))

    return (
      <>
        <Hero id="tokens" kicker="Core concepts" title="Design tokens">
          <P>
            {
              'Every value an `sx` prop takes, read straight from `@hzblj/kara-theme` when this page was built. Colours are named by what they are for; whose colour each one is (the platform’s, or a hex kara owns) is the value’s business.'
            }
          </P>
        </Hero>

        <Section id="colours" title="Colours">
          <P>
            {
              'A system name resolves on the device, so it follows the user’s appearance, contrast setting and, on Android, the Material scheme. Swatches show light, then dark, for the colours kara owns. Any colour can be overridden in the theme.'
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
          <P>
            {
              'The scale transitions.dev uses, named by what the motion does: `micro` answers a touch, `quick` is something leaving or swapped in place, `fast` something arriving, `medium` and `slow` a larger surface leaving and arriving, `verySlow` an emphasised moment, and `stagger` the offset between items that come in one after another. Pick a step by what the motion does, not by the number: a sheet closing is `quick`, whatever it took before. Leaving is shorter than arriving, and what a finger drags is a spring, not a duration. For Reduce Motion, see [Accessibility](/docs/accessibility#motion).'
            }
          </P>
          <Scale
            entries={durations}
            render={value => (
              <span
                className="block h-2 rounded-full bg-fill-accent-primary"
                style={{width: `${Math.max(2, (value / longest) * 100)}%`}}
              />
            )}
            unit=" ms"
          />
        </Section>

        <Section id="easing" title="Easing">
          <P>
            {
              'The curves timed motion follows, transitions.dev’s set. `smoothOut` is the one to reach for, arriving and leaving alike: a fast start and a long settle, so the change shows at once and lands softly. `inOut` swaps one thing for another in place, `out` is a small fade or tint, and `linear` is for what loops. `Easing.bezier(...easing.smoothOut)` in Reanimated.'
            }
          </P>
          <Easings entries={easings} />
        </Section>

        <Section id="springs" title="Springs">
          <P>
            {
              'What a finger drives, and what should keep its speed when another change interrupts it, moves on a spring: SwiftUI’s set, each a perceptual duration and a bounce. `interactive` follows a finger, `smooth` settles content into place with no bounce, `snappy` is a quick, decided change with a touch of one, `bouncy` an emphasised moment. One token is the same curve everywhere: `spring(\'snappy\')` for `withSpring`, `animate="snappy"`, `layout="smooth"`, a preset’s `spring`, SwiftUI’s `.spring` and Compose’s `spring()`. See [Motion](/docs/motion).'
            }
          </P>
          <Springs entries={springs} />
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
    {id: 'easing', label: 'Easing'},
    {id: 'springs', label: 'Springs'},
    {id: 'breakpoints', label: 'Breakpoints'},
  ],
  id: 'tokens',
}
