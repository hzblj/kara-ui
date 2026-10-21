import {requireNativeView} from 'expo'
import type {ReactNode} from 'react'

type SlotViewProps = {
  children: ReactNode
  slotName: string
}

/** `@expo/ui`'s slot marker: a native view that renders `children` into the named slot of its parent composable. */
export const SlotView = requireNativeView<SlotViewProps>('ExpoUI', 'SlotView')

/** A slot component for one name — what every `Parent.Slot` static below is. */
export const slot = (slotName: string) => {
  const Slot = ({children}: {children: ReactNode}) => <SlotView slotName={slotName}>{children}</SlotView>

  return Slot
}
