import {iconResourceName} from '@hzblj/kara-native'
import {NativeTabs} from 'expo-router/unstable-native-tabs'
import {Children, isValidElement} from 'react'

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

const TabsRoot = ({children, minimizeBehavior = 'never'}: TabsProps) => (
  <NativeTabs minimizeBehavior={minimizeBehavior}>
    {Children.map(children, child =>
      isValidElement<TabsScreenProps>(child) && child.type === TabsScreen ? renderTrigger(child.props) : child
    )}
  </NativeTabs>
)

/**
 * Native bottom tabs — a SwiftUI `TabView` on iOS and a Material navigation bar on Android, both
 * driven by Expo Router's own navigator. Nothing here may come from the standalone
 * `@react-navigation/*` packages: Expo Router 57 vendors its own fork of them, so a navigator built
 * against the npm copies registers into a context tree that never exists and throws
 * "Couldn't register the navigator" the moment this layout mounts.
 */
export const Tabs: TabsComponent = Object.assign(TabsRoot, {Screen: TabsScreen})
