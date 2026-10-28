import {
  Text as ComposeText,
  DropdownMenuItem,
  ExposedDropdownMenu,
  ExposedDropdownMenuBox,
  Host,
  OutlinedTextField,
  useNativeState,
} from '@expo/ui/jetpack-compose'
import {fillMaxWidth, menuAnchor, testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {useAppTheme} from '@hzblj/kara-theme'
import {useEffect, useMemo, useState} from 'react'
import {HostBoundary, useInsideHost} from '../../hooks/host-context'
import {Glyph} from '../glyph'
import type {PickerComponent, PickerProps} from './picker.types'

const MATCH_HEIGHT_ONLY = {horizontal: false, vertical: true}

/**
 * Material's exposed dropdown: a read-only outlined field the width of its container, opening a menu of the options
 * under it. Its own host, themed like an `Island`, so it drops into React Native layout like the iOS picker does.
 * Inside a `Screen` or `Island` it renders into that host instead (see `useInsideHost`): a host of its own there
 * would leave the outer one no width, and the native views beside it would disappear.
 */
export const Picker: PickerComponent = ({disabled = false, onValueChange, options, testID, value}: PickerProps) => {
  const theme = useAppTheme()
  const insideHost = useInsideHost()
  const [expanded, setExpanded] = useState(false)
  const selectedLabel = options.find(option => option.value === value)?.label ?? ''
  const label = useNativeState(selectedLabel)
  const fieldModifiers = useMemo(() => {
    const list = [fillMaxWidth(), menuAnchor('primaryNotEditable', !disabled)]

    return testID ? [...list, testIdModifier(testID)] : list
  }, [disabled, testID])

  // `useNativeState` takes only its initial value; a new selection is pushed to the field.
  useEffect(() => {
    label.set(selectedLabel)
  }, [label, selectedLabel])

  const menu = (
    <ExposedDropdownMenuBox expanded={expanded} onExpandedChange={disabled ? undefined : setExpanded}>
      <OutlinedTextField
        enabled={!disabled}
        modifiers={fieldModifiers}
        readOnly
        singleLine
        textStyle={{
          color: theme.colorString('content.primary'),
          fontFamily: theme.typography.body.fontFamily,
          fontWeight: theme.typography.body.fontWeight,
        }}
        value={label}
      >
        <OutlinedTextField.TrailingIcon>
          <Glyph color="content.secondary" name="chevronDown" size="s20" />
        </OutlinedTextField.TrailingIcon>
      </OutlinedTextField>
      <ExposedDropdownMenu
        containerColor={theme.color('surface.primary')}
        expanded={expanded}
        onDismissRequest={() => setExpanded(false)}
      >
        {options.map(option => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => {
              setExpanded(false)
              onValueChange?.(option.value)
            }}
          >
            <DropdownMenuItem.Text>
              <ComposeText
                color={theme.colorString(option.value === value ? 'content.accent' : 'content.primary')}
                style={theme.typography.body}
              >
                {option.label}
              </ComposeText>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
        ))}
      </ExposedDropdownMenu>
    </ExposedDropdownMenuBox>
  )

  if (insideHost) {
    return menu
  }

  return (
    <Host colorScheme={theme.dark ? 'dark' : 'light'} matchContents={MATCH_HEIGHT_ONLY} seedColor={theme.materialSeed}>
      <HostBoundary>{menu}</HostBoundary>
    </Host>
  )
}
