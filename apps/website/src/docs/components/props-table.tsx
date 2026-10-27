import Link from 'next/link'
import {tv} from 'tailwind-variants'

import {Inline} from '../../ui/inline'
import {type ApiMember, type ApiType, readApi} from '../source/api'

const styles = tv({
  slots: {
    card: 'grid gap-2 border-t border-border-secondary px-4 py-3.5 first:border-t-0',
    cardHead: 'flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1',
    cards: 'overflow-hidden rounded-xl border border-border-secondary bg-surface-primary min-[721px]:hidden',
    defaults: 'whitespace-nowrap font-mono text-[11.5px] text-content-secondary',
    description: 'text-[13px] leading-[1.6] text-content-secondary [&_code]:text-[12px]',
    extends: 'mb-3 text-[13px] leading-6 text-content-tertiary',
    name: 'font-mono text-[12.5px] font-semibold text-content-primary',
    required: 'ml-0.5 text-content-destructive',
    table:
      'w-full min-w-[640px] border-collapse text-left [&_td]:border-t [&_td]:border-border-secondary [&_td]:px-4 [&_td]:py-3 [&_td]:align-top [&_th]:bg-surface-secondary [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-[10px] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.08em] [&_th]:text-content-tertiary',
    type: 'font-mono text-[12px] leading-5 text-content-accent [overflow-wrap:anywhere]',
    typeLink: 'underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current',
    wrap: 'overflow-x-auto rounded-xl border border-border-secondary bg-surface-primary max-[720px]:hidden',
  },
})

const s = styles()

/** Types worth a link wherever they appear in a props table. */
const REFERENCES: Record<string, string> = {
  AccessibilityRole: '/docs/accessibility#platforms',
  ColorToken: '/docs/tokens#colours',
  DurationSize: '/docs/tokens#durations',
  Haptic: '/docs/haptics',
  IconName: '/docs/icons',
  MenuAction: '/docs/components/menu#menu-action',
  NavigationBarItem: '/docs/components/navigation-bar',
  OpacitySize: '/docs/tokens#opacity',
  RadiiSize: '/docs/tokens#radii',
  ResponsiveSx: '/docs/styling#native',
  ResponsiveViewSx: '/docs/styling#react-native',
  SpaceSize: '/docs/tokens#spacing',
  TextVariant: '/docs/tokens#typography',
}

const EXTENDS: Record<string, string> = {
  AccessibilityProps: 'the [accessibility props](/docs/accessibility#props)',
  MenuTrigger: 'a `label`, or an `icon` with an `accessibilityLabel`',
  ResponsiveSx: 'the [native `sx` props](/docs/styling#native)',
  ResponsiveViewSx: 'the [React Native `sx` props](/docs/styling#react-native)',
}

/** A literal union declared beside the component reads better spelled out than as its alias's name. */
const expand = (type: string) => {
  const alias = readApi().aliases[type]
  return alias && alias.text.includes("'") && alias.text.length <= 110 ? alias.text : type
}

const TypeCell = ({type}: {type: string}) => {
  const shown = expand(type)
  const reference = Object.keys(REFERENCES)
    .filter(name => new RegExp(`\\b${name}\\b`).test(shown))
    .sort((first, second) => second.length - first.length)[0]

  return reference ? (
    <Link className={`${s.type()} ${s.typeLink()}`} href={REFERENCES[reference] ?? '#'}>
      {shown}
    </Link>
  ) : (
    <span className={s.type()}>{shown}</span>
  )
}

const Defaults = ({member}: {member: ApiMember}) => {
  const {android, ios} = member.defaults

  // No default: an empty cell, the way the column reads at a glance.
  if (!android && !ios) {
    return null
  }

  if (android === ios) {
    return <span className={s.defaults()}>{ios}</span>
  }

  return (
    <span className="grid gap-1">
      {ios ? <span className={s.defaults()}>{`iOS ${ios}`}</span> : null}
      {android ? <span className={s.defaults()}>{`Android ${android}`}</span> : null}
    </span>
  )
}

const describeExtends = (type: ApiType) =>
  type.extends
    .map(part => {
      if (EXTENDS[part]) {
        return EXTENDS[part]
      }

      const omitted = /^Omit<(\w+), (.+)>$/.exec(part)
      if (omitted) {
        return `React Native’s \`${omitted[1]}\` without ${omitted[2]}`
      }

      const picked = /^Pick<(\w+), (.+)>$/.exec(part)
      return picked ? `${picked[2]} from \`${picked[1]}\`` : `\`${part}\``
    })
    .join(', ')

/** One type's props: name, type, default and the JSDoc, straight from the library's sources. */
export const PropsTable = ({name}: {name: string}) => {
  const type = readApi().types[name]

  if (!type) {
    return null
  }

  const members = [...type.members].sort(
    (first, second) => Number(first.optional) - Number(second.optional) || first.name.localeCompare(second.name)
  )
  // A column of dashes says nothing: the `sx` surfaces, for one, have no defaults at all.
  const hasDefaults = members.some(member => member.defaults.ios || member.defaults.android)

  return (
    <div>
      {type.extends.length > 0 ? (
        <p className={s.extends()}>
          <Inline text={`Also takes ${describeExtends(type)}.`} />
        </p>
      ) : null}
      <div className={s.wrap()}>
        <table className={s.table()}>
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              {hasDefaults ? <th>Default</th> : null}
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.name}>
                <td>
                  <span className={s.name()}>{member.name}</span>
                  {member.optional ? null : <span className={s.required()}>*</span>}
                </td>
                <td className="min-w-[150px] max-w-[260px]">
                  <TypeCell type={member.type} />
                </td>
                {hasDefaults ? (
                  <td>
                    <Defaults member={member} />
                  </td>
                ) : null}
                <td className={s.description()}>
                  {member.description.split('\n\n').map(paragraph => (
                    <p className="[&+p]:mt-2" key={paragraph}>
                      <Inline text={paragraph} />
                    </p>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* The same rows, stacked: four columns do not fit a phone, and a table scrolled sideways hides its descriptions. */}
      <div className={s.cards()}>
        {members.map(member => (
          <div className={s.card()} key={member.name}>
            <div className={s.cardHead()}>
              <span>
                <span className={s.name()}>{member.name}</span>
                {member.optional ? null : <span className={s.required()}>*</span>}
              </span>
              {hasDefaults && (member.defaults.ios || member.defaults.android) ? <Defaults member={member} /> : null}
            </div>
            <TypeCell type={member.type} />
            {member.description ? (
              <div className={s.description()}>
                {member.description.split('\n\n').map(paragraph => (
                  <p className="[&+p]:mt-2" key={paragraph}>
                    <Inline text={paragraph} />
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export const typeDescription = (name: string) => readApi().types[name]?.description ?? ''

export const hasType = (name: string) => Boolean(readApi().types[name])
