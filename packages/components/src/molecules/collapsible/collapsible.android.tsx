import {AnimatedVisibility, Column, Text as ComposeText, Row} from '@expo/ui/jetpack-compose'
import {clickable} from '@expo/ui/jetpack-compose/modifiers'
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {Icon} from '../../atoms/icon'
import {useHostGuard} from '../../host-context'
import type {CollapsibleComponent, CollapsibleProps} from './collapsible.types'

export const Collapsible: CollapsibleComponent = ({children, expanded, label, onExpandedChange}: CollapsibleProps) => {
  useHostGuard('Collapsible')
  const theme = useAppTheme()
  const modifiers = useMemo(() => [clickable(() => onExpandedChange(!expanded))], [expanded, onExpandedChange])

  return (
    <Column>
      <Row horizontalArrangement="spaceBetween" modifiers={modifiers} verticalAlignment="center">
        <ComposeText color={theme.colorString('content.primary')} style={theme.typography.body}>
          {label}
        </ComposeText>
        <Icon name={expanded ? 'chevronDown' : 'chevronRight'} size="s20" />
      </Row>
      <AnimatedVisibility visible={expanded}>{children}</AnimatedVisibility>
    </Column>
  )
}
