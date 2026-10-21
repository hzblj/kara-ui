import {createContext, type ReactNode, useContext} from 'react'
import {Dimensions, useWindowDimensions} from 'react-native'

import {type ActiveBreakpoint, breakpointFor} from '../primitives/breakpoints'

const BreakpointContext = createContext<ActiveBreakpoint>(breakpointFor(Dimensions.get('window').width))

export const BreakpointProvider = ({children}: {children: ReactNode}) => {
  const {width} = useWindowDimensions()

  return <BreakpointContext.Provider value={breakpointFor(width)}>{children}</BreakpointContext.Provider>
}

export const useBreakpoint = (): ActiveBreakpoint => useContext(BreakpointContext)
