import type {NativeStackNavigationOptions} from 'expo-router'

import type {HeaderInsetComponent, HeaderOptions, HeaderSearchBarOptions, StackScreenOptions} from './header.types'
import {HeaderInset as AndroidHeaderInset} from './header-inset.android'
import {HeaderInset as IosHeaderInset} from './header-inset.ios'
import {toHeaderOptions as androidHeaderOptions} from './header-options.android'
import {toHeaderOptions as iosHeaderOptions} from './header-options.ios'
import type {HeaderOptionsBuilder} from './header-options.types'
import {HeaderSearchAccessory as AndroidHeaderSearchAccessory} from './header-search-accessory.android'
import {HeaderSearchAccessory as IosHeaderSearchAccessory} from './header-search-accessory.ios'
import type {HeaderSearchAccessoryComponent} from './header-search-accessory.types'
import {HeaderSearchInput as AndroidHeaderSearchInput} from './header-search-input.android'
import {HeaderSearchInput as IosHeaderSearchInput} from './header-search-input.ios'
import type {HeaderSearchInputComponent} from './header-search-input.types'
import {HeroHeaderBackground as AndroidHeroHeaderBackground} from './hero-header-background.android'
import {HeroHeaderBackground as IosHeroHeaderBackground} from './hero-header-background.ios'
import type {HeroHeaderBackgroundComponent} from './hero-header-background.types'
import {NativeSubtitle as AndroidNativeSubtitle} from './native-subtitle.android'
import {NativeSubtitle as IosNativeSubtitle} from './native-subtitle.ios'
import type {NativeSubtitleComponent} from './native-subtitle.types'
import {SheetGrabber as AndroidSheetGrabber} from './sheet-grabber.android'
import {SheetGrabber as IosSheetGrabber} from './sheet-grabber.ios'
import type {SheetGrabberComponent} from './sheet-grabber.types'
import {useHeaderBarInset as androidHeaderBarInset} from './use-header-bar-inset.android'
import {useHeaderBarInset as iosHeaderBarInset} from './use-header-bar-inset.ios'
import type {UseHeaderBarInset} from './use-header-bar-inset.types'

export const _iosHeaderOptions: HeaderOptionsBuilder = iosHeaderOptions
export const _androidHeaderOptions: HeaderOptionsBuilder = androidHeaderOptions
export const _iosHeaderInset: HeaderInsetComponent = IosHeaderInset
export const _androidHeaderInset: HeaderInsetComponent = AndroidHeaderInset
export const _iosHeaderBarInset: UseHeaderBarInset = iosHeaderBarInset
export const _androidHeaderBarInset: UseHeaderBarInset = androidHeaderBarInset
export const _iosHeaderSearchAccessory: HeaderSearchAccessoryComponent = IosHeaderSearchAccessory
export const _androidHeaderSearchAccessory: HeaderSearchAccessoryComponent = AndroidHeaderSearchAccessory
export const _iosSheetGrabber: SheetGrabberComponent = IosSheetGrabber
export const _androidSheetGrabber: SheetGrabberComponent = AndroidSheetGrabber
export const _iosHeaderSearchInput: HeaderSearchInputComponent = IosHeaderSearchInput
export const _androidHeaderSearchInput: HeaderSearchInputComponent = AndroidHeaderSearchInput
export const _iosHeroHeaderBackground: HeroHeaderBackgroundComponent = IosHeroHeaderBackground
export const _androidHeroHeaderBackground: HeroHeaderBackgroundComponent = AndroidHeroHeaderBackground
export const _iosNativeSubtitle: NativeSubtitleComponent = IosNativeSubtitle
export const _androidNativeSubtitle: NativeSubtitleComponent = AndroidNativeSubtitle

// What kara builds has to fit the native stack's own options. Expo Router's are a fork of React Navigation's
// native stack, the same shapes, so this holds for both.
export const _headerOptions = (options: HeaderOptions): NativeStackNavigationOptions => options
export const _stackOptions = (options: StackScreenOptions): NativeStackNavigationOptions => options
export const _searchBarOptions = (options: HeaderSearchBarOptions): NativeStackNavigationOptions => ({
  headerSearchBarOptions: options,
})
