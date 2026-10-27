import {useAppTheme} from '@hzblj/kara-theme'
import {type DetentChangeEvent, TrueSheet} from '@lodev09/react-native-true-sheet'
import {useCallback, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef} from 'react'
import {Platform, StyleSheet, View} from 'react-native'
import type {SheetComponent, SheetDetent, SheetProps} from './sheet.types'
import {SheetHeader} from './sheet-header'
import {SheetScrollContext, SheetScrollView} from './sheet-scroll'
import {splitSheetChildren} from './split-sheet-children'
import {useSheetHeader} from './use-sheet-header'

const FIT_CONTENT: SheetDetent[] = ['auto']

/** Material's extra-large shape for a bottom sheet; iOS keeps the system's own, which follows the device's corners. */
const CORNER_RADIUS = Platform.OS === 'android' ? 28 : undefined

/** Keeps the sheet's own native view out of the layout it is declared in. */
const styles = StyleSheet.create({
  host: {position: 'absolute'},
})

const SheetRoot = ({
  bg = 'surface.primary',
  children,
  detents = FIT_CONTENT,
  dimmed = true,
  dismissible = true,
  draggable = true,
  footer,
  grabber = true,
  onDetentChange,
  onDismiss,
  onPresent,
  ref,
  scrollable = false,
  systemBackground = false,
  testID,
  visible,
}: SheetProps) => {
  const theme = useAppTheme()
  const {content, header: headerProps} = useMemo(() => splitSheetChildren(children), [children])
  const sheetHeader = useSheetHeader({header: headerProps, scrollable})
  const sheetRef = useRef<TrueSheet>(null)
  const presented = useRef(false)
  /** A dismissal we asked for: `onDismiss` reports the user's, never ours. */
  const programmaticDismiss = useRef(false)

  useImperativeHandle(
    ref,
    () => ({
      dismiss: () => {
        presented.current = false
        programmaticDismiss.current = true
        return sheetRef.current?.dismiss() ?? Promise.resolve()
      },
      present: detentIndex => {
        presented.current = true
        return sheetRef.current?.present(detentIndex) ?? Promise.resolve()
      },
      resize: detentIndex => sheetRef.current?.resize(detentIndex) ?? Promise.resolve(),
    }),
    []
  )

  useEffect(() => {
    if (visible && !presented.current) {
      presented.current = true
      void sheetRef.current?.present()
    } else if (!visible && presented.current) {
      presented.current = false
      programmaticDismiss.current = true
      void sheetRef.current?.dismiss()
    }
  }, [visible])

  // A sheet unmounted while presented would otherwise stay on screen, blocking everything under it.
  useLayoutEffect(() => {
    const sheet = sheetRef.current

    return () => {
      if (!presented.current) {
        return
      }

      presented.current = false
      programmaticDismiss.current = true
      void sheet?.dismiss()
    }
  }, [])

  const handleDidDismiss = useCallback(() => {
    presented.current = false

    if (programmaticDismiss.current) {
      programmaticDismiss.current = false
      return
    }

    onDismiss()
  }, [onDismiss])

  const handleDetentChange = useCallback(
    (event: DetentChangeEvent) => onDetentChange?.(event.nativeEvent.index),
    [onDetentChange]
  )

  return (
    <View collapsable={false} pointerEvents="box-none" style={styles.host}>
      <TrueSheet
        backgroundColor={systemBackground && Platform.OS === 'ios' ? undefined : theme.color(bg)}
        cornerRadius={CORNER_RADIUS}
        detents={detents}
        dimmed={dimmed}
        dismissible={dismissible}
        draggable={draggable}
        footer={footer}
        grabber={grabber}
        header={sheetHeader.header}
        headerStyle={sheetHeader.headerStyle}
        onDetentChange={handleDetentChange}
        onDidDismiss={handleDidDismiss}
        onDidPresent={onPresent}
        ref={sheetRef}
        scrollable={scrollable}
        scrollableOptions={sheetHeader.scrollableOptions}
        testID={testID}
      >
        <SheetScrollContext.Provider value={sheetHeader.scrollContext}>
          {sheetHeader.staticLargeTitle}
          {content}
        </SheetScrollContext.Provider>
      </TrueSheet>
    </View>
  )
}

/**
 * A native sheet with an optional native header. `visible` presents and dismisses it; a swipe or a tap outside calls
 * `onDismiss`, which should set `visible` back. `<Sheet.Header>` (a direct child) gives it a bar with a title and
 * items; `<Sheet.ScrollView>` is the body of a `scrollable` sheet.
 */
export const Sheet: SheetComponent = Object.assign(SheetRoot, {Header: SheetHeader, ScrollView: SheetScrollView})
