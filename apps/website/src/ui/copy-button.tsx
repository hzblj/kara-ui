'use client'

import {useState} from 'react'

import {CheckIcon, CopyIcon} from './icons'

export const CopyButton = ({
  className,
  iconClassName,
  text,
}: {
  className?: string
  iconClassName?: string
  text: string
}) => {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <button aria-label={copied ? 'Copied' : 'Copy to clipboard'} className={className} onClick={copy} type="button">
      {copied ? <CheckIcon className={iconClassName} /> : <CopyIcon className={iconClassName} />}
    </button>
  )
}
