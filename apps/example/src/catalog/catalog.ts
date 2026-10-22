import type {CatalogEntry, CatalogGroup} from './catalog.types'
import {ACTIONS} from './demos/actions'
import {CONTENT} from './demos/content'
import {FEEDBACK} from './demos/feedback'
import {LAYOUT} from './demos/layout'
import {NAVIGATION} from './demos/navigation'
import {SELECTION} from './demos/selection'

/** Every component, grouped the way someone looking for one would think of it. */
export const CATALOG: readonly CatalogGroup[] = [
  {entries: ACTIONS, id: 'actions', title: 'Actions'},
  {entries: SELECTION, id: 'selection', title: 'Selection and input'},
  {entries: CONTENT, id: 'content', title: 'Content'},
  {entries: LAYOUT, id: 'layout', title: 'Layout and lists'},
  {entries: FEEDBACK, id: 'feedback', title: 'Feedback'},
  {entries: NAVIGATION, id: 'navigation', title: 'Navigation and sheets'},
]

const BY_ID = new Map<string, CatalogEntry>(CATALOG.flatMap(group => group.entries).map(entry => [entry.id, entry]))

export const COMPONENT_COUNT = BY_ID.size

export const catalogEntry = (id: string | undefined): CatalogEntry | undefined => (id ? BY_ID.get(id) : undefined)
