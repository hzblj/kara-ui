import {writeFileSync} from 'node:fs'
import path from 'node:path'

import {iconTypes, readIconFolder} from './icons'

const USAGE = `Usage: kara-icons <source> [--out <file>]

  Checks every SVG in <source> the way prebuild will, and writes the TypeScript declaration that makes
  their names valid for <Icon name="…" />. The config plugin does the same whenever the app config is
  read; this is for CI and for projects that type-check without starting Expo.

  --out   where to write the declaration (default: kara-icons.d.ts in the current directory)`

/**
 * `npx kara-icons ./assets/icons` — the half of custom icons that runs before prebuild: validation, so a bad SVG fails
 * here rather than mid-prebuild, and the names, so the app type-checks against the icons it actually ships.
 */
export const main = (args: string[]): number => {
  const outIndex = args.indexOf('--out')
  const outValueIndex = outIndex === -1 ? -1 : outIndex + 1
  const out = outIndex === -1 ? 'kara-icons.d.ts' : args[outValueIndex]
  const source = args.find((arg, index) => !arg.startsWith('--') && index !== outValueIndex)

  if (!source || !out || args.includes('--help')) {
    console.log(USAGE)

    return source ? 0 : 1
  }

  try {
    const {android, ios, names} = readIconFolder(path.resolve(source))

    writeFileSync(path.resolve(out), iconTypes(names, source))
    console.log(`kara-icons: ${names.length} icons (${ios.length} iOS, ${android.length} Android) → ${out}`)

    return 0
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)

    return 1
  }
}
