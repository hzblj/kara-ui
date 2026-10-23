import {type ComponentType, type ElementType, useRef} from 'react'
import {FlatList, Image, ScrollView, Text, View} from 'react-native'
import Animated from 'react-native-reanimated'

type AnyComponent = ComponentType<Record<string, unknown>>

/** React Native's own views already have a Reanimated twin; wrapping them again would only add a second one. */
const KNOWN: [ElementType, ElementType][] = [
  [View, Animated.View],
  [Text, Animated.Text],
  [Image, Animated.Image],
  [ScrollView, Animated.ScrollView],
  [FlatList, Animated.FlatList],
]

const twins = new WeakMap<object, AnyComponent>(KNOWN as [object, AnyComponent][])

/**
 * The Reanimated version of a component, made once for the life of the app: `createAnimatedComponent` per render would
 * be a new component type every time, and React would remount the subtree under it.
 */
export const animatedTwin = (Component: ElementType): AnyComponent => {
  if (typeof Component === 'string') {
    return Component as unknown as AnyComponent
  }

  let twin = twins.get(Component)

  if (!twin) {
    twin = Animated.createAnimatedComponent(Component as AnyComponent) as unknown as AnyComponent
    twins.set(Component, twin)
  }

  return twin
}

/** Reanimated's handle from `useAnimatedStyle`, or a CSS animation or transition written into the style by hand. */
const isAnimatedEntry = (entry: object): boolean =>
  'viewDescriptors' in entry || 'animationName' in entry || 'transitionProperty' in entry || 'transition' in entry

/** Whether a `style` prop holds anything only a Reanimated view can run. Walks nested arrays, as React Native does. */
export const isAnimatedStyle = (style: unknown): boolean => {
  if (Array.isArray(style)) {
    return style.some(isAnimatedStyle)
  }

  return typeof style === 'object' && style !== null && isAnimatedEntry(style)
}

const warned = new Set<string>()

/**
 * Whether the view renders through Reanimated, decided when it mounts and kept: switching later would change the
 * component type, and React would remount everything under it, playing its `entering` again and losing its state. A
 * view that starts plain and asks for motion later stays plain, and says so once in development.
 */
export const useAnimatedLatch = (wanted: boolean, name: string): boolean => {
  const latched = useRef(wanted)

  if (__DEV__ && wanted && !latched.current && !warned.has(name)) {
    warned.add(name)
    console.warn(
      `[kara-ui] ${name} mounted without motion and got an animated style or motion props later, which it ignores. Pass \`animated\` from the start, or give it a new \`key\`.`
    )
  }

  return latched.current
}

const motionComponents = new WeakSet<object>()

/**
 * Marks a component as one that takes the motion props itself (`entering`, `exiting`, `layout`, `animate`), so
 * `Stagger` can hand them to it directly instead of wrapping it in a view of its own. Every `sx()` component is marked;
 * a component built on `useSplitSxMotion` marks itself.
 */
export const markMotionComponent = <TComponent extends object>(Component: TComponent): TComponent => {
  motionComponents.add(Component)

  return Component
}

/** Whether `type` (an element's `type`) takes the motion props itself. */
export const isMotionComponent = (type: unknown): boolean =>
  (typeof type === 'object' || typeof type === 'function') && type !== null && motionComponents.has(type)
