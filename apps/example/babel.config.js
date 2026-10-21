module.exports = api => {
  api.cache(true)

  // babel-preset-expo auto-injects react-native-worklets/plugin (Reanimated 4) when installed.
  return {
    presets: [['babel-preset-expo', {jsxRuntime: 'automatic'}]],
  }
}
