'use client'

import {useState} from 'react'

import {type AnalyticsEvents, track} from '../analytics/track'
import {CheckIcon, CopyIcon} from './icons'

export const CopyButton = ({
  className,
  iconClassName,
  source,
  text,
}: {
  className?: string
  iconClassName?: string
  /** What is being copied, as the `copy_code` event reports it. */
  source: AnalyticsEvents['copy_code']['source']
  text: string
}) => {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    track('copy_code', {source})
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <button aria-label={copied ? 'Copied' : 'Copy to clipboard'} className={className} onClick={copy} type="button">
      {copied ? <CheckIcon className={iconClassName} /> : <CopyIcon className={iconClassName} />}
    </button>
  )
}
