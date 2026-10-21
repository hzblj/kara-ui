import {spacing} from '@hzblj/kara-theme'

import {Box} from '../box'
import {Image} from '../image'
import {RnText} from '../rn-text'
import type {AvatarComponent, AvatarProps, AvatarSize} from './avatar.types'

const DIAMETER = {
  lg: spacing.s64,
  md: spacing.s40,
  sm: spacing.s24,
} as const satisfies Record<AvatarSize, number>

const VARIANT = {
  lg: 'headingXs',
  md: 'labelMedium',
  sm: 'caption',
} as const

export const Avatar: AvatarComponent = ({initials, size = 'md', source, testID}: AvatarProps) => {
  const diameter = DIAMETER[size]

  return (
    <Box
      align="center"
      bg="fill.tertiary"
      borderRadius="full"
      h={diameter}
      justify="center"
      overflow="hidden"
      testID={testID}
      w={diameter}
    >
      {source ? (
        <Image source={source} style={{height: diameter, width: diameter}} />
      ) : (
        <RnText color="content.secondary" variant={VARIANT[size]}>
          {initials ?? ''}
        </RnText>
      )}
    </Box>
  )
}
