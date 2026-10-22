import {duration} from '@hzblj/kara-theme'
import {Platform} from 'react-native'
import {ZOOM_TRANSITION_PARAM} from './zoom-transition-param'

type RouteProps = {route: {params?: object}}

type ZoomAnimation = {animation?: 'fade'; animationDuration?: number}

const hasZoomSource = (params: object | undefined) =>
  !!params && !!(params as Record<string, unknown>)[ZOOM_TRANSITION_PARAM]

/**
 * `Stack.Screen` options for a screen the zoom pushes. On Android a push whose params carry `ZOOM_TRANSITION_PARAM`
 * becomes a quick fade, so Material's container transform reads as the transition instead of racing the stack's own
 * slide; any other push keeps the stack's animation. Your options win: set `animation` yourself to keep another one.
 * iOS needs nothing — UIKit's zoom replaces the push animation.
 */
export const withZoomTransition =
  <TOptions extends object>(options?: TOptions | ((props: RouteProps) => TOptions)) =>
  (props: RouteProps): Partial<TOptions> & ZoomAnimation => {
    const resolved: Partial<TOptions> = (typeof options === 'function' ? options(props) : options) ?? {}

    if (Platform.OS !== 'android' || !hasZoomSource(props.route.params)) {
      return resolved
    }

    return {animation: 'fade', animationDuration: duration.d300, ...resolved}
  }
