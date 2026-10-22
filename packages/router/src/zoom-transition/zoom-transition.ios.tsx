import {
  ZoomTransitionEnabler as NativeZoomTransitionEnabler,
  ZoomTransitionSource as NativeZoomTransitionSource,
  ZoomTransitionTarget as NativeZoomTransitionTarget,
} from '@hzblj/kara-native/swift-ui'
import {useAppTheme} from '@hzblj/kara-theme'
import type {
  ZoomTransitionComponent,
  ZoomTransitionEnablerProps,
  ZoomTransitionSourceProps,
  ZoomTransitionTargetProps,
} from './zoom-transition.types'

const Source = ({children, identifier}: ZoomTransitionSourceProps) =>
  identifier ? <NativeZoomTransitionSource identifier={identifier}>{children}</NativeZoomTransitionSource> : children

const Target = ({children, identifier, ios}: ZoomTransitionTargetProps) =>
  identifier ? (
    <NativeZoomTransitionTarget identifier={identifier} isAspectRatioMatched={ios?.fit !== 'target'}>
      {children}
    </NativeZoomTransitionTarget>
  ) : (
    children
  )

/** UIKit's zoom on the screen's own view controller; the source and target are looked up natively by identifier. */
const Enabler = ({ios, scrim, sourceIdentifier}: ZoomTransitionEnablerProps) => {
  const theme = useAppTheme()

  if (!sourceIdentifier) {
    return null
  }

  const dismissGesture = ios?.dismissGesture ?? 'any'

  return (
    <NativeZoomTransitionEnabler
      dimmingBlur={ios?.blur}
      dimmingColor={scrim ? theme.color(scrim) : undefined}
      isDismissalEnabled={dismissGesture !== 'none'}
      isHorizontalDismissalEnabled={dismissGesture === 'any'}
      sourceIdentifier={sourceIdentifier}
    />
  )
}

export const ZoomTransition: ZoomTransitionComponent = {Enabler, Source, Target}
