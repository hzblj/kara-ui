import {iconResourceName} from '@hzblj/expo-native-icons'
import {GLYPHS} from '@hzblj/kara-native'
import type {Theme} from '@hzblj/kara-theme'

import {ActivityIndicator} from '../atoms/activity-indicator'
import type {IconName} from '../atoms/icon'
import type {
  HeaderAction,
  HeaderMenuItem,
  HeaderOptions,
  HeaderParams,
  NativeHeaderItem,
  NativeHeaderMenuElement,
} from './header.types'
import type {HeaderOptionsBuilder} from './header-options.types'

const DEFAULT_LABELS = {back: 'Back', close: 'Close'} as const

/** A zero-width spacing item between two groups is what ends a glass capsule on iOS 26, as the system's headers do. */
const GROUP_BREAK: NativeHeaderItem = {spacing: 0, type: 'spacing'}

const imageIcon = (icon: IconName) => ({source: {uri: iconResourceName(icon)}, type: 'image'}) as const

const toMenuElement = (item: HeaderMenuItem): NativeHeaderMenuElement => {
  if (item.type === 'submenu') {
    return {
      icon: item.icon ? imageIcon(item.icon) : undefined,
      inline: item.inline,
      items: item.items.map(toMenuElement),
      label: item.label,
      type: 'submenu',
    }
  }

  return {
    description: item.description,
    destructive: item.destructive,
    disabled: item.disabled,
    icon: item.icon ? imageIcon(item.icon) : undefined,
    label: item.label,
    onPress: item.onPress,
    state: item.checked ? 'on' : undefined,
    type: 'action',
  }
}

const toItem = (action: HeaderAction, theme: Theme): NativeHeaderItem => {
  switch (action.type) {
    case 'back':
    case 'close': {
      const label = action.label ?? DEFAULT_LABELS[action.type]

      return {
        accessibilityLabel: label,
        icon: action.icon ? imageIcon(action.icon) : {name: GLYPHS[action.type].ios, type: 'sfSymbol'},
        identifier: action.testID,
        label,
        onPress: action.onPress,
        sharesBackground: action.separated ? false : undefined,
        type: 'button',
      }
    }
    case 'icon':
      if (action.loading) {
        return {
          element: <ActivityIndicator accessibilityLabel={action.label} color="content.primary" />,
          type: 'custom',
        }
      }

      return {
        accessibilityLabel: action.label,
        badge: action.badge === undefined ? undefined : {value: action.badge},
        disabled: action.disabled,
        icon: imageIcon(action.icon),
        identifier: action.testID,
        label: action.label,
        onPress: action.onPress,
        selected: action.selected,
        sharesBackground: action.separated ? false : undefined,
        tintColor: action.color ? theme.color(action.color) : undefined,
        type: 'button',
      }
    case 'text':
      return {
        disabled: action.disabled,
        identifier: action.testID,
        label: action.label,
        onPress: action.onPress,
        sharesBackground: action.separated ? false : undefined,
        type: 'button',
        variant: action.prominent ? 'prominent' : undefined,
      }
    case 'menu':
      return {
        accessibilityLabel: action.label,
        icon: imageIcon(action.icon),
        identifier: action.testID,
        label: action.label,
        menu: {items: action.items.map(toMenuElement), title: action.title},
        sharesBackground: action.separated ? false : undefined,
        type: 'menu',
      }
    case 'custom':
      return {element: action.element, hidesSharedBackground: action.separated, type: 'custom'}
  }
}

const toItems = (actions: HeaderAction[], theme: Theme) => () => {
  const items: NativeHeaderItem[] = []

  for (const action of actions) {
    items.push(toItem(action, theme))

    if (action.separated) {
      items.push(GROUP_BREAK)
    }
  }

  return items
}

export const toHeaderOptions: HeaderOptionsBuilder = (
  {backHidden = false, leadingActions, trailingActions}: HeaderParams,
  theme: Theme
) => {
  const options: HeaderOptions = {headerBackVisible: !backHidden}

  if (leadingActions) {
    options.unstable_headerLeftItems = leadingActions.length > 0 ? toItems(leadingActions, theme) : undefined
  }

  if (trailingActions) {
    options.unstable_headerRightItems = trailingActions.length > 0 ? toItems(trailingActions, theme) : undefined
  }

  return options
}
