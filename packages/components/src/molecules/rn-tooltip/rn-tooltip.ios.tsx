import {
  Tooltip as NativeTooltip,
  type TooltipAction as NativeTooltipAction,
  type TooltipTextStyle,
} from '@hzblj/kara-native/swift-ui'
import {type ResolvedTextStyle, resolvePaletteColor, useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useMemo} from 'react'
import type {RnTooltipComponent, RnTooltipProps} from './rn-tooltip.types'

/** The bubble's width before it is narrowed to fit the window. */
const BUBBLE_WIDTH = 250

const textStyle = ({fontFamily, fontSize, lineHeight, weight}: ResolvedTextStyle): TooltipTextStyle => ({
  fontFamily,
  fontSize,
  fontWeight: weight,
  letterSpacing: 0,
  lineHeight,
})

export const RnTooltip: RnTooltipComponent = ({
  actions,
  actionsAlignment = 'end',
  boundaryInsets,
  children,
  message,
  onDismiss,
  onShown,
  title,
  visible,
}: RnTooltipProps) => {
  const theme = useAppTheme()

  const nativeActions = useMemo<NativeTooltipAction[]>(
    () => (actions ?? []).map(({label, variant = 'link'}) => ({label, variant})),
    [actions]
  )

  const onAction = useCallback((index: number) => actions?.[index]?.onPress(), [actions])

  return (
    <NativeTooltip
      actions={nativeActions}
      actionStyle={textStyle(theme.typography.footnoteMedium)}
      actionsAlignment={actionsAlignment}
      boundaryInsets={boundaryInsets}
      bubbleColor={theme.color('surface.primary')}
      isPresented={visible}
      linkColor={theme.color('content.accent')}
      message={message || undefined}
      messageColor={theme.color('content.secondary')}
      messageStyle={textStyle(theme.typography.footnote)}
      onAction={onAction}
      onDismissRequest={onDismiss}
      onShown={onShown}
      primaryTint={theme.color('fill.accent.primary')}
      secondaryTint={theme.color('content.primary')}
      shadowColor={resolvePaletteColor(theme, theme.shadow.snackbar.drop)}
      title={title || undefined}
      titleColor={theme.color('content.primary')}
      titleStyle={textStyle(theme.typography.subheadlineMedium)}
      width={BUBBLE_WIDTH}
    >
      {children}
    </NativeTooltip>
  )
}
