/** `arrow-left` → `arrow_left`: Android resource names allow neither `-` nor capitals, so neither side uses them. */
const snakeCase = (name: string): string => name.replace(/-/g, '_').toLowerCase()

/**
 * An app icon's native name, the same on both platforms — the iOS asset and the Android drawable the config plugin
 * writes for `<name>.svg`. Mirrors `iconResourceName` in `@hzblj/kara-expo-plugin`, which runs in Node and cannot
 * import this; the two must stay identical.
 */
export const iconResourceName = (name: string): string => `kara_icon_${snakeCase(name)}`
