import {isScrollEdgeEffectAvailable} from '@hzblj/kara-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

/** iOS 26's navigation bar is 54pt, the 44pt row of items plus room for its glass; before it the bar was the row. */
const BAR_HEIGHT = isScrollEdgeEffectAvailable() ? 54 : 44

export const useHeaderBarInset = () => useSafeAreaInsets().top + BAR_HEIGHT
