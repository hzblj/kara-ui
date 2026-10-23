import {iconResourceName} from '@hzblj/expo-native-icons'
import {useAppTheme} from '@hzblj/kara-theme'
import {NativeTabs} from 'expo-router/unstable-native-tabs'
import {Children, isValidElement, useMemo} from 'react'
import {Platform} from 'react-native'

import type {TabsComponent, TabsProps, TabsScreenProps} from './tabs.types'

const {Icon, Label} = NativeTabs.Trigger

/**
 * Declares one tab and renders nothing itself — `Tabs` reads these props and emits the trigger.
 * The navigator collects its tabs by matching child element type exactly, so a component that
 * merely *renders* a trigger is invisible to it and the tab bar comes up empty.
 */
const TabsScreen: TabsComponent['Screen'] = () => null

/**
 * The tab's icon, natively on both sides: the app icon's image set in the iOS asset catalog, its vector drawable on
 * Android — one name, the one the config plugin gave both. No icon font, no bitmap rendered in JavaScript.
 */
const renderTrigger = ({hidden, icon, name, selectedIcon, testID, title}: TabsScreenProps) => {
  const asset = iconResourceName(icon)
  const selected = selectedIcon ? iconResourceName(selectedIcon) : undefined

  return (
    <NativeTabs.Trigger hidden={hidden} key={name} name={name} testID={testID}>
      <Icon
        drawable={selected ? {default: asset, selected} : asset}
        xcasset={selected ? {default: asset, selected} : asset}
      />
      <Label>{title}</Label>
    </NativeTabs.Trigger>
  )
}

/**
 * The bar in the theme's colours. iOS keeps the system's glass bar and only takes the accent for the selected item;
 * Android's Material bar would otherwise colour itself from the wallpaper's dynamic scheme, whatever the theme says —
 * so the container, the active indicator, icons, labels and ripple are all set from tokens.
 */
const useTabBarColors = () => {
  const theme = useAppTheme()

  return useMemo(() => {
    const fontFamily = theme.typography.labelMedium.fontFamily
    const tintColor = theme.color('content.accent')

    if (Platform.OS !== 'android') {
      // A colour for both states, not only `tintColor`: Expo Router tints an asset-catalog icon only when the state has
      // an icon colour and lets the unselected state's mode decide both — with the selected one alone, both icons kept
      // the SVG's own black, even selected, even in dark mode. Unselected takes the label colour, as UIKit's own does.
      return {
        iconColor: {default: theme.color('content.primary'), selected: tintColor},
        labelStyle: {fontFamily},
        tintColor,
      }
    }

    return {
      backgroundColor: theme.color('surface.primary'),
      iconColor: {default: theme.color('content.secondary'), selected: tintColor},
      indicatorColor: theme.color('fill.accent.base'),
      labelStyle: {
        default: {color: theme.color('content.secondary'), fontFamily},
        selected: {color: theme.color('content.primary'), fontFamily},
      },
      rippleColor: theme.color('fill.accent.base'),
      tintColor,
    }
  }, [theme])
}

const TabsRoot = ({children, minimizeBehavior = 'never'}: TabsProps) => {
  const colors = useTabBarColors()

  return (
    <NativeTabs minimizeBehavior={minimizeBehavior} {...colors}>
      {Children.map(children, child =>
        isValidElement<TabsScreenProps>(child) && child.type === TabsScreen ? renderTrigger(child.props) : child
      )}
    </NativeTabs>
  )
}

/**
 * Native bottom tabs — a SwiftUI `TabView` on iOS and a Material navigation bar on Android, both
 * driven by Expo Router's own navigator. Nothing here may come from the standalone
 * `@react-navigation/*` packages: Expo Router 57 vendors its own fork of them, so a navigator built
 * against the npm copies registers into a context tree that never exists and throws
 * "Couldn't register the navigator" the moment this layout mounts.
 */
export const Tabs: TabsComponent = Object.assign(TabsRoot, {Screen: TabsScreen})
