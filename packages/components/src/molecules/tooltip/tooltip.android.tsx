import {Text as ComposeText} from '@expo/ui/jetpack-compose'
import {TooltipBox} from '@hzblj/kara-native/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'
import {useCallback} from 'react'

import {useHostGuard} from '../../host-context'
import type {TooltipComponent, TooltipProps} from './tooltip.types'

/**
 * Material's plain tooltip in kara's controlled `TooltipBox`: shown while `visible`, centred above the anchor and kept
 * inside the window. Material's own would open on a long press and hide itself without a word to JS.
 */
export const Tooltip: TooltipComponent = ({children, onDismiss, text, visible}: TooltipProps) => {
  useHostGuard('Tooltip')
  const theme = useAppTheme()
  const onDismissRequest = useCallback(() => onDismiss(), [onDismiss])

  return (
    <TooltipBox
      containerColor={theme.color('surface.high.contrast')}
      isPresented={visible}
      onDismissRequest={onDismissRequest}
      plain
    >
      <TooltipBox.Text>
        <ComposeText color={theme.colorString('content.on.high.contrast')} style={theme.typography.footnote}>
          {text}
        </ComposeText>
      </TooltipBox.Text>
      {children}
    </TooltipBox>
  )
}
