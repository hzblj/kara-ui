import type {AccessibilityProps, MotionProps, ResponsiveViewSx} from '@hzblj/kara-sx'
import type {OpacitySize} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

import type {Haptic} from '../../haptics'

/** How the content answers a press: it eases down, it dims, or it stays still. */
export type PressEffect = 'none' | 'opacity' | 'scale'

/**
 * React Native's `Pressable`, styled through `sx` like a `Box`, taking touches 8 points past its edges. Each platform
 * presses its own way by default: iOS eases the content down to 96%, Android draws Material's ripple over it,
 * clipped to the pressable's shape. `pressEffect` picks the same answer on both, and Android keeps its ripple on top
 * unless `ripple` is off. Give it the `borderRadius` of what it wraps (`full` around a `GlassView`). Screen readers read
 * it as a button unless `accessibilityRole` names another role. It takes the motion props a `Box` does: `animate` a
 * selected state's `bg`, or let it arrive with `entering`. The React Native tier: it needs no host.
 */
export type PressableProps = ResponsiveViewSx &
  Omit<MotionProps, 'animated'> &
  AccessibilityProps & {
    /** The pressable content. */
    children?: ReactNode
    /** Ignores presses: no `onPress`, no haptic, no press effect or ripple. */
    disabled?: boolean
    /** Played on press. `true` is a `light` impact; a name picks the haptic, e.g. `selection` for a choice. */
    haptic?: boolean | Haptic
    /** Called when the press is released, after the `haptic` plays. */
    onPress?: () => void
    /**
     * How the content answers while it is held. `scale` eases it down to `pressedScale`, `opacity` dims it to
     * `pressedOpacity`, `none` leaves it still. `scale` on iOS and `none` on Android by default, where the ripple is the
     * press. With motion reduced, `scale` dims instead: the press still shows, and nothing moves.
     */
    pressEffect?: PressEffect
    /** What `opacity` dims to, an opacity token. `o60` by default. */
    pressedOpacity?: OpacitySize
    /** What `scale` eases down to. `0.96` by default: lower reads as a squash, not a press. */
    pressedScale?: number
    /** Android's ripple: Material's pressed state layer over the content, clipped to the shape. On by default. iOS has none. */
    ripple?: boolean
    /** Test identifier, forwarded to the view. */
    testID?: string
  }

export type PressableComponent = (props: PressableProps) => ReactNode
