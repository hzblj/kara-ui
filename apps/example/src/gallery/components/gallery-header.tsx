import {Box, Island, ListItem} from '@hzblj/kara-ui'
import {router} from 'expo-router'

import {ThemePreferenceControl} from '../../appearance'

/**
 * Mirrors `enabled` in `metro.config.js`, which is what actually decides whether Storybook is in the bundle — with
 * it switched off, `/storybook` is a stub, so the row goes with it.
 */
const STORYBOOK_LINKED = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED !== 'false'

const openStorybook = () => router.push('/storybook')

export const GalleryHeader = () => (
  <Box gap="s12">
    <ThemePreferenceControl testID="gallery-theme-preference" />
    {STORYBOOK_LINKED ? (
      <Island>
        <ListItem
          icon="grid"
          onPress={openStorybook}
          subtitle="The same components one at a time, with controls"
          testID="gallery-storybook-link"
          title="Storybook"
        />
      </Island>
    ) : null}
  </Box>
)
