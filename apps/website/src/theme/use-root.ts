'use client'

import {useSyncExternalStore} from 'react'

import type {Platform, Theme} from './theme'

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {attributeFilter: ['class', 'data-platform']})
  return () => observer.disconnect()
}

const themeSnapshot = (): Theme => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')
const platformSnapshot = (): Platform => (document.documentElement.dataset.platform === 'android' ? 'android' : 'ios')

/** Follows the `dark` class the head script and the toggle write on `<html>`. */
export const useColorScheme = () => useSyncExternalStore(subscribe, themeSnapshot, (): Theme => 'light')

/** Follows the `data-platform` the head script and the platform switch write on `<html>`. */
export const usePlatform = () => useSyncExternalStore(subscribe, platformSnapshot, (): Platform => 'ios')
