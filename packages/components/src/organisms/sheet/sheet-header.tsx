import type {SheetHeaderProps} from './sheet.types'

/** A slot, never rendered: `Sheet` reads its props and builds the header into the native sheet's own header area. */
export const SheetHeader = (_props: SheetHeaderProps): never => {
  throw new Error('[kara-ui] <Sheet.Header> must be a direct child of <Sheet>.')
}
