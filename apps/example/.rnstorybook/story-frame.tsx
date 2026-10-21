import {RnScrollView} from '@hzblj/kara-ui'
import type {ReactNode} from 'react'

import {ThemePreferenceControl} from '../src/appearance'

export const StoryFrame = ({children}: {children: ReactNode}) => (
  <RnScrollView bg="surface.base" content={{gap: 's16', p: 's16'}} flex={1} testID="storybook-story-frame">
    <ThemePreferenceControl testID="storybook-theme-preference" />
    {children}
  </RnScrollView>
)
