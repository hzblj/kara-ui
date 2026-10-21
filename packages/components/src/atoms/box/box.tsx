import {sx} from '@hzblj/kara-sx'
import {View} from 'react-native'

/**
 * A React Native `View` that takes the design system's `sx` props. The `sx()` HOC is the whole
 * implementation — Box is just its first caller, and any other style-taking component gets the same.
 */
export const Box = sx(View)
