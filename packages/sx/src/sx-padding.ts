import {spacing} from '@hzblj/kara-theme'

import type {Sx, SxPadding} from './sx.types'

const size = (token: SpaceKey | undefined) => (token === undefined ? undefined : spacing[token])

type SpaceKey = NonNullable<Sx['p']>

/** Padding is all this reads, so both `Sx` and the widened `StyleSx` satisfy it. */
type SxPaddingInput = Pick<Sx, 'p' | 'pb' | 'pl' | 'pr' | 'pt' | 'px' | 'py'>

export const sxPadding = (sx: SxPaddingInput): SxPadding | undefined => {
  const all = size(sx.p)
  const horizontal = size(sx.px)
  const vertical = size(sx.py)

  const top = size(sx.pt) ?? vertical ?? all
  const bottom = size(sx.pb) ?? vertical ?? all
  const leading = size(sx.pl) ?? horizontal ?? all
  const trailing = size(sx.pr) ?? horizontal ?? all

  if (top === undefined && bottom === undefined && leading === undefined && trailing === undefined) {
    return undefined
  }

  return {bottom, leading, top, trailing}
}
