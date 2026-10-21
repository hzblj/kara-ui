import type {NativeCountdownProps} from '../../countdown.types'
import {requireKaraView} from '../../require-view'

/** The SwiftUI countdown. Renders inside a SwiftUI `Host`, laid over a React Native text of the same shape. */
export const Countdown = requireKaraView<NativeCountdownProps>('CountdownView')
