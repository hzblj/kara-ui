import {useAppTheme} from '@hzblj/kara-theme'
import {Platform, Pressable, StyleSheet, View} from 'react-native'
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated'
import {SafeAreaView} from 'react-native-screens/experimental'

const SCRIM_OPACITY = 0.7
const ENTERING = FadeIn.duration(200)
const EXITING = FadeOut.duration(200)
const TOP_EDGE = {top: true}

const styles = StyleSheet.create({
  fill: {flex: 1},
  layer: {bottom: 0, left: 0, position: 'absolute', right: 0, zIndex: 10},
})

type HeaderSearchScrimProps = {
  onPress: () => void
  topOffset: number
}

/**
 * Washes the content out while the search field is focused and empty, as the system's own search does without
 * dimming the bar; a tap on it ends the search. iOS starts it under the bar, following the bar natively
 * (react-native-screens' `SafeAreaView`), Android under the search row.
 */
export const HeaderSearchScrim = ({onPress, topOffset}: HeaderSearchScrimProps) => {
  const theme = useAppTheme()
  const scrim = (
    <Animated.View
      entering={ENTERING}
      exiting={EXITING}
      style={[styles.fill, {backgroundColor: theme.color('surface.base'), opacity: SCRIM_OPACITY}]}
    >
      <Pressable accessible={false} onPress={onPress} style={styles.fill} />
    </Animated.View>
  )

  return (
    <View pointerEvents="box-none" style={[styles.layer, {top: topOffset}]}>
      {Platform.OS === 'ios' ? (
        <SafeAreaView edges={TOP_EDGE} pointerEvents="box-none" style={styles.fill}>
          {scrim}
        </SafeAreaView>
      ) : (
        scrim
      )}
    </View>
  )
}
