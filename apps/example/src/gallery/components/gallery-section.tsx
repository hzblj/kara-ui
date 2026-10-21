import {Box, RnText} from '@hzblj/kara-ui'

export const GallerySectionHeader = ({title}: {title: string}) => (
  <Box pb="s8" pt="s24">
    <RnText color="content.tertiary" variant="captionMedium">
      {title.toUpperCase()}
    </RnText>
  </Box>
)
