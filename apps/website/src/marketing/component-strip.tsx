import Link from 'next/link'
import {tv} from 'tailwind-variants'

import {DeviceMedia} from '../docs/components/device-media'
import {COMPONENTS} from '../docs/components/registry'
import {componentHref} from '../docs/pages'
import {type MediaPlatform, mediaFor, type PlatformMedia} from '../docs/source/media'
import {MarqueeTrack} from './marquee-track'

const styles = tv({
  slots: {
    card: 'overflow-hidden rounded-2xl border border-border-secondary bg-surface-primary transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-y-1.5 group-hover:shadow-card-default',
    name: 'mt-2.5 block truncate px-1 text-[13px] font-medium text-content-secondary transition-colors group-hover:text-content-primary',
    // Room above and below inside the clip, so a card lifting on hover (and its shadow) is not cut off.
    row: '-my-6 overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]',
    tile: 'group block w-[256px] shrink-0 pr-4',
    track:
      'flex w-max motion-safe:animate-[marquee_140s_linear_infinite] max-[560px]:motion-safe:[animation-duration:90s]',
  },
  variants: {
    reverse: {true: {track: '[animation-direction:reverse]'}},
  },
})

type Tile = {id: string; media: PlatformMedia; name: string; platform: MediaPlatform}

/** Every component that has a capture, the first half on iOS and the rest on Android where each was shot. */
const tiles = (): Tile[][] => {
  const all = COMPONENTS.flatMap(component => {
    const platforms = mediaFor(component.id)?.platforms ?? {}
    return platforms.ios || platforms.android ? [{component, platforms}] : []
  })
  const half = Math.ceil(all.length / 2)

  return [all.slice(0, half), all.slice(half)].map((row, index) =>
    row.flatMap(({component, platforms}) => {
      const preferred: MediaPlatform = index === 0 ? 'ios' : 'android'
      const platform = platforms[preferred] ? preferred : preferred === 'ios' ? 'android' : 'ios'
      const media = platforms[platform]
      return media ? [{id: component.id, media, name: component.name, platform}] : []
    })
  )
}

const Row = ({items, reverse = false}: {items: Tile[]; reverse?: boolean}) => {
  const s = styles({reverse})

  return (
    <div className={s.row()}>
      {/* Two copies, so sliding the track by half its width brings it back to where it started. */}
      <MarqueeTrack className={s.track()}>
        {[0, 1].flatMap(copy =>
          items.map(item => (
            <Link
              aria-hidden={copy === 1 ? true : undefined}
              className={s.tile()}
              href={componentHref(item.id)}
              key={`${copy}:${item.id}`}
              tabIndex={copy === 1 ? -1 : undefined}
            >
              <div className={s.card()}>
                <DeviceMedia
                  alt={`${item.name} on ${item.platform === 'ios' ? 'iOS' : 'Android'}`}
                  autoplay="never"
                  frame={item.media.frame}
                  media={item.media}
                  platform={item.platform}
                />
              </div>
              <span className={s.name()}>{item.name}</span>
            </Link>
          ))
        )}
      </MarqueeTrack>
    </div>
  )
}

/** Every component, running past in two rows — one leaning iOS, one Android. A row eases to a stop under the pointer. */
export const ComponentStrip = () => {
  const [first = [], second = []] = tiles()

  return (
    <div className="grid gap-6">
      <Row items={first} />
      <Row items={second} reverse />
    </div>
  )
}
