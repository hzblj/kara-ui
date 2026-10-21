import {BottomSheet} from '@expo/ui/swift-ui'

import {useHostGuard} from '../../host-context'
import type {SheetComponent, SheetProps} from './sheet.types'

export const Sheet: SheetComponent = ({children, fitToContents = true, onDismiss, visible}: SheetProps) => {
  useHostGuard('Sheet')

  return (
    <BottomSheet
      fitToContents={fitToContents}
      isPresented={visible}
      onDismiss={onDismiss}
      onIsPresentedChange={next => {
        if (!next) {
          onDismiss()
        }
      }}
    >
      {children}
    </BottomSheet>
  )
}
