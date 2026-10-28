import {Button, Image, Label, Menu as SwiftUIMenu} from '@expo/ui/swift-ui'
import {contentShape, disabled, frame, resizable, shapes} from '@expo/ui/swift-ui/modifiers'
import {iconResourceName} from '@hzblj/expo-native-icons'
import {useAccessibilityModifiers} from '@hzblj/kara-sx'
import {spacing} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

import {Icon} from '../../atoms/icon'
import {ZStack} from '../../atoms/z-stack'
import {useHostGuard} from '../../hooks/host-context'
import type {MenuComponent, MenuProps} from './menu.types'
import {isIconOnly} from './menu-parts'

const DISABLED = [disabled(true)]

/** Apple's least tap target, as `IconButton` takes it. */
const TARGET = 44

/** The whole square takes the tap, not only the glyph's own pixels. */
const WHOLE_TARGET = {modifiers: [contentShape(shapes.circle())]}

/**
 * The icon beside the trigger's text, the size `Link` draws one beside body text. No colour of its own: the asset is a
 * template image, so it takes the menu's tint with the text.
 */
const LABEL_ICON = [resizable(), frame({height: spacing.s20, width: spacing.s20})]

const triggerOf = (props: MenuProps): ReactNode => {
  if (isIconOnly(props)) {
    // An icon alone is drawn as an `IconButton`: `content.primary`, its label carried by the icon.
    return (
      <ZStack h={TARGET} ios={WHOLE_TARGET} w={TARGET}>
        <Icon accessibilityLabel={props.accessibilityLabel} color="content.primary" name={props.icon} />
      </ZStack>
    )
  }

  return props.icon ? (
    <Label icon={<Image assetName={iconResourceName(props.icon)} modifiers={LABEL_ICON} />} title={props.label} />
  ) : (
    props.label
  )
}

export const Menu: MenuComponent = (props: MenuProps) => {
  useHostGuard('Menu')
  const {accessibilityLabel, actions, label, testID} = props
  // An icon alone carries its own label; with text, `accessibilityLabel` replaces it on the menu.
  const modifiers = useAccessibilityModifiers({
    accessibilityLabel: label === undefined ? undefined : accessibilityLabel,
  })

  return (
    <SwiftUIMenu label={triggerOf(props)} modifiers={modifiers} testID={testID}>
      {actions.map(action => (
        <Button
          key={action.label}
          label={action.icon ? undefined : action.label}
          modifiers={action.disabled ? DISABLED : undefined}
          onPress={action.onPress}
          role={action.destructive ? 'destructive' : 'default'}
        >
          {/* A menu row is the system's Label: our icon is its image, from the asset catalog, and UIKit sizes it. */}
          {action.icon ? (
            <Label icon={<Image assetName={iconResourceName(action.icon)} />} title={action.label} />
          ) : undefined}
        </Button>
      ))}
    </SwiftUIMenu>
  )
}
