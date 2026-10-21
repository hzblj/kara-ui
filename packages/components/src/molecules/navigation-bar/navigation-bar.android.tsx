import {HStack} from '../../atoms/h-stack'
import {Island} from '../../atoms/island'
import {Spacer} from '../../atoms/spacer'
import {Text} from '../../atoms/text'
import {GlyphButton} from '../../glyph'
import type {NavigationBarComponent, NavigationBarProps} from './navigation-bar.types'

/**
 * Material's top bar shape — navigation icon, start-aligned title, action at the end — built from the atoms in its own
 * island. Compose's icon buttons take no accessibility identifier, so `backTestID`/`closeTestID` are iOS-only.
 */
export const NavigationBar: NavigationBarComponent = ({
  backLabel = 'Back',
  closeLabel = 'Close',
  onBack,
  onClose,
  testID,
  title,
}: NavigationBarProps) => (
  <Island testID={testID}>
    <HStack align="center" px="s4" spacing="s4" wide>
      {onBack ? <GlyphButton accessibilityLabel={backLabel} name="back" onPress={onBack} /> : null}
      {title ? <Text variant="body">{title}</Text> : null}
      <Spacer />
      {onClose ? <GlyphButton accessibilityLabel={closeLabel} name="close" onPress={onClose} /> : null}
    </HStack>
  </Island>
)
