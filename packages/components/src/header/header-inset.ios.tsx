import {SafeAreaView} from 'react-native-screens/experimental'

import type {HeaderInsetComponent, HeaderInsetProps} from './header.types'

const TOP_EDGE = {top: true}
const INSET_STYLE = {flex: 0}

export const HeaderInset: HeaderInsetComponent = ({children}: HeaderInsetProps) => (
  <SafeAreaView edges={TOP_EDGE} pointerEvents="box-none" style={INSET_STYLE}>
    {children}
  </SafeAreaView>
)
