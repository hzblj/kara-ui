import {Children, isValidElement, type ReactElement, type ReactNode} from 'react'
import type {SheetHeaderProps} from './sheet.types'
import {SheetHeader} from './sheet-header'

type SheetChildren = {
  content: ReactNode
  header?: SheetHeaderProps
}

const isSheetHeader = (child: ReactNode): child is ReactElement<SheetHeaderProps> =>
  isValidElement(child) && child.type === SheetHeader

/** Takes `<Sheet.Header>` out of the children: its props become the native header, the rest is the content. */
export const splitSheetChildren = (children: ReactNode): SheetChildren => {
  const nodes = Children.toArray(children)
  const header = nodes.find(isSheetHeader)

  if (!header) {
    return {content: children}
  }

  return {content: nodes.filter(node => node !== header), header: header.props}
}
