import type {IconName} from '@hzblj/kara-ui'
import type {FC} from 'react'

import {ColorsPage} from './pages/colors'
import {IconsPage} from './pages/icons'
import {ShadowsPage} from './pages/shadows'
import {ShapesPage} from './pages/shapes'
import {SpacingPage} from './pages/spacing'
import {StylingPage} from './pages/styling'
import {ThemePage} from './pages/theme'
import {TypographyPage} from './pages/typography'

export type DesignPage = {
  icon: IconName
  id: string
  Page: FC
  summary: string
  title: string
}

export const DESIGN_PAGES: readonly DesignPage[] = [
  {icon: 'brush', id: 'theme', Page: ThemePage, summary: 'Appearance, accents and your own theme', title: 'Theme'},
  {
    icon: 'palette',
    id: 'colors',
    Page: ColorsPage,
    summary: 'Semantic tokens that adapt by themselves',
    title: 'Colors',
  },
  {icon: 'text-fields', id: 'typography', Page: TypographyPage, summary: 'Nineteen text variants', title: 'Typography'},
  {icon: 'straighten', id: 'spacing', Page: SpacingPage, summary: 'One scale for every gap', title: 'Spacing'},
  {
    icon: 'rounded-corner',
    id: 'shapes',
    Page: ShapesPage,
    summary: 'Radii, all together or per corner',
    title: 'Shapes',
  },
  {icon: 'shadow', id: 'shadows', Page: ShadowsPage, summary: 'Elevation as tokens', title: 'Shadows'},
  {icon: 'code', id: 'styling', Page: StylingPage, summary: 'The sx props, on any view', title: 'Styling'},
  {icon: 'star', id: 'icons', Page: IconsPage, summary: 'Your SVGs, drawn natively', title: 'Icons'},
]

const BY_ID = new Map(DESIGN_PAGES.map(page => [page.id, page]))

export const designPage = (id: string | undefined): DesignPage | undefined => (id ? BY_ID.get(id) : undefined)
