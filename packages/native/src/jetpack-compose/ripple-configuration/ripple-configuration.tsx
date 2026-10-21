import type {ReactNode} from 'react'
import type {ColorValue} from 'react-native'

import {requireKaraView} from '../../require-view'

export type RippleConfigurationProps = {
  children: ReactNode
  /**
   * Every Material ripple below takes this colour instead of its content colour, and its alpha as every state's
   * alpha — Material would otherwise replace the colour's own alpha with its `RippleAlpha`.
   */
  color: ColorValue
}

/** Provides `LocalRippleConfiguration` to the Compose children. Wrap a host's content in it. */
export const RippleConfiguration = requireKaraView<RippleConfigurationProps>('RippleConfigurationView')
