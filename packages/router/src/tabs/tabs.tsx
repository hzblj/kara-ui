import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import {type IconName, MATERIAL_ICONS, SF_SYMBOLS} from '@hzblj/kara-components'
import {NativeTabs} from 'expo-router/unstable-native-tabs'
import {Children, isValidElement} from 'react'
import type {SFSymbol} from 'sf-symbols-typescript'
import type {TabsComponent, TabsProps, TabsScreenProps} from './tabs.types'

const {Icon, Label, VectorIcon} = NativeTabs.Trigger

const sfSymbol = (name: IconName) => SF_SYMBOLS[name] as SFSymbol

const materialIcon = (name: IconName) => <VectorIcon family={MaterialIcons} name={MATERIAL_ICONS[name]} />

/**
 * Declares one tab and renders nothing itself — `Tabs` reads these props and emits the trigger.
 * The navigator collects its tabs by matching child element type exactly, so a component that
 * merely *renders* a trigger is invisible to it and the tab bar comes up empty.
 */
const TabsScreen: TabsComponent['Screen'] = () => null

const renderTrigger = ({hidden, icon, name, selectedIcon, testID, title}: TabsScreenProps) => (
  <NativeTabs.Trigger hidden={hidden} key={name} name={name} testID={testID}>
    <Icon
      sf={selectedIcon ? {default: sfSymbol(icon), selected: sfSymbol(selectedIcon)} : sfSymbol(icon)}
      src={selectedIcon ? {default: materialIcon(icon), selected: materialIcon(selectedIcon)} : materialIcon(icon)}
    />
    <Label>{title}</Label>
  </NativeTabs.Trigger>
)

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
