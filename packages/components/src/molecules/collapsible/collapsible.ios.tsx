import {DisclosureGroup} from '@expo/ui/swift-ui'

import {useHostGuard} from '../../host-context'
import type {CollapsibleComponent, CollapsibleProps} from './collapsible.types'

export const Collapsible: CollapsibleComponent = ({
  children,
  expanded,
  label,
  onExpandedChange,
  testID,
}: CollapsibleProps) => {
  useHostGuard('Collapsible')

  return (
    <DisclosureGroup isExpanded={expanded} label={label} onIsExpandedChange={onExpandedChange} testID={testID}>
      {children}
    </DisclosureGroup>
  )
}
