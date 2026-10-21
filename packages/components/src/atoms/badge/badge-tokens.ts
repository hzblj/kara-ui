import type {ColorToken} from '@hzblj/kara-theme'

import type {BadgeTone} from './badge.types'

export const BADGE_TOKENS = {
  accent: {content: 'content.accent', fill: 'fill.accent.base'},
  destructive: {content: 'content.destructive', fill: 'fill.destructive.base'},
  neutral: {content: 'content.secondary', fill: 'fill.tertiary'},
  success: {content: 'content.success', fill: 'fill.success.base'},
} as const satisfies Record<BadgeTone, {content: ColorToken; fill: ColorToken}>
