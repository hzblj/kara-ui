import {Badge as ComposeBadge, Text as ComposeText} from '@expo/ui/jetpack-compose'
import {testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {useHostGuard} from '../../hooks/host-context'
import type {BadgeComponent, BadgeProps} from './badge.types'
import {BADGE_TOKENS} from './badge-tokens'

/** Material's badge. Its content is a Compose `Text` — `@expo/ui`'s badge takes composable content, not a string. */
export const Badge: BadgeComponent = ({label, testID, tone = 'neutral'}: BadgeProps) => {
  useHostGuard('Badge')
  const theme = useAppTheme()
  const tokens = BADGE_TOKENS[tone]
  const modifiers = useMemo(() => (testID ? [testIdModifier(testID)] : undefined), [testID])

  return (
    <ComposeBadge
      containerColor={theme.color(tokens.fill)}
      contentColor={theme.color(tokens.content)}
      modifiers={modifiers}
    >
      <ComposeText color={theme.colorString(tokens.content)} style={theme.typography.captionMedium}>
        {label}
      </ComposeText>
    </ComposeBadge>
  )
}
