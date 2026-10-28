import type {ReactNode} from 'react'

import {requireKaraView} from '../../require-view'

export type LargeTitleFadeProps = {
  children?: ReactNode
}

/**
 * Content under a native header that fades out and back with the large title when the header search hides it, in the
 * same frame as UIKit's own animation. Takes no touches while hidden. iOS only.
 */
export const LargeTitleFade = requireKaraView<LargeTitleFadeProps>('LargeTitleFadeView')
