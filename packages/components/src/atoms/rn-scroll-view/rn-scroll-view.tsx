import {useSplitSx, useSx} from '@hzblj/kara-sx'
import {ScrollView as RNScrollView} from 'react-native'
import type {RnScrollViewComponent, RnScrollViewProps} from './rn-scroll-view.types'

/** Stands in for an absent `content`, because a hook cannot be called conditionally. */
const NO_SX = {}

export const RnScrollView: RnScrollViewComponent = ({
  axis = 'vertical',
  children,
  content,
  showsIndicators = true,
  testID,
  ...props
}: RnScrollViewProps) => {
  const [style, rest] = useSplitSx(props)
  const contentStyle = useSx(content ?? NO_SX)

  return (
    <RNScrollView
      contentContainerStyle={content === undefined ? undefined : contentStyle}
      horizontal={axis === 'horizontal'}
      showsHorizontalScrollIndicator={showsIndicators}
      showsVerticalScrollIndicator={showsIndicators}
      style={style}
      testID={testID}
      {...rest}
    >
      {children}
    </RNScrollView>
  )
}
