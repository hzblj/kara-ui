import {Box, Image, RnScrollView, RnText} from '@hzblj/kara-ui'
import {useZoomTransitionParam, ZoomTransition} from '@hzblj/kara-ui/router'
import {useLocalSearchParams} from 'expo-router'
import {StyleSheet} from 'react-native'

import {enablerProps, photo as findPhoto, parseSettings, type ZoomSettings} from './photos'

const styles = StyleSheet.create({
  photo: {aspectRatio: 3 / 4, width: '100%'},
})

/**
 * The page a photo zooms into. The enabler renders first and unconditionally — on iOS it has to exist in the screen's
 * first commit — and the photo is the target, loaded from the card's URL with no fade so it is there for the zoom.
 */
export const ZoomDetailScreen = () => {
  const {id, ...params} = useLocalSearchParams<Partial<Record<keyof ZoomSettings, string>> & {id: string}>()
  const sourceId = useZoomTransitionParam()
  const entry = findPhoto(id)

  return (
    <>
      <ZoomTransition.Enabler sourceIdentifier={sourceId} {...enablerProps(parseSettings(params))} />
      <RnScrollView
        bg="surface.base"
        content={{gap: 's20', pb: 's48', pt: 's8', px: 's20'}}
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
            <Box gap="s8">
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
    </>
  )
}
