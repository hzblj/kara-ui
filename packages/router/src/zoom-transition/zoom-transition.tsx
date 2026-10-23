import {ZoomTransition as NativeZoomTransition} from '@hzblj/expo-zoom-transition'
import {duration, radii, useAppTheme} from '@hzblj/kara-theme'

import type {
  ZoomTransitionComponent,
  ZoomTransitionEnablerProps,
  ZoomTransitionSourceProps,
  ZoomTransitionTargetProps,
} from './zoom-transition.types'

/*
 * `@hzblj/expo-zoom-transition` with the theme's tokens in place of its plain values: a radius token for the Android
 * corners, a duration token for the transform, a colour token for the scrim. Everything native is the package's.
 */

const Source = ({android, children, identifier}: ZoomTransitionSourceProps) => (
  <NativeZoomTransition.Source
    android={android && {borderRadius: radii[android.borderRadius ?? 'none']}}
    identifier={identifier}
  >
    {children}
  </NativeZoomTransition.Source>
)

const Target = ({android, children, identifier, ios}: ZoomTransitionTargetProps) => (
  <NativeZoomTransition.Target
    android={android && {...android, borderRadius: radii[android.borderRadius ?? 'none']}}
    identifier={identifier}
    ios={ios}
  >
    {children}
  </NativeZoomTransition.Target>
)

const Enabler = ({android, ios, scrim, sourceIdentifier}: ZoomTransitionEnablerProps) => {
  const theme = useAppTheme()

  return (
    <NativeZoomTransition.Enabler
      android={android && {...android, duration: android.duration ? duration[android.duration] : undefined}}
      ios={ios}
      scrim={scrim ? theme.color(scrim) : undefined}
      sourceIdentifier={sourceIdentifier}
    />
  )
}

export const ZoomTransition: ZoomTransitionComponent = {Enabler, Source, Target}
