import {useEffect} from 'react'
import {StyleSheet} from 'react-native'
import Animated, {Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming} from 'react-native-reanimated'

const styles = StyleSheet.create({
  ticker: {backgroundColor: '#808080', height: 4, left: 0, position: 'absolute', top: 0, width: 4},
})

/**
 * A speck in the top corner that never stops moving, while a timeline plays. Simulator and emulator recordings only
 * carry a frame when the screen changes, so a scene holding still for a few seconds would come back shorter than it
 * was recorded — and a cut one loop long could not be taken from it. This keeps a frame coming every refresh. It sits
 * under the status bar, outside every band the capture script keeps.
 */
export const Ticker = () => {
  const offset = useSharedValue(0)

  useEffect(() => {
    offset.value = withRepeat(withTiming(40, {duration: 700, easing: Easing.linear}), -1, true)
  }, [offset])

  const style = useAnimatedStyle(() => ({transform: [{translateX: offset.value}]}), [])

  return <Animated.View pointerEvents="none" style={[styles.ticker, style]} />
}
