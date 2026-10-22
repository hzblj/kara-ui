import {Box, GlassView, Image, Pressable, RnIcon, RnScrollView, RnText} from '@hzblj/kara-ui'
import {useZoomTransitionParam, ZoomTransition} from '@hzblj/kara-ui/router'
import {router, useLocalSearchParams} from 'expo-router'
import {Platform, StyleSheet} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import {enablerProps, photo as findPhoto, parseSettings, type ZoomSettings} from './photos'

const styles = StyleSheet.create({
  photo: {aspectRatio: 3 / 4, width: '100%'},
})

/** iOS draws its own close over the photo: the modal has no native bar there (see the root layout). */
const CloseButton = () => {
  const {top} = useSafeAreaInsets()

  return (
    <Box position="absolute" right={16} top={top + 8}>
      <Pressable haptic onPress={() => router.back()} testID="photo-close">
        <GlassView interactive p="s12">
          <Box pointerEvents="none">
            <RnIcon name="close" size="s20" />
          </Box>
        </GlassView>
      </Pressable>
    </Box>
  )
}

/**
 * The full-screen page a photo zooms into. The enabler renders first and unconditionally — on iOS it has to exist in
 * the screen's first commit — and the photo is the target, loaded from the card's URL with no fade so it is there for
 * the zoom. A drag down is UIKit's own interactive dismissal; the close and the system back do the same.
 */
export const ZoomDetailScreen = () => {
  const {id, ...params} = useLocalSearchParams<Partial<Record<keyof ZoomSettings, string>> & {id: string}>()
  const sourceId = useZoomTransitionParam()
  const entry = findPhoto(id)
  const isIos = Platform.OS === 'ios'

  return (
    <>
      <ZoomTransition.Enabler sourceIdentifier={sourceId} {...enablerProps(parseSettings(params))} />
      <RnScrollView
        bg="surface.base"
        content={{gap: 's20', pb: 's48', pt: isIos ? 's8' : 's16', px: 's8'}}
        contentInsetAdjustmentBehavior="automatic"
        flex={1}
      >
        {entry ? (
          <>
            <ZoomTransition.Target android={{borderRadius: 'large'}} identifier={sourceId}>
              <Box bg="surface.primary" borderRadius="large" overflow="hidden">
                <Image
                  cachePolicy="memory-disk"
                  contentFit="cover"
                  source={{uri: entry.uri}}
                  style={styles.photo}
                  transition={null}
                />
              </Box>
            </ZoomTransition.Target>
            <Box gap="s8" px="s12">
              <RnText variant="headingS">{entry.title}</RnText>
              <RnText color="content.secondary" variant="body">
                {entry.caption}
              </RnText>
            </Box>
          </>
        ) : (
          <RnText color="content.secondary" variant="body">
            This photo does not exist.
          </RnText>
        )}
      </RnScrollView>
      {isIos ? <CloseButton /> : null}
    </>
  )
}
