import {Box, RnText} from '@hzblj/kara-ui'
import {useLocalSearchParams} from 'expo-router'
import {useEffect} from 'react'
import {LogBox, Platform, useWindowDimensions} from 'react-native'

import {ACTION_SCENES} from './scenes/actions'
import {CONTENT_SCENES} from './scenes/content'
import {FEEDBACK_SCENES} from './scenes/feedback'
import {LAYOUT_SCENES} from './scenes/layout'
import {NAVIGATION_SCENES} from './scenes/navigation'
import {PRIMITIVE_SCENES} from './scenes/primitives'
import {SELECTION_SCENES} from './scenes/selection'
import type {Scene, SceneId, ShotConfig} from './shot.types'
import shots from './shots.json'
import {Ticker} from './ticker'
import {usePhase, useStep} from './use-timeline'

/** Every shot without a route of its own has a scene — the compiler holds the two lists together. */
const SCENES = {
  ...ACTION_SCENES,
  ...CONTENT_SCENES,
  ...FEEDBACK_SCENES,
  ...LAYOUT_SCENES,
  ...NAVIGATION_SCENES,
  ...PRIMITIVE_SCENES,
  ...SELECTION_SCENES,
} satisfies Record<SceneId, Scene>

/** JSON widens the literal unions to `string`; the harness only reads the timeline out of each entry anyway. */
const CONFIGS: Record<
  string,
  Omit<ShotConfig, 'flowPlatforms' | 'frame' | 'platforms'> & {
    flowPlatforms?: string[]
    frame?: unknown
    platforms?: string[]
  }
> = shots

/** The share of the screen's width the stage is tall: the 4:3 band `scripts/capture-shots.sh` crops to. */
const STAGE_RATIO = 0.75

/**
 * Where the band is kept on this platform. A `bottom` shot — a sheet rising — is cropped along the screen's bottom
 * edge, so its stage sits there too: what the sheet rises over is then in the picture, not off the top of the crop.
 */
const isBottomFrame = (frame: unknown) =>
  (typeof frame === 'object' && frame !== null ? (frame as Record<string, unknown>)[Platform.OS] : frame) === 'bottom'

type ShotParams = {id: string; play?: string}

/** A shot is a picture of the component, not of the warnings the dev build collects behind it. */
const useQuietLogBox = () => {
  useEffect(() => {
    LogBox.ignoreAllLogs(true)
  }, [])
}

type TimelineProps = {config: Pick<ShotConfig, 'period' | 'steps'>; playing: boolean; Scene: Scene}

const Timeline = ({config, playing, Scene}: TimelineProps) => {
  const step = useStep(playing, config.steps)
  const phase = usePhase(playing, config.period)

  return <Scene phase={phase} step={step} />
}

/**
 * One component on its own, for the website's screenshots and recordings: a stage of the screen's background colour,
 * as tall as the band the capture script keeps, with the component centred in it. `?play=1` runs the shot's timeline
 * in a loop; without it the scene holds the state a still is taken in.
 */
export const ShotScreen = () => {
  const {id, play} = useLocalSearchParams<ShotParams>()
  const {width} = useWindowDimensions()
  const Scene = (SCENES as Record<string, Scene | undefined>)[id]
  const config = CONFIGS[id]
  useQuietLogBox()

  // A whole-screen shot is the scene itself, edge to edge — a `Screen` would have nothing to fill on a stage.
  if (Scene && config?.frame === 'screen') {
    return <Scene phase={0} step={0} />
  }

  return (
    <Box bg="surface.base" flex={1} justify={isBottomFrame(config?.frame) ? 'flex-end' : 'center'}>
      <Box h={Math.round(width * STAGE_RATIO)} justify="center" px="s24" testID="shot-stage">
        {Scene && config ? (
          <Timeline Scene={Scene} config={config} key={`${id}:${play ?? ''}`} playing={play === '1'} />
        ) : (
          <RnText color="content.secondary">{`No scene for “${id}”.`}</RnText>
        )}
      </Box>
      {play === '1' ? <Ticker /> : null}
    </Box>
  )
}
