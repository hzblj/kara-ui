import {readFileSync, statSync} from 'node:fs'
import path from 'node:path'

import {fromCheckout, REPO_ROOT, WEBSITE_ROOT} from './repo'

/**
 * What `apps/example/scripts/capture-shots.sh` has photographed and recorded so far, per platform: read off the disk,
 * so a component nobody has shot yet simply has no preview, and one shot on a single platform shows that one.
 */

export type MediaPlatform = 'android' | 'ios'
export type MediaFrame = 'bottom' | 'center' | 'screen'

export type PlatformMedia = {
  /** Which part of the screen the capture kept — see `apps/example/src/shots/shot.types.ts`. */
  frame: MediaFrame
  /** `/media/<platform>/<appearance>/<id>.webp` for each appearance there is a still of. */
  still: {dark?: string; light?: string}
  video: {dark?: string; light?: string}
}

export type ComponentMedia = {
  platforms: Partial<Record<MediaPlatform, PlatformMedia>>
}

type ShotConfig = {frame?: MediaFrame | Partial<Record<MediaPlatform, MediaFrame>>}

const frameFor = (config: ShotConfig, platform: MediaPlatform): MediaFrame =>
  typeof config.frame === 'object' ? (config.frame[platform] ?? 'center') : (config.frame ?? 'center')

const SHOTS = path.join(REPO_ROOT, 'apps/example/src/shots/shots.json')
const PUBLIC = path.join(WEBSITE_ROOT, 'public')
/**
 * A capture's URL, versioned by the file itself — its size and modification time — so a reshot one gets a new URL and
 * a browser never shows the copy it cached before, while the ones left alone keep theirs.
 */
const file = (platform: MediaPlatform, appearance: 'dark' | 'light', id: string, extension: 'mp4' | 'webp') => {
  const href = `/media/${platform}/${appearance}/${id}.${extension}`
  const stats = statSync(path.join(PUBLIC, href), {throwIfNoEntry: false})
  return stats ? `${href}?v=${Math.round(stats.mtimeMs).toString(36)}${stats.size.toString(36)}` : undefined
}

const build = () => {
  const shots = JSON.parse(readFileSync(SHOTS, 'utf8')) as Record<string, ShotConfig>
  const media: Record<string, ComponentMedia> = {}

  for (const [id, config] of Object.entries(shots)) {
    const platforms: ComponentMedia['platforms'] = {}

    for (const platform of ['ios', 'android'] as const) {
      const entry: PlatformMedia = {
        frame: frameFor(config, platform),
        still: {dark: file(platform, 'dark', id, 'webp'), light: file(platform, 'light', id, 'webp')},
        video: {dark: file(platform, 'dark', id, 'mp4'), light: file(platform, 'light', id, 'mp4')},
      }

      if (entry.still.light || entry.still.dark) {
        platforms[platform] = entry
      }
    }

    media[id] = {platforms}
  }

  return media
}

export const readMedia = fromCheckout(build)

export const mediaFor = (id: string): ComponentMedia | undefined => readMedia()[id]
