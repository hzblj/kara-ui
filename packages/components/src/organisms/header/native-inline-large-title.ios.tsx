import {InlineLargeTitle} from '@hzblj/kara-native/swift-ui'

import type {NativeInlineLargeTitleComponent} from './native-inline-large-title.types'

/** iOS 17 keeps the large title in the bar row, next to the bar items (`LargeTitleDisplayMode.inline`). */
export const NativeInlineLargeTitle: NativeInlineLargeTitleComponent = () => <InlineLargeTitle />
