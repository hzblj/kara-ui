import {useMemo} from 'react'
import type {ViewStyle} from 'react-native'
import type {NavigationTitleLineMotion, NavigationTitleTransition} from '../../navigation-title-transition'
import {requireKaraView} from '../../require-view'
import type {NavigationItemSubtitleProps} from './navigation-item-subtitle.types'

type NativeTiming = {
  bezier?: number[]
  dampingFraction?: number
  duration?: number
  easing?: string
  response?: number
  type: 'spring' | 'timing'
}

type NativeLineMotion = Omit<NavigationTitleLineMotion, 'timing'> & {timing?: NativeTiming}

type NativeTransition = {
  exit?: string
  preset?: string
  subtitle?: NativeLineMotion
  title?: NativeLineMotion
}

type NativeNavigationItemSubtitleProps = Omit<NavigationItemSubtitleProps, 'transition'> & {
  disableForceFlatten: boolean
  style: ViewStyle
  transition?: NativeTransition
}

const CONTENTS_STYLE: ViewStyle = {display: 'contents'}

const NativeNavigationItemSubtitle = requireKaraView<NativeNavigationItemSubtitleProps>('NavigationItemSubtitleView')

const toNativeLine = (motion?: NavigationTitleLineMotion): NativeLineMotion | undefined => {
  if (!motion) {
    return undefined
  }

  const {timing, ...rest} = motion

  if (!timing) {
    return rest
  }

  if (timing.type === 'spring') {
    return {...rest, timing}
  }

  const {easing, ...timingRest} = timing

  if (Array.isArray(easing)) {
    return {...rest, timing: {...timingRest, bezier: easing}}
  }

  return {...rest, timing: {...timingRest, easing}}
}

const toNativeTransition = (transition?: NavigationTitleTransition): NativeTransition | undefined => {
  if (transition === undefined) {
    return undefined
  }

  if (typeof transition === 'string') {
    return {preset: transition}
  }

  return {
    exit: transition.exit,
    preset: transition.preset,
    subtitle: toNativeLine(transition.subtitle),
    title: toNativeLine(transition.title),
  }
}

/**
 * iOS 26: the screen's title on the leading side with a subtitle under it, UIKit's own (`style = .browser` and
 * `attributedSubtitle` on the screen's navigation item), so the two truncate and morph between screens natively. Mount
 * it anywhere in the screen's tree; it takes no room (`display: contents`). `subtitleHidden` hides both, and showing or
 * hiding them plays `transition`. Earlier iOS ignores it.
 */
export const NavigationItemSubtitle = ({transition, ...props}: NavigationItemSubtitleProps) => {
  const nativeTransition = useMemo(() => toNativeTransition(transition), [transition])

  return (
    <NativeNavigationItemSubtitle {...props} disableForceFlatten style={CONTENTS_STYLE} transition={nativeTransition} />
  )
}
