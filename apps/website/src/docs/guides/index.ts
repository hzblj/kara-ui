import type {GuideId} from '../pages'
import {componentsGuide} from './components-guide'
import {hosts, installation, introduction} from './getting-started'
import type {Guide} from './guide'
import {changelog, haptics, icons, router} from './platform'
import {styling} from './styling'
import {theming} from './theming'
import {tokens} from './tokens'

export const GUIDE_CONTENT: Record<GuideId, Guide> = {
  changelog,
  components: componentsGuide,
  haptics,
  hosts,
  icons,
  installation,
  introduction,
  router,
  styling,
  theming,
  tokens,
}
