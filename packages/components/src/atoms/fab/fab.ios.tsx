import {Button} from '@expo/ui/swift-ui'
import {buttonStyle} from '@expo/ui/swift-ui/modifiers'
import {useSxModifiers} from '@hzblj/kara-sx'
import {useMemo} from 'react'
import {useHostGuard} from '../../host-context'
import {Icon} from '../icon'
import type {FabComponent, FabProps} from './fab.types'

export const Fab: FabComponent = ({name, onPress, testID}: FabProps) => {
  useHostGuard('Fab')

  const sxModifiers = useSxModifiers({
    bg: 'fill.accent.primary',
    borderRadius: 'full',
    h: 56,
    p: 's16',
    shadow: 'btn.accent',
    w: 56,
  })
  const modifiers = useMemo(() => [buttonStyle('plain'), ...sxModifiers], [sxModifiers])

  return (
    <Button modifiers={modifiers} onPress={onPress} testID={testID}>
      <Icon color="content.on.bg" name={name} />
    </Button>
  )
}
