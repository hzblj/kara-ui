import {Button} from '@expo/ui/swift-ui'
import {
  buttonStyle,
  disabled as disabledModifier,
  accessibilityLabel as labelModifier,
} from '@expo/ui/swift-ui/modifiers'
import {useMemo} from 'react'

import {Glyph} from './glyph'
import type {GlyphButtonComponent, GlyphButtonProps} from './glyph-button.types'

export const GlyphButton: GlyphButtonComponent = ({
  accessibilityLabel,
  disabled = false,
  name,
  onPress,
}: GlyphButtonProps) => {
  const modifiers = useMemo(() => {
    const list = [buttonStyle('plain')]

    if (disabled) {
      list.push(disabledModifier(true))
    }

    if (accessibilityLabel) {
      list.push(labelModifier(accessibilityLabel))
    }

    return list
  }, [accessibilityLabel, disabled])

  return (
    <Button modifiers={modifiers} onPress={onPress}>
      <Glyph color={disabled ? 'btn.content.disabled' : 'content.primary'} name={name} />
    </Button>
  )
}
