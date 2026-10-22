import Link from 'next/link'
import {tv} from 'tailwind-variants'

import {ArrowRightIcon, PlayIcon} from '../../ui/icons'
import {componentHref} from '../pages'
import {type ComponentMedia, mediaFor} from '../source/media'
import {DeviceMedia} from './device-media'
import {COMPONENT_GROUPS, type ComponentDoc, componentsIn} from './registry'

const styles = tv({
  slots: {
    card: 'group/card relative flex flex-col overflow-hidden rounded-[20px] border border-border-secondary bg-surface-primary shadow-card-default transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-card-elevated focus-visible:outline-2 focus-visible:outline-border-focus motion-reduce:transition-none motion-reduce:hover:translate-y-0',
    cardArrow:
      'size-4 shrink-0 text-content-tertiary transition-[transform,color] duration-200 group-hover/card:translate-x-0.5 group-hover/card:text-content-accent',
    cardBody: 'flex items-start justify-between gap-3 border-t border-border-secondary px-4 py-3.5',
    cardName: 'text-[15px] font-semibold tracking-[-0.01em] text-content-primary',
    cardSummary: 'mt-1 line-clamp-2 text-[13px] leading-5 text-content-tertiary',
    grid: 'grid grid-cols-3 gap-5 max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1 max-[560px]:gap-4',
    group:
      'scroll-mt-24 pt-14 first:pt-10 [&>h2]:mb-5 [&>h2]:text-[22px] [&>h2]:font-semibold [&>h2]:tracking-[-0.03em]',
    only: 'absolute top-3 left-3 z-10 rounded-full bg-surface-primary/85 px-2 py-0.5 text-[10px] font-semibold text-content-secondary shadow-btn-default backdrop-blur',
    placeholder:
      'flex aspect-[4/3] w-full items-center justify-center bg-surface-tertiary bg-[radial-gradient(var(--color-border-secondary)_1px,transparent_1px)] [background-size:16px_16px] font-mono text-[15px] text-content-secondary',
    play: 'absolute top-3 right-3 z-10 flex size-7 items-center justify-center rounded-full bg-surface-primary/85 text-content-secondary shadow-btn-default backdrop-blur transition-opacity group-hover/card:opacity-0',
    playIcon: 'size-3',
  },
})

const s = styles()

const hasVideo = (media: ComponentMedia | undefined) =>
  Object.values(media?.platforms ?? {}).some(platform => platform?.video.light || platform?.video.dark)

const Stage = ({component, media}: {component: ComponentDoc; media: ComponentMedia | undefined}) => {
  const ios = media?.platforms.ios
  const android = media?.platforms.android

  if (!ios && !android) {
    return <div className={s.placeholder()}>{`<${component.name} />`}</div>
  }

  return (
    <>
      {ios ? (
        <div className={android ? 'android:hidden' : undefined}>
          <DeviceMedia
            alt={`${component.name} on iOS`}
            autoplay="hover"
            followsPlatform={Boolean(android)}
            frame={ios.frame}
            hoverTarget="[data-card]"
            media={ios}
            platform="ios"
          />
        </div>
      ) : null}
      {android ? (
        <div className={ios ? 'hidden android:block' : undefined}>
          <DeviceMedia
            alt={`${component.name} on Android`}
            autoplay="hover"
            followsPlatform={Boolean(ios)}
            frame={android.frame}
            hoverTarget="[data-card]"
            media={android}
            platform="android"
          />
        </div>
      ) : null}
    </>
  )
}

const onlyOn = (media: ComponentMedia | undefined) => {
  const platforms = Object.keys(media?.platforms ?? {})
  return platforms.length === 1 ? (platforms[0] === 'ios' ? 'iOS only' : 'Android only') : undefined
}

export const ComponentCard = ({component}: {component: ComponentDoc}) => {
  const media = mediaFor(component.id)
  const only = onlyOn(media)

  return (
    <Link className={s.card()} data-card href={componentHref(component.id)}>
      <div className="relative">
        {only ? <span className={s.only()}>{only}</span> : null}
        {hasVideo(media) ? (
          <span aria-hidden="true" className={s.play()}>
            <PlayIcon className={s.playIcon()} />
          </span>
        ) : null}
        <Stage component={component} media={media} />
      </div>
      <div className={s.cardBody()}>
        <div className="min-w-0">
          <p className={s.cardName()}>{component.name}</p>
          <p className={s.cardSummary()}>{component.summary}</p>
        </div>
        <ArrowRightIcon className={s.cardArrow()} />
      </div>
    </Link>
  )
}

export const ComponentGallery = () => (
  <>
    {COMPONENT_GROUPS.map(group => (
      <section className={s.group()} id={group.id} key={group.id}>
        <h2>{group.title}</h2>
        <div className={s.grid()}>
          {componentsIn(group.id).map(component => (
            <ComponentCard component={component} key={component.id} />
          ))}
        </div>
      </section>
    ))}
  </>
)
