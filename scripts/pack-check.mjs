/**
 * Checks what npm would receive, the way a consumer meets it. Packs every published package (each `prepack` builds it
 * and its dependencies through turbo's cache), asserts what must and must not ship in each tarball, then installs all
 * of them into a throwaway app and type-checks real usage of `@hzblj/kara-ui` with a consumer's TypeScript — no
 * `moduleSuffixes`, no `source` condition, no workspace links, only what the tarballs declare.
 *
 * The negative cases matter as much as the positive ones: if a declaration failed to resolve, its imports would
 * quietly become `any` and everything would compile, so each `@ts-expect-error` is there to prove the types are real.
 */
import {execFileSync} from 'node:child_process'
import {existsSync} from 'node:fs'
import {mkdir, readdir, readFile, rm, writeFile} from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const WORK = path.join(ROOT, '.pack-check')

const run = (command, args, cwd = ROOT) => execFileSync(command, args, {cwd, encoding: 'utf8'})

const fail = message => {
  console.error(`pack-check: ${message}`)
  process.exit(1)
}

/** Every tarball. Source maps ship with `lib/`, so the TypeScript they point at ships too. */
const COMMON_REQUIRED = ['package.json', 'README.md']

const LIBRARY_REQUIRED = ['lib/module/index.js', 'lib/typescript/index.d.ts']

const REQUIRED = {
  '@hzblj/kara-expo-plugin': ['app.plugin.js', 'build/index.js', 'build/index.d.ts', 'build/cli.js'],
  '@hzblj/kara-native': [
    ...LIBRARY_REQUIRED,
    'expo-module.config.json',
    'ios/KaraUI.podspec',
    'android/build.gradle',
    'android/src/main/res/drawable/kara_glyph_search.xml',
    'THIRD_PARTY_NOTICES.md',
    'lib/typescript/swift-ui/index.d.ts',
    'lib/typescript/jetpack-compose/index.d.ts',
  ],
  '@hzblj/kara-ui': [
    ...LIBRARY_REQUIRED,
    'app.plugin.js',
    'bin/kara-icons.js',
    'lib/typescript/router.d.ts',
    'lib/typescript/swift-ui.d.ts',
  ],
}

const FORBIDDEN = [/\.stories\.tsx?$/, /contract\.check/, /story-decorators/, /^(android|ios)\/build\//, /\.DS_Store$/]

const packages = []

for (const directory of await readdir(path.join(ROOT, 'packages'))) {
  const manifestPath = path.join(ROOT, 'packages', directory, 'package.json')

  if (!existsSync(manifestPath)) {
    continue
  }

  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))

  if (!manifest.private) {
    packages.push({directory, name: manifest.name})
  }
}

await rm(WORK, {force: true, recursive: true})
await mkdir(path.join(WORK, 'tarballs'), {recursive: true})

let fileCount = 0

