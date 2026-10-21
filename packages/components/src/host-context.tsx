import {createContext, type ReactNode, useContext} from 'react'

const HostContext = createContext(false)

export const HostBoundary = ({children}: {children: ReactNode}) => (
  <HostContext.Provider value>{children}</HostContext.Provider>
)

export const useHostGuard = (atom: string) => {
  const insideHost = useContext(HostContext)

  if (__DEV__ && !insideHost) {
    console.warn(
      `[kara-ui] <${atom}> renders a native view and must sit inside <Screen> or <Island>. Outside one it will not appear.`
    )
  }
}
