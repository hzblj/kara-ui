import {ComponentGallery} from '../components/gallery'
import {PlatformSwitch} from '../components/platform-switch'
import {COMPONENTS} from '../components/registry'
import {docsStyles} from '../docs-styles'
import type {Guide} from './guide'

const styles = docsStyles()

export const componentsGuide: Guide = {
  Content: () => (
    <>
      <header className={styles.hero()} id="components">
        <div className={styles.kicker()}>Gallery</div>
        <h1>Components</h1>
        <p>
          {`${COMPONENTS.length} components. Each one is photographed on iOS and on Android, in the site’s light or dark — hover a card to see it move.`}
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <PlatformSwitch />
        </div>
      </header>
      <ComponentGallery />
    </>
  ),
  headings: [
    {id: 'components', label: 'Components'},
    {id: 'actions', label: 'Actions'},
    {id: 'selection', label: 'Selection and input'},
    {id: 'content', label: 'Content'},
    {id: 'layout', label: 'Layout and lists'},
    {id: 'feedback', label: 'Feedback'},
    {id: 'navigation', label: 'Navigation and sheets'},
    {id: 'primitives', label: 'React Native tier'},
  ],
  id: 'components',
}
