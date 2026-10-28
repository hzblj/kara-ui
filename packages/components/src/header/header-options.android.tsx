import {Host} from '@expo/ui/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'
import {StyleSheet, View} from 'react-native'

import {ActivityIndicator} from '../atoms/activity-indicator'
import {Button} from '../atoms/button'
import {IconButton} from '../atoms/icon-button'
import {GlyphButton} from '../glyph'
import {HostBoundary} from '../host-context'
import {Menu, type MenuAction} from '../organisms/menu'
import type {
  HeaderAction,
  HeaderItemProps,
  HeaderMenuItem,
  HeaderNavigationAction,
  HeaderOptions,
  HeaderParams,
} from './header.types'
import type {HeaderOptionsBuilder} from './header-options.types'

const DEFAULT_LABELS = {back: 'Back', close: 'Close'} as const

const styles = StyleSheet.create({
  // Material's navigation icon sits 4dp from the edge in a 48dp target; the toolbar insets custom content by 16dp.
  navigationRow: {alignItems: 'center', flexDirection: 'row', marginStart: -12},
  row: {alignItems: 'center', flexDirection: 'row'},
  spinner: {alignItems: 'center', height: 48, justifyContent: 'center', width: 48},
})

/** A host sized to its button both ways: the toolbar gives custom content no width to fill. */
const ActionHost = ({children}: {children: ReactNode}) => {
  const theme = useAppTheme()

  return (
    <Host colorScheme={theme.dark ? 'dark' : 'light'} matchContents seedColor={theme.materialSeed}>
      <HostBoundary>{children}</HostBoundary>
    </Host>
  )
}

const toMenuActions = (items: HeaderMenuItem[]): MenuAction[] => {
  const actions: MenuAction[] = []

  for (const item of items) {
    if (item.type === 'submenu') {
      for (const nested of toMenuActions(item.items)) {
        actions.push(nested)
      }
      continue
    }

    actions.push({
      destructive: item.destructive,
      disabled: item.disabled,
      icon: item.icon,
      label: item.label,
      onPress: item.onPress,
    })
  }

  return actions
}

const HeaderActionView = ({action}: {action: HeaderAction}) => {
  switch (action.type) {
    case 'back':
    case 'close': {
      const label = action.label ?? DEFAULT_LABELS[action.type]

      return (
        <ActionHost>
          {action.icon ? (
            <IconButton accessibilityLabel={label} name={action.icon} onPress={action.onPress} testID={action.testID} />
          ) : (
            <GlyphButton accessibilityLabel={label} name={action.type} onPress={action.onPress} />
          )}
        </ActionHost>
      )
    }
    case 'icon':
      if (action.loading) {
        return (
          <View style={styles.spinner} testID={action.testID}>
            <ActivityIndicator accessibilityLabel={action.label} color={action.color ?? 'content.primary'} />
          </View>
        )
      }

      return (
        <ActionHost>
          <IconButton
            accessibilityLabel={action.label}
            color={action.color}
            disabled={action.disabled}
            name={action.icon}
            onPress={action.onPress}
            testID={action.testID}
          />
        </ActionHost>
      )
    case 'text':
      return (
        <ActionHost>
          <Button
            disabled={action.disabled}
            label={action.label}
            onPress={action.onPress}
            testID={action.testID}
            variant="plain"
            wide={false}
          />
        </ActionHost>
      )
    case 'menu':
      return (
        <ActionHost>
          <Menu
            accessibilityLabel={action.label}
            actions={toMenuActions(action.items)}
            icon={action.icon}
            testID={action.testID}
          />
        </ActionHost>
      )
    case 'custom':
      return action.element
  }
}

const renderActions =
  (actions: HeaderAction[], isLeading: boolean, backHidden: boolean) =>
  ({canGoBack}: HeaderItemProps) => (
    <View style={isLeading && (backHidden || !canGoBack) ? styles.navigationRow : styles.row}>
      {actions.map((action, index) => (
        <HeaderActionView action={action} key={action.type === 'custom' ? action.key : index} />
      ))}
    </View>
  )

const isClose = (action: HeaderAction): action is HeaderNavigationAction => action.type === 'close'

/** Material's full-screen dialog: with no back to show, the close is the navigation icon at the start. */
const placeClose = ({backHidden = false, leadingActions, trailingActions}: HeaderParams) => {
  const close = backHidden && !leadingActions?.length ? trailingActions?.find(isClose) : undefined

  if (!close) {
    return {leading: leadingActions, trailing: trailingActions}
  }

  return {leading: [close], trailing: trailingActions?.filter(action => action !== close)}
}

export const toHeaderOptions: HeaderOptionsBuilder = (params: HeaderParams) => {
  const backHidden = params.backHidden ?? false
  const {leading, trailing} = placeClose(params)
  const options: HeaderOptions = {headerBackVisible: !backHidden}

  if (leading) {
    options.headerLeft = leading.length > 0 ? renderActions(leading, true, backHidden) : undefined
  }

  if (trailing) {
    options.headerRight = trailing.length > 0 ? renderActions(trailing, false, backHidden) : undefined
  }

  return options
}
