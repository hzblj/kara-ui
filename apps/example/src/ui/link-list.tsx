import {Box, Divider, type IconName, RnListItem, VStack} from '@hzblj/kara-ui'
import {Fragment} from 'react'

export type LinkListRow = {
  icon?: IconName
  id: string
  onPress: () => void
  subtitle?: string
  title: string
}

/** A divider inset from a native card's edges, the way a grouped list draws one. */
export const InsetDivider = () => (
  <VStack px="s16" wide>
    <Divider />
  </VStack>
)

/**
 * A grouped card of tappable rows, like a settings screen. Plain React Native rows rather than native ones: a list of
 * dozens would otherwise mount a native view per label and chevron, which is enough to stall Android's main thread on
 * a tab switch. Each row carries the card's padding inside its press area, so the ripple spans the whole row.
 */
export const LinkList = ({rows}: {rows: readonly LinkListRow[]}) => (
  <Box bg="surface.primary" borderRadius="large" overflow="hidden">
    {rows.map((row, index) => (
      <Fragment key={row.id}>
        {index > 0 ? <Box bg="border.tertiary" h={1} mx="s16" /> : null}
        <RnListItem
          icon={row.icon}
          onPress={row.onPress}
          px="s16"
          subtitle={row.subtitle}
          testID={row.id}
          title={row.title}
        />
      </Fragment>
    ))}
  </Box>
)