for (const {directory, name} of packages) {
  const tarball = path.join(WORK, 'tarballs', `${directory}.tgz`)

  run('yarn', ['pack', '--out', tarball], path.join(ROOT, 'packages', directory))

  const files = run('tar', ['-tzf', tarball])
    .split('\n')
    .filter(Boolean)
    .map(file => file.replace(/^package\//, ''))

  const required = [...COMMON_REQUIRED, ...(REQUIRED[name] ?? LIBRARY_REQUIRED)]
  const missing = required.filter(file => !files.includes(file))
  const leaked = files.filter(file => FORBIDDEN.some(pattern => pattern.test(file)))

  if (missing.length > 0) {
    fail(`${name} is missing:\n  ${missing.join('\n  ')}`)
  }

  if (leaked.length > 0) {
    fail(`${name} must not ship:\n  ${leaked.join('\n  ')}`)
  }

  const packed = JSON.parse(run('tar', ['-xzOf', tarball, 'package/package.json']))

  if (JSON.stringify(packed.dependencies ?? {}).includes('workspace:')) {
    fail(`${name} still declares a workspace: range — it would not install outside this repo`)
  }

  const installed = path.join(WORK, 'node_modules', name)

  await mkdir(installed, {recursive: true})
  run('tar', ['-xzf', tarball, '-C', installed, '--strip-components', '1'])
  fileCount += files.length
}

const umbrella = JSON.parse(
  await readFile(path.join(WORK, 'node_modules', '@hzblj', 'kara-ui', 'package.json'), 'utf8')
)
const subpaths = Object.entries(umbrella.exports)
  .filter(([, target]) => typeof target === 'object' && target.types)
  .map(([subpath]) => path.posix.join(umbrella.name, subpath))

const consumer = `import {
  adaptive,
  Button,
  type ColorToken,
  defineTheme,
  Icon,
  KaraProvider,
  RnIcon,
  native,
  Screen,
  Text,
  useAppTheme,
  VStack,
} from '@hzblj/kara-ui'
import {navigationTheme, Tabs} from '@hzblj/kara-ui/router'
${subpaths.map((subpath, index) => `import * as entry${index} from '${subpath}'`).join('\n')}

export const entries = [${subpaths.map((_, index) => `entry${index}`).join(', ')}]

const theme = defineTheme({
  colors: {content: {accent: adaptive({dark: '#a5b4fc', light: '#4338ca'})}, fill: {accent: {primary: '#4f46e5'}}},
  dynamicColor: true,
  fonts: {text: {medium: 'Inter-Medium', regular: 'Inter-Regular'}},
})

export const App = () => {
  const current = useAppTheme()
  const background: ColorToken = 'surface.base'

  return (
    <KaraProvider theme={theme} themePreference="system">
      <Screen bg={background}>
        <VStack p="s16" spacing="s12">
          <Text color="content.primary" variant="body">
            {current.dark ? 'dark' : 'light'}
          </Text>
          <Button label="Continue" onPress={() => undefined} variant="accent" />
        </VStack>
      </Screen>
    </KaraProvider>
  )
}

export const Layout = () => (
  <Tabs>
    <Tabs.Screen icon="bolt" name="index" title="Home" />
  </Tabs>
)

export const navigation = navigationTheme

// What the config plugin writes into kara-icons.d.ts for an icon folder holding bolt.svg and arrow-left.svg.
declare global {
  interface KaraIcons {
    bolt: true
    'arrow-left': true
  }
}

export const Icons = () => (
  <>
    <Icon name="bolt" />
    <RnIcon color="content.accent" name="arrow-left" size="s16" />
  </>
)

// @ts-expect-error — not in the app's icon folder
export const MissingIcon = () => <Icon name="heart" />

// @ts-expect-error — a raw number is not a spacing token
export const RawSpacing = () => <VStack p={16} />

// @ts-expect-error — not a colour token
export const unknownColor: ColorToken = 'brand.primary'

// @ts-expect-error — not a button variant
export const UnknownVariant = () => <Button label="x" variant="primary" />

// @ts-expect-error — a dimmable token cannot become the platform's colour on iOS: \`:oNN\` would have no alpha to scale
export const undimmable = defineTheme({colors: {fill: {accent: {base: native({android: 'primary', ios: 'systemBlueColor'})}}}})
`

await writeFile(path.join(WORK, 'consumer.tsx'), consumer)
await writeFile(
  path.join(WORK, 'tsconfig.json'),
  JSON.stringify(
    {
      compilerOptions: {noEmit: true, skipLibCheck: true, strict: true},
      extends: 'expo/tsconfig.base',
      include: ['consumer.tsx'],
    },
    null,
    2
  )
)

try {
  run('yarn', ['run', '-T', 'tsc', '-p', WORK])
} catch (error) {
  fail(`a consumer's type check failed:\n${error.stdout}`)
}

await rm(WORK, {force: true, recursive: true})

console.log(
  `pack-check: ${packages.length} packages, ${fileCount} files, ${subpaths.length} entry points type-check for a consumer`
)
