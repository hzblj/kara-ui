import type {NativeCountdownProps} from '../../countdown.types'
import {requireKaraView} from '../../require-view'

/**
 * The Compose countdown. Renders inside a Compose `Host`, laid over a React Native text of the same shape. Compose
 * scales `fontSize`/`lineHeight` by the font scale itself, so pass them unscaled.
 */
export const Countdown = requireKaraView<NativeCountdownProps>('CountdownView')
