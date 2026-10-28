import {Text as ComposeText, Host, RNHostView, Row, TextButton} from '@expo/ui/jetpack-compose'

import {TooltipBox} from '@hzblj/kara-native/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'
import {Button} from '../../atoms/button'
import {HostBoundary} from '../../hooks/host-context'
import type {RnTooltipAction, RnTooltipComponent, RnTooltipProps} from './rn-tooltip.types'

/** Material's rich tooltip width, in dp. */
const MAX_WIDTH = 280

const ACTIONS_ARRANGEMENT = {spacedBy: 8}

const TooltipActionButton = ({action}: {action: RnTooltipAction}) => {
  const theme = useAppTheme()

  if (action.variant === 'primary' || action.variant === 'secondary') {
    return (
      <Button
        label={action.label}
        onPress={action.onPress}
        variant={action.variant === 'primary' ? 'accent' : 'secondary'}
        wide={false}
      />
    )
  }

  return (
    <TextButton onClick={action.onPress}>
      <ComposeText color={theme.colorString('content.accent')} style={theme.typography.footnoteMedium}>
        {action.label}
      </ComposeText>
    </TextButton>
  )
}

/**
 * Material 3's rich tooltip below the anchor, in its own host — so the anchor is a React Native view carried back in
 * through `RNHostView`. Any touch outside asks for dismissal, the start of a scroll included; that is Material's
 * behaviour, where iOS keeps the tooltip through a scroll.
 */
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

  return (
    <Host colorScheme={theme.dark ? 'dark' : 'light'} matchContents seedColor={theme.materialSeed}>
      <HostBoundary>
        <TooltipBox
          actionsAlignment={actionsAlignment}
          boundaryInsets={boundaryInsets}
          containerColor={theme.color('surface.primary')}
          isPresented={visible}
          maxWidth={MAX_WIDTH}
          onDismissRequest={onDismiss}
          onShown={onShown}
        >
          {title ? (
            <TooltipBox.Title>
              <ComposeText color={theme.colorString('content.primary')} style={theme.typography.subheadlineMedium}>
                {title}
              </ComposeText>
            </TooltipBox.Title>
          ) : null}
          {message ? (
            <TooltipBox.Text>
              <ComposeText color={theme.colorString('content.secondary')} style={theme.typography.footnote}>
                {message}
              </ComposeText>
            </TooltipBox.Text>
          ) : null}
          {actions?.length ? (
            <TooltipBox.Action>
              <Row horizontalArrangement={ACTIONS_ARRANGEMENT} verticalAlignment="center">
                {actions.map(action => (
                  <TooltipActionButton action={action} key={action.label} />
                ))}
              </Row>
            </TooltipBox.Action>
          ) : null}
          <RNHostView matchContents>{children}</RNHostView>
        </TooltipBox>
      </HostBoundary>
    </Host>
  )
}
