import {Icon} from '../../atoms/icon'
import {Text} from '../../atoms/text'
import {VStack} from '../../atoms/v-stack'
import type {EmptyStateComponent, EmptyStateProps} from './empty-state.types'

export const EmptyState: EmptyStateComponent = ({action, description, icon, testID, title}: EmptyStateProps) => (
  <VStack align="center" p="s24" spacing="s8" testID={testID} wide>
    {icon ? <Icon color="content.quaternary" name={icon} size="s48" /> : null}
    <Text align="center" variant="headingXs">
      {title}
    </Text>
    {description ? (
      <Text align="center" color="content.secondary" variant="subheadline">
        {description}
      </Text>
    ) : null}
    {action}
  </VStack>
)
