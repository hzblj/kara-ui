import {Popover} from '@expo/ui/swift-ui'
import {Text} from '../../atoms/text'
import {VStack} from '../../atoms/v-stack'
import {useHostGuard} from '../../hooks/host-context'
import type {TooltipComponent, TooltipProps} from './tooltip.types'

export const Tooltip: TooltipComponent = ({children, onDismiss, text, visible}: TooltipProps) => {
  useHostGuard('Tooltip')

  return (
    <Popover
      isPresented={visible}
      onIsPresentedChange={next => {
        if (!next) {
          onDismiss()
        }
      }}
    >
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content>
        <VStack p="s12">
          <Text variant="footnote">{text}</Text>
        </VStack>
      </Popover.Content>
    </Popover>
  )
}
