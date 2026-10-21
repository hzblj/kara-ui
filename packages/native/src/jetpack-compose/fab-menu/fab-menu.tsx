import type {ReactNode} from 'react'
import type {ColorValue} from 'react-native'

import {requireKaraView} from '../../require-view'
import {slot} from '../slot-view'
import type {
  FloatingActionButtonMenuHorizontalAlignment,
  FloatingActionButtonMenuItemProps,
  FloatingActionButtonMenuProps,
  ToggleFloatingActionButtonProps,
} from './fab-menu.types'

type NativeMenuProps = {
  children: ReactNode
  expanded: boolean
  horizontalAlignment?: FloatingActionButtonMenuHorizontalAlignment
}

type NativeItemProps = {
  children?: ReactNode
  containerColor?: ColorValue
  contentColor?: ColorValue
  onItemPressed?: () => void
}

type NativeToggleProps = {
  checked: boolean
  children?: ReactNode
  containerColor?: ColorValue
  onCheckedChange?: (event: {nativeEvent: {value: boolean}}) => void
}

const NativeMenu = requireKaraView<NativeMenuProps>('FloatingActionButtonMenuView')

const NativeItem = requireKaraView<NativeItemProps>('FloatingActionButtonMenuItemView')

const NativeToggle = requireKaraView<NativeToggleProps>('ToggleFloatingActionButtonView')

const FloatingActionButtonMenuRoot = (props: FloatingActionButtonMenuProps) => <NativeMenu {...props} />

/** Material 3 Expressive `FloatingActionButtonMenu`: a trigger that unfolds into a column of labelled pills. */
export const FloatingActionButtonMenu = Object.assign(FloatingActionButtonMenuRoot, {Button: slot('button')})

const FloatingActionButtonMenuItemRoot = ({onClick, ...props}: FloatingActionButtonMenuItemProps) => (
  <NativeItem {...props} onItemPressed={onClick} />
)

/** One pill of a `FloatingActionButtonMenu`. Only renders inside one. */
export const FloatingActionButtonMenuItem = Object.assign(FloatingActionButtonMenuItemRoot, {
  Icon: slot('icon'),
  Text: slot('text'),
})

const ToggleFloatingActionButtonRoot = ({onCheckedChange, ...props}: ToggleFloatingActionButtonProps) => (
  <NativeToggle {...props} onCheckedChange={event => onCheckedChange(event.nativeEvent.value)} />
)

/** Material 3 Expressive `ToggleFloatingActionButton`, the usual trigger of a `FloatingActionButtonMenu`. */
export const ToggleFloatingActionButton = Object.assign(ToggleFloatingActionButtonRoot, {Icon: slot('icon')})
