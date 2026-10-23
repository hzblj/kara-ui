import {createContext, type ReactNode, useContext} from 'react'
import {Dimensions, useWindowDimensions} from 'react-native'

import {type ActiveBreakpoint, breakpointFor} from '../primitives/breakpoints'
import {MAX_FONT_SCALE} from '../primitives/typography'

const initial = Dimensions.get('window')

const BreakpointContext = createContext<ActiveBreakpoint>(breakpointFor(initial.width))

const capped = (fontScale: number) => Math.min(fontScale, MAX_FONT_SCALE)

const FontScaleContext = createContext(capped(initial.fontScale))

/**
 * The window's breakpoint and the user's text size, from one subscription at the root: `useWindowDimensions` in every
 * text of a long list would be a listener per row, each woken by every rotation.
 */
export const BreakpointProvider = ({children}: {children: ReactNode}) => {
  const {fontScale, width} = useWindowDimensions()

  return (
    <BreakpointContext.Provider value={breakpointFor(width)}>
      <FontScaleContext.Provider value={capped(fontScale)}>{children}</FontScaleContext.Provider>
    </BreakpointContext.Provider>
  )
}

export const useBreakpoint = (): ActiveBreakpoint => useContext(BreakpointContext)

/** The user's text size as a factor of the default, capped at `MAX_FONT_SCALE`, which kara's text never grows past. */
export const useFontScale = (): number => useContext(FontScaleContext)
