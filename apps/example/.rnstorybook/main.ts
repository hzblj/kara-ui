import type {StorybookConfig} from '@storybook/react-native'

/**
 * Stories sit next to the components they document, in `packages/components`. One entry per atomic tier rather than a
 * single `src/**` glob: `templates/` is deliberately absent, and listing the tiers is what keeps it that way. `Screen`
 * is a full-bleed host that owns the whole viewport — framed inside a story it would show nothing a story can vary, and
 * every other story already renders through one. `packages/router` adds the story documenting `Tabs`, which only an
 * Expo Router layout mounts.
 */
const main: StorybookConfig = {
  deviceAddons: [
    '@storybook/addon-ondevice-actions',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-notes',
  ],
  stories: [
    '../../../packages/components/src/atoms/**/*.stories.tsx',
    '../../../packages/components/src/molecules/**/*.stories.tsx',
    '../../../packages/components/src/organisms/**/*.stories.tsx',
    '../../../packages/router/src/**/*.stories.tsx',
  ],
}

export default main
