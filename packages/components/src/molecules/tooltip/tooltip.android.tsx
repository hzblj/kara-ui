import {Text as ComposeText, TooltipBox} from '@expo/ui/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'

import {useHostGuard} from '../../host-context'
import type {TooltipComponent, TooltipProps} from './tooltip.types'

export const Tooltip: TooltipComponent = ({children, text}: TooltipProps) => {
  useHostGuard('Tooltip')

  const theme = useAppTheme()

  return (
    <TooltipBox>
      <TooltipBox.PlainTooltip
        containerColor={theme.colorString('surface.high.contrast')}
        contentColor={theme.colorString('content.on.high.contrast')}
      >
        <ComposeText color={theme.colorString('content.on.high.contrast')} style={theme.typography.footnote}>
          {text}
        </ComposeText>
      </TooltipBox.PlainTooltip>
      {children}
    </TooltipBox>
  )
}
