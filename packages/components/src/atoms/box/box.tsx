import {sx} from '@hzblj/kara-sx'
import {View} from 'react-native'

/**
 * A React Native `View` that takes the design system's `sx` props. The `sx()` HOC is the whole
 * implementation — Box is just its first caller, and any other style-taking component gets the same.
 *
 * That includes motion: `entering`, `exiting`, `layout`, `animate` or an animated `style` make it an `Animated.View`
 * from its first frame, and without them it stays a plain `View`.
 */
export const Box = sx(View)
