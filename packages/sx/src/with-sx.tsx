import {type ComponentPropsWithRef, type ComponentType, type ElementType, memo} from 'react'
import type {StyleProp, TextStyle, ViewStyle} from 'react-native'
import type {AnimatedStyle} from 'react-native-reanimated'

import {animatedTwin, isAnimatedStyle, markMotionComponent, useAnimatedLatch} from './animated-twin'
import type {MotionProps} from './motion.types'
import type {ResponsiveViewSx} from './responsive-sx'
import {useSplitSxMotion} from './use-sx'

/**
 * `sx()` resolves a view style; React Native's text and image styles accept those keys too, so this
 * covers every flavour of `style` a wrapped component might declare, plain or from `useAnimatedStyle`.
 */
type SxStyle = StyleProp<AnimatedStyle<TextStyle | ViewStyle>>

/** The wrapped component's own props (ref included) with the whole `sx` surface and the motion props added. */
export type SxProps<TProps> = Omit<TProps, 'style' | keyof ResponsiveViewSx | keyof MotionProps> &
  MotionProps &
  ResponsiveViewSx & {
    style?: SxStyle
  }

const nameOf = (Component: ElementType): string => {
  if (typeof Component === 'string') {
    return Component
  }

  const {displayName, name} = Component as ComponentType<never>

  return displayName || name || 'Component'
}

/**
 * Turns any style-taking component into an `sx` one: the `sx` props are split off, resolved against
 * the theme and handed over as `style`. An explicit `style` still wins — it is merged on top.
 *
 * It is a Reanimated component by itself when it has to be: motion props (`entering`, `exiting`, `layout`,
 * `animate`, `animated`), an animated `style` from `useAnimatedStyle` or `animatedProps` make it render the
 * component's Reanimated twin from the first frame on, and without them it renders the component itself, at no cost
 * beyond a lookup. The choice is made at mount (`useAnimatedLatch`).
 *
 * Props come from `ComponentPropsWithRef`, so a `ref` survives the wrapping. The component has to
 * accept a `style`; that cannot be a constraint here, because narrowing `TComponent` past
 * `ElementType` is what breaks the ref inference.
 *
 * Memoised because the point of the cache is a stable style object — without `memo` a parent
 * re-render would walk the child anyway and throw that stability away.
 */
export const sx = <TComponent extends ElementType>(Component: TComponent) => {
  const displayName = `sx(${nameOf(Component)})`

  const Sxed = ({style, ...props}: SxProps<ComponentPropsWithRef<TComponent>>) => {
    const [resolved, motion, rest] = useSplitSxMotion(props as Record<string, unknown>)
    const animated = useAnimatedLatch(
      motion.animated || isAnimatedStyle(style) || rest.animatedProps !== undefined,
      displayName
    )

    if (!animated) {
      const Plain = Component as ComponentType<Record<string, unknown>>

      return <Plain {...rest} style={style ? [resolved, style] : resolved} />
    }

    const Twin = animatedTwin(Component)

    return (
      <Twin
        {...rest}
        entering={motion.entering}
        exiting={motion.exiting}
        layout={motion.layout}
        style={[resolved, motion.style, style]}
      />
    )
  }

  Sxed.displayName = displayName

  return markMotionComponent(memo(Sxed))
}
