import type {ExpoConfig} from 'expo/config'

// Not "Kara UI": the generated Xcode target would be `KaraUI`, the Swift module name of the library's native module.
const NAME = 'Kara Example'
const BUNDLE_ID = 'com.hzblj.karaui.example'
const SPLASH_BACKGROUND_LIGHT = '#ffffff'
const SPLASH_BACKGROUND_DARK = '#000000'

export default {
  android: {
    adaptiveIcon: {
      backgroundColor: SPLASH_BACKGROUND_LIGHT,
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
