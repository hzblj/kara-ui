import type {Preview} from '@storybook/react-native'

import {StoryFrame} from './story-frame'

/**
 * No `controls.matchers` for colour: every colour prop in the library takes a `ColorToken`, and a matcher
 * would hand the panel a colour picker that writes raw hex — which does not type-check and does not
 * resolve. Stories that expose one declare a `select` over real tokens instead.
 */
const preview: Preview = {
  decorators: [
    Story => (
      <StoryFrame>
        <Story />
      </StoryFrame>
    ),
  ],
}

export default preview
