import type {FC} from 'react'

import type {DocsHeading, GuideId} from '../pages'

/** A guide page: its content and the outline the table of contents follows. */
export type Guide = {
  Content: FC
  headings: DocsHeading[]
  id: GuideId
}
