import Link from 'next/link'
import {tv} from 'tailwind-variants'

import {DeviceMedia} from '../docs/components/device-media'
import {COMPONENTS} from '../docs/components/registry'
import {componentHref} from '../docs/pages'
import {type MediaPlatform, mediaFor, type PlatformMedia} from '../docs/source/media'
import {MarqueeTrack} from './marquee-track'

const styles = tv({
  slots: {
    caption: 'mt-2.5 flex min-w-0 items-baseline gap-1.5 px-1',
    // As the docs' gallery: the card stays put, its shadow (or in dark its surface) answers, and the capture inside moves.
    card: 'overflow-hidden rounded-2xl border border-border-secondary bg-surface-primary transition-[background-color,box-shadow] duration-250 ease-out group-hover:shadow-card-hover dark:group-hover:bg-surface-tertiary motion-reduce:transition-none',
    media:
      'transition-transform duration-350 ease-smooth-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100',
    name: 'truncate text-[13px] font-medium text-content-secondary transition-colors group-hover:text-content-primary',
    platform: 'shrink-0 text-[12px] text-content-quaternary',
    // A scroller the reader can move, with room above and below inside it so a hovered card's shadow is not cut off.
    row: '-my-6 select-none overflow-x-auto overscroll-x-contain py-6 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [scrollbar-width:none] data-[dragging]:cursor-grabbing max-[560px]:[mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] [&::-webkit-scrollbar]:hidden [&_*]:[-webkit-user-drag:none]',
    tile: 'group block w-[264px] shrink-0 pr-4 max-[560px]:w-[228px] max-[560px]:pr-3',
    track: 'flex w-max',
  },
})

type Tile = {id: string; media: PlatformMedia; name: string; platform: MediaPlatform}

const moves = (media: PlatformMedia | undefined) => Boolean(media?.video.light || media?.video.dark)

/** One item of each list in turn while both last, `[a1, b1, a2, b2, ...]`, then the rest of the longer one. */
const interleave = <T,>(first: T[], second: T[]): T[] =>
  Array.from({length: Math.max(first.length, second.length)}, (_, index) => [first[index], second[index]]).flatMap(
    pair => pair.filter((item): item is T => item !== undefined)
  )

/**
 * Every component that has a capture, in two rows: one leaning iOS and one Android, each component on the leaning
 * platform unless only the other one was recorded. The recorded ones are shared out between the rows and alternate
 * with the stills, so something moves wherever the reader looks.
 */
const tiles = (): Tile[][] => {
  const rows: {moving: Tile[]; still: Tile[]}[] = [
    {moving: [], still: []},
    {moving: [], still: []},
  ]
  const counts = {moving: 0, still: 0}

  for (const component of COMPONENTS) {
    const platforms = mediaFor(component.id)?.platforms ?? {}

    if (!platforms.ios && !platforms.android) {
      continue
    }

    const kind = moves(platforms.ios) || moves(platforms.android) ? 'moving' : 'still'
    const index = counts[kind]++ % 2
    const preferred: MediaPlatform = index === 0 ? 'ios' : 'android'
    const other: MediaPlatform = preferred === 'ios' ? 'android' : 'ios'
    const platform =
      kind === 'moving' ? (moves(platforms[preferred]) ? preferred : other) : platforms[preferred] ? preferred : other
    const media = platforms[platform]

    if (media) {
      rows[index]?.[kind].push({id: component.id, media, name: component.name, platform})
    }
  }

  return rows.map(row => interleave(row.moving, row.still))
}

const PLATFORM_LABEL = {android: 'Android', ios: 'iOS'} as const satisfies Record<MediaPlatform, string>

const styled = styles()

const Row = ({items, reverse = false}: {items: Tile[]; reverse?: boolean}) => (
  <MarqueeTrack className={styled.row()} reverse={reverse} trackClassName={styled.track()}>
    {/* Two copies, so the row can wrap by one copy's width without a seam. */}
    {[0, 1].flatMap(copy =>
      items.map(item => (
        <Link
          aria-hidden={copy === 1 ? true : undefined}
          className={styled.tile()}
          data-tile=""
          draggable={false}
          href={componentHref(item.id)}
          key={`${copy}:${item.id}`}
          tabIndex={copy === 1 ? -1 : undefined}
        >
          <div className={styled.card()}>
            <div className={styled.media()}>
              {/* Plays under the pointer on a desktop, and while it is in view on a touch screen. */}
              <DeviceMedia
                alt={`${item.name} on ${PLATFORM_LABEL[item.platform]}`}
                autoplay="hover"
                frame={item.media.frame}
                hoverTarget="[data-tile]"
                media={item.media}
                platform={item.platform}
              />
            </div>
          </div>
          <span className={styled.caption()}>
            <span className={styled.name()}>{item.name}</span>
            <span className={styled.platform()}>{PLATFORM_LABEL[item.platform]}</span>
          </span>
        </Link>
      ))
    )}
  </MarqueeTrack>
)

/**
 * Every component, drifting past in two rows (one leaning iOS, one Android) that the reader can drag, swipe or scroll
 * through. A row eases to a stop under the pointer, and a card plays its recording while it is hovered or, on a touch
 * screen, in view.
 */
export const ComponentStrip = () => {
  const [first = [], second = []] = tiles()

  return (
    <div className="grid gap-8 max-[560px]:gap-6">
      <Row items={first} />
      <Row items={second} reverse />
    </div>
  )
}
