import {IconButton as ComposeIconButton} from '@expo/ui/jetpack-compose'
import {GLYPHS} from '@hzblj/kara-native'
import {DrawableIcon} from '@hzblj/kara-native/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'

import type {GlyphButtonComponent, GlyphButtonProps} from './glyph-button.types'

export const GlyphButton: GlyphButtonComponent = ({
  accessibilityLabel,
  disabled = false,
  name,
  onPress,
}: GlyphButtonProps) => {
  const theme = useAppTheme()

  return (
    <ComposeIconButton enabled={!disabled} onClick={onPress}>
      <DrawableIcon
        accessibilityLabel={accessibilityLabel}
        iconColor={theme.color(disabled ? 'btn.content.disabled' : 'content.primary')}
        resourceName={GLYPHS[name].android}
      />
    </ComposeIconButton>
  )
}
