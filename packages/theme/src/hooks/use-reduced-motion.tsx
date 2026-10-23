import {createContext, type ReactNode, useContext, useEffect, useState} from 'react'
import {AccessibilityInfo} from 'react-native'

/**
 * Whether kara's motion follows the device's Reduce Motion (iOS) or Remove animations (Android) setting: `'system'`
 * follows it, `'always'` reduces regardless (an app's own setting, a screenshot run) and `'never'` ignores it.
 */
export type ReduceMotionPreference = 'always' | 'never' | 'system'

const ReducedMotionContext = createContext(false)

/** The device's setting, read once and then kept current: a user can flip it while the app is open. */
const useSystemReducedMotion = (enabled: boolean): boolean => {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (!enabled) {
      return
    }

    let mounted = true

    AccessibilityInfo.isReduceMotionEnabled().then(value => {
      if (mounted) {
        setReduced(value)
      }
    })

    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced)

    return () => {
      mounted = false
      subscription.remove()
    }
  }, [enabled])

  return reduced
}

export const ReducedMotionProvider = ({
  children,
  preference,
}: {
  children: ReactNode
  preference: ReduceMotionPreference
}) => {
  const system = useSystemReducedMotion(preference === 'system')
  const reduced = preference === 'system' ? system : preference === 'always'

  return <ReducedMotionContext.Provider value={reduced}>{children}</ReducedMotionContext.Provider>
}

/**
 * `true` while motion should be reduced: by the device's setting, or by `KaraProvider reduceMotion`. What that means
 * is the caller's to honour: nothing slides, scales, turns or loops, and a change that needs a transition to read
 * (something appearing, a state flipping) fades instead, as Apple and Material both advise. Kara's own components
 * already do; this is for an app's own animations.
 */
export const useReducedMotion = (): boolean => useContext(ReducedMotionContext)
