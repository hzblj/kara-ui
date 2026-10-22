import {Box, RnText} from '@hzblj/kara-ui'

/** Small pills under a page's lead — what renders the component on each platform. */
export const Tags = ({tags}: {tags: readonly string[]}) => (
  <Box flexDirection="row" gap="s6" wrap="wrap">
    {tags.map(tag => (
      <Box bg="fill.tertiary" borderRadius="full" key={tag} px="s10" py="s4">
        <RnText color="content.secondary" variant="captionMedium">
          {tag}
        </RnText>
      </Box>
    ))}
  </Box>
)
