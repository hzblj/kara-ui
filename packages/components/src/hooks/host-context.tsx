import {createContext, type ReactNode, useContext} from 'react'

const HostContext = createContext(false)

export const HostBoundary = ({children}: {children: ReactNode}) => (
  <HostContext.Provider value>{children}</HostContext.Provider>
)

/**
 * Whether this renders inside a `Screen` or `Island` already. An atom that brings its own host renders straight into
 * that one instead: on Android a host nested in another is a real view beside the outer host's own `ComposeView`, and
 * the outer host (a horizontal `LinearLayout`) measures its `ComposeView` in the width the nested one leaves over,
 * which for a full-width nested host is none.
 */
export const useInsideHost = () => useContext(HostContext)

export const useHostGuard = (atom: string) => {
  const insideHost = useContext(HostContext)

  if (__DEV__ && !insideHost) {
    console.warn(
      `[kara-ui] <${atom}> renders a native view and must sit inside <Screen> or <Island>. Outside one it will not appear.`
    )
  }
}
