import {HStack} from '../../atoms/h-stack'
import {Icon} from '../../atoms/icon'
import {Spacer} from '../../atoms/spacer'
import {Text} from '../../atoms/text'
import {Glyph} from '../../glyph'
import type {LabeledContentComponent, LabeledContentProps} from './labeled-content.types'

const TrailingValue = ({value}: {value: string}) => (
  <Text color="content.secondary" variant="body">
    {value}
  </Text>
)

export const LabeledContent: LabeledContentComponent = ({
  children,
  icon,
  label,
  onPress,
  px,
  testID,
  value,
}: LabeledContentProps) => (
  <HStack align="center" onPress={onPress} px={px} py="s8" spacing="s12" testID={testID} wide>
    {icon ? <Icon color="content.secondary" name={icon} size="s20" /> : null}
    <Text variant="body">{label}</Text>
    <Spacer />
    {children ?? (value === undefined ? null : <TrailingValue value={value} />)}
    {onPress ? <Glyph color="content.quaternary" name="chevronRight" size="s16" /> : null}
  </HStack>
)
