import {Box, ContextMenu, Image, type MenuAction, Pressable, RnText, SegmentedControl} from '@hzblj/kara-ui'
import {useZoomTransitionSourceId, ZOOM_TRANSITION_PARAM, ZoomTransition} from '@hzblj/kara-ui/router'
import {router, useLocalSearchParams} from 'expo-router'
import {useMemo, useState} from 'react'
import {Platform} from 'react-native'

import {Section} from '../../ui'
import {isShot} from '../shot'
import {DEFAULT_SETTINGS, PHOTOS, type Photo, type ZoomSettings} from './photos'

type Choice<TValue extends string> = {label: string; value: TValue}

type SettingProps<TValue extends string> = {
  choices: Choice<TValue>[]
  label: string
  onChange: (value: TValue) => void
  value: TValue
}

const Setting = <TValue extends string>({choices, label, onChange, value}: SettingProps<TValue>) => (
  <Box gap="s8">
    <RnText color="content.secondary" variant="footnote">
      {label}
    </RnText>
    <SegmentedControl
      onChange={index => {
        const choice = choices[index]

        if (choice) {
          onChange(choice.value)
        }
      }}
      selectedIndex={Math.max(
        0,
        choices.findIndex(choice => choice.value === value)
      )}
      values={choices.map(choice => choice.label)}
    />
  </Box>
)

const BACKGROUNDS: Choice<ZoomSettings['background']>[] = [
  {label: 'Default', value: 'default'},
  {label: 'Tinted', value: 'tinted'},
  ...(Platform.OS === 'ios' ? [{label: 'Blurred', value: 'blurred' as const}] : []),
]

const DISMISSALS: Choice<ZoomSettings['dismiss']>[] = [
  {label: 'Any swipe', value: 'any'},
  {label: 'Swipe down', value: 'vertical'},
  {label: 'Back only', value: 'none'},
]

const PATHS: Choice<ZoomSettings['path']>[] = [
  {label: 'Arc', value: 'arc'},
  {label: 'Straight', value: 'linear'},
]

const SPEEDS: Choice<ZoomSettings['speed']>[] = [
  {label: 'Quick', value: 'quick'},
  {label: 'Default', value: 'default'},
  {label: 'Slow', value: 'slow'},
]

type PhotoCardProps = {
  photo: Photo
  settings: ZoomSettings
}

const PhotoCard = ({photo, settings}: PhotoCardProps) => {
  const sourceId = useZoomTransitionSourceId(photo.id)

  const open = () =>
    router.push({
      params: {...settings, id: photo.id, [ZOOM_TRANSITION_PARAM]: sourceId},
      pathname: '/photo/[id]',
    })

  const actions = useMemo<MenuAction[]>(
    () => [
      {icon: 'share', label: 'Share', onPress: () => undefined},
      {icon: 'heart', label: 'Add to favourites', onPress: () => undefined},
    ],
    []
  )

  return (
    <ContextMenu
      actions={actions}
      flex={1}
      onPreviewPress={open}
      preview={
        <Box bg="surface.primary" borderRadius="large" overflow="hidden">
          <Image cachePolicy="memory-disk" contentFit="cover" h={360} source={{uri: photo.uri}} w={270} />
        </Box>
      }
    >
      <Pressable gap="s8" onPress={open}>
        <ZoomTransition.Source android={{borderRadius: 'large'}} identifier={sourceId}>
          <Box bg="surface.primary" borderRadius="large" overflow="hidden">
            <Image
              aspectRatio={3 / 4}
              cachePolicy="memory-disk"
              contentFit="cover"
              source={{uri: photo.uri}}
              w="100%"
            />
          </Box>
        </ZoomTransition.Source>
        <RnText variant="subheadlineMedium">{photo.title}</RnText>
      </Pressable>
    </ContextMenu>
  )
}

/** The catalogue page's demo: a grid of photos that zoom into their page, and the settings to try on the way. */
export const ZoomTransitionDemo = () => {
  const shot = isShot(useLocalSearchParams())
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const set =
    <TKey extends keyof ZoomSettings>(key: TKey) =>
    (value: ZoomSettings[TKey]) =>
      setSettings(current => ({...current, [key]: value}))

  const rows = [PHOTOS.slice(0, 2), PHOTOS.slice(2, 4)]

  return (
    <>
      <Section
        caption={
          shot
            ? undefined
            : Platform.OS === 'ios'
              ? 'Tap a photo and it grows into a full-screen page; drag it down, or tap the close, and it shrinks back into the card. Press and hold for the menu; a tap on the preview zooms it in as well.'
              : 'Tap a photo and it grows into its page; go back and it shrinks into the card again.'
        }
      >
        <Box gap="s16">
          {rows.map(row => (
            <Box flexDirection="row" gap="s12" key={row.map(entry => entry.id).join()}>
              {row.map(entry => (
                <PhotoCard key={entry.id} photo={entry} settings={settings} />
              ))}
            </Box>
          ))}
        </Box>
      </Section>

      {shot ? null : (
        <Section
          caption={
            Platform.OS === 'ios'
              ? 'UIKit times the zoom itself; what you set is the background and which gestures may close the page.'
              : 'Material’s container transform: the path it travels and how long it takes.'
          }
          title="Try it"
        >
          <Box bg="surface.primary" borderRadius="large" gap="s16" p="s16">
            <Setting
              choices={BACKGROUNDS}
              label="Background"
              onChange={set('background')}
              value={settings.background}
            />
            {Platform.OS === 'ios' ? (
              <Setting choices={DISMISSALS} label="Close with" onChange={set('dismiss')} value={settings.dismiss} />
            ) : (
              <>
                <Setting choices={PATHS} label="Path" onChange={set('path')} value={settings.path} />
                <Setting choices={SPEEDS} label="Speed" onChange={set('speed')} value={settings.speed} />
              </>
            )}
          </Box>
        </Section>
      )}
    </>
  )
}
