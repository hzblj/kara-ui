'use client'

import {track} from '../../analytics/track'
import {applyPlatform, type Platform} from '../../theme/theme'
import {usePlatform} from '../../theme/use-root'
import {cn} from '../../ui/utils'
import {docsStyles} from '../docs-styles'

const styles = docsStyles()

const PLATFORMS: {id: Platform; label: string}[] = [
  {id: 'ios', label: 'iOS'},
  {id: 'android', label: 'Android'},
]

/** Which platform's captures the gallery shows — remembered, and read back before the first paint. */
export const PlatformSwitch = () => {
  const active = usePlatform()

  return (
    <div
      aria-label="Platform"
      className={cn(styles.tabs(), 'rounded-[10px] border border-border-secondary bg-surface-secondary p-[3px]')}
      role="tablist"
    >
      {PLATFORMS.map(platform => (
        <button
          aria-selected={active === platform.id}
          className={cn(styles.tab(), active === platform.id ? styles.tabActive() : styles.tabInactive())}
          key={platform.id}
          onClick={() => {
            applyPlatform(platform.id)
            track('select_platform', {platform: platform.id})
          }}
          role="tab"
          type="button"
        >
          {platform.label}
        </button>
      ))}
    </div>
  )
}
