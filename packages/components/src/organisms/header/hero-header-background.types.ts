import type {ReactNode} from 'react'
import type {SharedValue} from 'react-native-reanimated'

export type HeroHeaderBackgroundProps = {
  /** The bar's height, status bar included. */
  height: number
  /** How far the header has faded in: 0 over the hero, 1 revealed. */
  progress: SharedValue<number>
}

export type HeroHeaderBackgroundComponent = (props: HeroHeaderBackgroundProps) => ReactNode
