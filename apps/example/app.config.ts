import type {ExpoConfig} from 'expo/config'

// Not "Kara UI": the generated Xcode target would be `KaraUI`, the Swift module name of the library's native module.
const NAME = 'Kara Example'
const BUNDLE_ID = 'com.hzblj.karaui.example'
// kara's accent, `orange[11]`: what the Android icon's white mark sits on, as the iOS one does on its gradient.
const ICON_BACKGROUND = '#ff5700'
const SPLASH_BACKGROUND_LIGHT = '#ffffff'
const SPLASH_BACKGROUND_DARK = '#000000'

export default {
  android: {
    adaptiveIcon: {
      backgroundColor: ICON_BACKGROUND,
      foregroundImage: './assets/adaptive-icon.png',
      monochromeImage: './assets/adaptive-icon.png',
    },
    package: BUNDLE_ID,
  },
  experiments: {
    typedRoutes: true,
  },
  icon: './assets/ios-light.png',
  ios: {
    bundleIdentifier: BUNDLE_ID,
    icon: {
      dark: './assets/ios-dark.png',
      light: './assets/ios-light.png',
      tinted: './assets/ios-tinted.png',
    },
    infoPlist: {
      CADisableMinimumFrameDurationOnPhone: true,
    },
    supportsTablet: true,
  },
  name: NAME,
  orientation: 'portrait',
  plugins: [
    'expo-router',
    // The app's icons: every SVG in assets/icons becomes a native asset on both platforms at prebuild, and its name a
    // type in kara-icons.d.ts. Built from packages/expo-plugin, which is why `yarn prebuild` builds the plugin first.
    ['@hzblj/kara-ui', {icons: {source: './assets/icons'}}],
    [
      'expo-splash-screen',
      {
        backgroundColor: SPLASH_BACKGROUND_LIGHT,
        dark: {
          backgroundColor: SPLASH_BACKGROUND_DARK,
          image: './assets/splash-icon-dark.png',
        },
        image: './assets/splash-icon-light.png',
        imageWidth: 200,
        resizeMode: 'contain',
      },
    ],
  ],
  scheme: 'kara-ui',
  slug: 'kara-ui-example',
  userInterfaceStyle: 'automatic',
  version: '1.0.0',
} satisfies ExpoConfig
