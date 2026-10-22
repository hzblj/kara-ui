import {tv} from 'tailwind-variants'

import {CodeBlock} from '../../ui/code-block'
import {highlight} from '../../ui/highlight'
import {Inline} from '../../ui/inline'
import {DocsPage} from '../docs-page'
import {docsStyles} from '../docs-styles'
import {componentHref, type DocsHeading} from '../pages'
import {type MediaPlatform, mediaFor} from '../source/media'
import {DeviceMedia} from './device-media'
import {PreviewTabs} from './preview-tabs'
import {PropsTable, typeDescription} from './props-table'
import {COMPONENT_GROUPS, type ComponentDoc} from './registry'

const docs = docsStyles()

const styles = tv({
  slots: {
    badge:
      'inline-flex items-center gap-1.5 rounded-full border border-border-secondary bg-surface-primary px-2.5 py-1 text-[11.5px] text-content-secondary',
    badgeLabel: 'font-semibold text-content-primary',
    badges: 'mt-6 flex flex-wrap gap-2',
    host: 'border-fill-accent-primary/30 bg-fill-accent-soft text-content-accent',
    panel: 'min-w-0',
    panelCaption: 'flex items-baseline justify-between gap-3 border-t border-border-secondary px-4 py-2.5 text-[12px]',
    panelName: 'font-semibold text-content-primary',
    panelRenders: 'truncate text-content-tertiary',
    panels:
      'grid grid-cols-2 divide-x divide-border-secondary max-[680px]:grid-cols-1 max-[680px]:divide-x-0 max-[680px]:divide-y',
    unavailable:
      'flex aspect-[4/3] w-full flex-col items-center justify-center gap-1.5 bg-surface-tertiary px-8 text-center text-[13px] text-content-tertiary',
  },
})

const s = styles()

const PLATFORM_LABELS: Record<MediaPlatform, string> = {android: 'Android', ios: 'iOS'}

const HOST_LABELS: Record<ComponentDoc['host'], string> = {
  native: 'Renders in a Screen or an Island',
  rn: 'React Native tier — renders anywhere',
  self: 'Brings its own host — renders anywhere',
}

/** `SheetHeaderProps` on the Sheet page → `Sheet.Header`; the page's own props type → `Props`. */
const tableTitle = (component: ComponentDoc, type: string) => {
  if (!type.endsWith('Props')) {
    return type
  }

  if (type === `${component.name}Props`) {
    return 'Props'
  }

  const bare = type.replace(/Props$/, '')
  return bare.startsWith(component.name) && bare !== component.name
    ? `${component.name}.${bare.slice(component.name.length)}`
    : bare
}

const slug = (text: string) =>
  text
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()

const Panel = ({component, platform}: {component: ComponentDoc; platform: MediaPlatform}) => {
  const media = mediaFor(component.id)
  const captured = media?.platforms[platform]

  return (
    <figure className={s.panel()}>
      {captured ? (
        <DeviceMedia
          alt={`${component.name} on ${PLATFORM_LABELS[platform]}`}
          autoplay="view"
          frame={captured.frame}
          media={captured}
          platform={platform}
        />
      ) : (
        <div className={s.unavailable()}>
          <span className="font-semibold text-content-secondary">{`Not on ${PLATFORM_LABELS[platform]}`}</span>
          <span>See the platform notes below.</span>
        </div>
      )}
      <figcaption className={s.panelCaption()}>
        <span className={s.panelName()}>{PLATFORM_LABELS[platform]}</span>
        <span className={s.panelRenders()}>{component.renders[platform]}</span>
      </figcaption>
    </figure>
  )
}

export const ComponentPage = async ({component}: {component: ComponentDoc}) => {
  const media = mediaFor(component.id)
  const hasMedia = Boolean(media && Object.keys(media.platforms).length > 0)
  const group = COMPONENT_GROUPS.find(entry => entry.id === component.group)
  const entry = component.entry ?? '@hzblj/kara-ui'
  const importLine = `import {${component.exports.join(', ')}} from '${entry}'`
  const tables = component.types.map(type => ({
    id: slug(tableTitle(component, type) === 'Props' ? 'props' : type.replace(/Props$/, '')),
    title: tableTitle(component, type),
    type,
  }))

  const headings: DocsHeading[] = [
    {id: 'overview', label: component.name},
    {id: 'import', label: 'Import'},
    ...(component.examples?.length ? [{id: 'examples', label: 'Examples'}] : []),
    ...tables.map(table => ({id: table.id, label: table.title})),
    ...(component.notes?.length ? [{id: 'platform-notes', label: 'Platform notes'}] : []),
  ]

  return (
    <DocsPage headings={headings} href={componentHref(component.id)}>
      <header className={docs.hero()} id="overview">
        <div className={docs.kicker()}>{group?.title}</div>
        <h1>{component.name}</h1>
        <p>{component.summary}</p>
        <div className={s.badges()}>
          <span className={s.badge()}>
            <span className={s.badgeLabel()}>iOS</span>
            {component.renders.ios}
          </span>
          <span className={s.badge()}>
            <span className={s.badgeLabel()}>Android</span>
            {component.renders.android}
          </span>
          <span className={s.badge({class: s.host()})}>{HOST_LABELS[component.host]}</span>
        </div>
      </header>

      <section className={docs.section()}>
        {hasMedia ? (
          <PreviewTabs
            code={component.code}
            codeHtml={await highlight(component.code)}
            preview={
              <div className={s.panels()}>
                <Panel component={component} platform="ios" />
                <Panel component={component} platform="android" />
              </div>
            }
          />
        ) : (
          <CodeBlock code={component.code} />
        )}
      </section>

      <section className={docs.section()} id="import">
        <h2>Import</h2>
        <CodeBlock code={importLine} language="ts" />
      </section>

      {component.examples?.length ? (
        <section className={docs.section()} id="examples">
          <h2>Examples</h2>
          {component.examples.map(example => (
            <div className="grid gap-3" key={example.title}>
              <h3 className="text-[15px] font-semibold">{example.title}</h3>
              <CodeBlock code={example.code} />
            </div>
          ))}
        </section>
      ) : null}

      {tables.map(table => {
        const description = typeDescription(table.type)

        return (
          <section className={docs.section()} id={table.id} key={table.type}>
            <h2>{table.title}</h2>
            {description ? (
              <p>
                <Inline text={description.split('\n\n')[0] ?? ''} />
              </p>
            ) : null}
            <PropsTable name={table.type} />
          </section>
        )
      })}

      {component.notes?.length ? (
        <section className={docs.section()} id="platform-notes">
          <h2>Platform notes</h2>
          <ul>
            {component.notes.map(note => (
              <li key={note}>
                <Inline text={note} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </DocsPage>
  )
}
