import {ModalBottomSheet} from '@expo/ui/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'

import {useHostGuard} from '../../host-context'
import type {SheetComponent, SheetProps} from './sheet.types'

export const Sheet: SheetComponent = ({children, fitToContents = true, onDismiss, visible}: SheetProps) => {
  useHostGuard('Sheet')
  const theme = useAppTheme()

  if (!visible) {
    return null
  }

  return (
    <ModalBottomSheet
      containerColor={theme.color('surface.primary')}
      contentColor={theme.color('content.primary')}
      onDismissRequest={onDismiss}
      skipPartiallyExpanded={fitToContents}
    >
      {children}
    </ModalBottomSheet>
  )
}
