import {Host, SegmentedButton, SingleChoiceSegmentedButtonRow, Text} from '@expo/ui/jetpack-compose'
import {fillMaxWidth, height, testID as testIdModifier, weight} from '@expo/ui/jetpack-compose/modifiers'
import {iconResourceName} from '@hzblj/expo-native-icons'
import {haptics} from '@hzblj/expo-rich-haptics'
import {DrawableIcon, NativeImage} from '@hzblj/kara-native/jetpack-compose'
import {spacing as spacingTokens, type TextVariant, useAppTheme} from '@hzblj/kara-theme'
import {useCallback, useMemo} from 'react'

import {useInsideHost} from '../../host-context'
import {HStack} from '../h-stack'
import type {SegmentedControlComponent, SegmentedControlProps, SegmentedControlSegment} from './segmented-control.types'
import {imageUri, segmentOf} from './segments'

const MATCH_HEIGHT_ONLY = {horizontal: false, vertical: true}

/** Material's own segment height, which `spacing` only ever adds to. */
const MATERIAL_HEIGHT = 40

type SegmentLabelProps = {
  iconSize: number
  segment: SegmentedControlSegment
  variant: TextVariant
}

/**
 * What a segment shows: its label, one of the app's icons before it, or an image loaded by kara-native. The icon and a
 * label the image falls back to take the segment's content colour, so they follow the selection and `disabled`.
 */
const SegmentLabel = ({iconSize, segment, variant}: SegmentLabelProps) => {
  const theme = useAppTheme()
  const face = theme.typography[variant]

  if (segment.image !== undefined) {
    return (
      <NativeImage
        fontFamily={face.fontFamily}
        fontSize={face.fontSize}
        fontWeight={String(face.fontWeight)}
        imageHeight={iconSize}
        label={segment.label}
        source={imageUri(segment.image)}
      />
    )
  }

  const label = <Text style={face}>{segment.label}</Text>

  if (segment.icon === undefined) {
    return label
  }

  return (
    <HStack align="center" spacing="s6">
      <DrawableIcon iconSize={iconSize} resourceName={iconResourceName(segment.icon)} />
      {label}
    </HStack>
  )
}

/**
 * Material's single-choice segmented buttons, the selected one filled with the accent like a checked `Switch`. Its own
 * host, themed like an `Island`, so it drops into React Native layout the way the iOS control does. Inside a `Screen`
 * or `Island` it renders into that host instead (see `useInsideHost`). Material plays nothing on a new segment, so this
 * plays `selection`. `bg` fills the unselected segments; `p` has nothing to inset, as Material draws no pill.
 */
export const SegmentedControl: SegmentedControlComponent = ({
  bg,
  disabled = false,
  iconSize = 's20',
  onChange,
  selectedIndex,
  spacing,
  testID,
  values,
  variant = 'subheadlineMedium',
}: SegmentedControlProps) => {
  const theme = useAppTheme()
  const insideHost = useInsideHost()
  const segments = useMemo(() => values.map(segmentOf), [values])
  const iconPoints = spacingTokens[iconSize]

  // Every segment the same width, like UIKit's: Material's would size each to its label. With `spacing`, as tall as
  // the content and that space, and never shorter than Material's own segment.
  const segmentModifiers = useMemo(() => {
    if (spacing === undefined) {
      return [weight(1)]
    }

    const content = Math.max(theme.typography[variant].lineHeight, iconPoints)
    return [weight(1), height(Math.max(MATERIAL_HEIGHT, content + 2 * spacingTokens[spacing]))]
  }, [iconPoints, spacing, theme, variant])

  // Every segment keeps the same outline, the selected one too: an accent border would run its fill out over the line
  // the others draw inside, and make it look taller than its neighbours.
  const colors = useMemo(
    () => ({
      activeBorderColor: theme.color('border.secondary.base'),
      activeContainerColor: theme.color('fill.accent.primary'),
      activeContentColor: theme.color('content.on.accent'),
      disabledActiveBorderColor: theme.color('border.tertiary'),
      disabledActiveContainerColor: theme.color('fill.accent.disabled'),
      disabledActiveContentColor: theme.color('btn.content.disabled'),
      disabledInactiveBorderColor: theme.color('border.tertiary'),
      disabledInactiveContentColor: theme.color('btn.content.disabled'),
      inactiveBorderColor: theme.color('border.secondary.base'),
      inactiveContainerColor: bg === undefined ? undefined : theme.color(bg),
      inactiveContentColor: theme.color('content.primary'),
    }),
    [bg, theme]
  )

  const rowModifiers = useMemo(() => (testID ? [fillMaxWidth(), testIdModifier(testID)] : [fillMaxWidth()]), [testID])

  // Material reports a tap on the segment that is already selected too; iOS does not, and neither does this.
  const select = useCallback(
    (index: number) => {
      if (index === selectedIndex) {
        return
      }

      haptics.selection()
      onChange?.(index, segments[index]?.label ?? '')
    },
    [onChange, segments, selectedIndex]
  )

  const row = (
    <SingleChoiceSegmentedButtonRow modifiers={rowModifiers}>
      {segments.map((segment, index) => (
        <SegmentedButton
          colors={colors}
          enabled={!disabled}
          key={index}
          modifiers={segmentModifiers}
          onClick={() => select(index)}
          selected={index === selectedIndex}
        >
          <SegmentedButton.Label>
            <SegmentLabel iconSize={iconPoints} segment={segment} variant={variant} />
          </SegmentedButton.Label>
        </SegmentedButton>
      ))}
    </SingleChoiceSegmentedButtonRow>
  )

  if (insideHost) {
    return row
  }

  return (
    <Host colorScheme={theme.dark ? 'dark' : 'light'} matchContents={MATCH_HEIGHT_ONLY} seedColor={theme.materialSeed}>
      {row}
    </Host>
  )
}
