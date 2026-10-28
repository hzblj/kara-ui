import type {NativeStackNavigationOptions} from 'expo-router'

import type {HeaderInsetComponent, HeaderOptions, StackScreenOptions} from './header.types'
import {HeaderInset as AndroidHeaderInset} from './header-inset.android'
import {HeaderInset as IosHeaderInset} from './header-inset.ios'
import {toHeaderOptions as androidHeaderOptions} from './header-options.android'
import {toHeaderOptions as iosHeaderOptions} from './header-options.ios'
import type {HeaderOptionsBuilder} from './header-options.types'
import {useHeaderBarInset as androidHeaderBarInset} from './use-header-bar-inset.android'
import {useHeaderBarInset as iosHeaderBarInset} from './use-header-bar-inset.ios'
import type {UseHeaderBarInset} from './use-header-bar-inset.types'

export const _iosHeaderOptions: HeaderOptionsBuilder = iosHeaderOptions
export const _androidHeaderOptions: HeaderOptionsBuilder = androidHeaderOptions
export const _iosHeaderInset: HeaderInsetComponent = IosHeaderInset
export const _androidHeaderInset: HeaderInsetComponent = AndroidHeaderInset
export const _iosHeaderBarInset: UseHeaderBarInset = iosHeaderBarInset
export const _androidHeaderBarInset: UseHeaderBarInset = androidHeaderBarInset

// What kara builds has to fit the native stack's own options. Expo Router's are a fork of React Navigation's
// native stack, the same shapes, so this holds for both.
export const _headerOptions = (options: HeaderOptions): NativeStackNavigationOptions => options
export const _stackOptions = (options: StackScreenOptions): NativeStackNavigationOptions => options
