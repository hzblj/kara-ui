import {
  ZoomTransitionEnabler as NativeZoomTransitionEnabler,
  ZoomTransitionSource as NativeZoomTransitionSource,
  ZoomTransitionTarget as NativeZoomTransitionTarget,
  reverseZoomTransition,
} from '@hzblj/kara-native/jetpack-compose'
import {duration, radii, useAppTheme} from '@hzblj/kara-theme'
import {useNavigation} from 'expo-router'
import {useEffect, useMemo} from 'react'
import type {
  ZoomTransitionComponent,
  ZoomTransitionEnablerProps,
  ZoomTransitionSourceProps,
  ZoomTransitionTargetProps,
} from './zoom-transition.types'

const Source = ({android, children, identifier}: ZoomTransitionSourceProps) =>
  identifier ? (
    <NativeZoomTransitionSource cornerRadius={radii[android?.borderRadius ?? 'none']} identifier={identifier}>
      {children}
    </NativeZoomTransitionSource>
  ) : (
    children
  )

const Target = ({android, children, identifier}: ZoomTransitionTargetProps) => {
  const flex = android?.flex
  const style = useMemo(() => (flex === undefined ? undefined : {flex}), [flex])

  if (!identifier) {
    return children
  }

  return (
    <NativeZoomTransitionTarget
      cornerRadius={radii[android?.borderRadius ?? 'none']}
      identifier={identifier}
      isFittedToSourceAspectRatio={android?.fit === 'photo'}
      style={style}
    >
      {children}
    </NativeZoomTransitionTarget>
  )
}

/**
 * The target starts the way in natively once it is laid out. The way back cannot wait for the target to go: the pop is
 * native, and by the time the screen unmounts it is already sliding away. So the transform is played back from
 * `beforeRemove`, while the target is still on screen.
 */
const Enabler = ({android, scrim, sourceIdentifier}: ZoomTransitionEnablerProps) => {
  const navigation = useNavigation()
  const theme = useAppTheme()

  useEffect(() => {
    if (!sourceIdentifier) {
      return
    }

    return navigation.addListener('beforeRemove', () => {
      void reverseZoomTransition(sourceIdentifier)
    })
  }, [navigation, sourceIdentifier])

  if (!sourceIdentifier) {
    return null
  }

  return (
    <NativeZoomTransitionEnabler
      easing={android?.easing}
      fadeMode={android?.fade}
      pathMotion={android?.path}
      scrimColor={scrim ? theme.color(scrim) : undefined}
      sourceIdentifier={sourceIdentifier}
      transformDuration={android?.duration ? duration[android.duration] : undefined}
    />
  )
}

export const ZoomTransition: ZoomTransitionComponent = {Enabler, Source, Target}
