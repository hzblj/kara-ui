import {type ComponentPropsWithRef, type ComponentType, type ElementType, memo} from 'react'
import type {StyleProp, TextStyle, ViewStyle} from 'react-native'

import type {ResponsiveViewSx} from './responsive-sx'
import {useSplitSx} from './use-sx'

/**
 * `sx()` resolves a view style; React Native's text and image styles accept those keys too, so this
 * covers every flavour of `style` a wrapped component might declare.
 */
type SxStyle = StyleProp<TextStyle | ViewStyle>

/** The wrapped component's own props — ref included — with the whole `sx` surface added. */
export type SxProps<TProps> = Omit<TProps, 'style' | keyof ResponsiveViewSx> &
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
 * Props come from `ComponentPropsWithRef`, so a `ref` survives the wrapping. The component has to
 * accept a `style`; that cannot be a constraint here, because narrowing `TComponent` past
 * `ElementType` is what breaks the ref inference.
 *
 * Memoised because the point of the cache is a stable style object — without `memo` a parent
 * re-render would walk the child anyway and throw that stability away.
 */
export const sx = <TComponent extends ElementType>(Component: TComponent) => {
  const Sxed = ({style, ...props}: SxProps<ComponentPropsWithRef<TComponent>>) => {
    const [resolved, rest] = useSplitSx(props as Record<string, unknown>)
    const Styled = Component as ComponentType<Record<string, unknown>>

    return <Styled {...rest} style={style ? [resolved, style] : resolved} />
  }

  Sxed.displayName = `sx(${nameOf(Component)})`

  return memo(Sxed)
}
