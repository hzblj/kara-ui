const fs = require('node:fs')
const path = require('node:path')
const {getDefaultConfig} = require('expo/metro-config')
const {withStorybook} = require('@storybook/react-native/metro/withStorybook')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')
const packagesRoot = path.resolve(workspaceRoot, 'packages')

const config = getDefaultConfig(projectRoot)

config.watchFolders = [workspaceRoot]

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

// `contract.check.ts` files exist only for the type checker; nothing imports them, and Metro must never try.
config.resolver.blockList = [/.*\/contract\.check\.ts$/]

/**
 * Every workspace package's entry points — `@hzblj/kara-ui`, `@hzblj/kara-theme`, `@hzblj/kara-native/swift-ui`… —
 * mapped to the TypeScript source its `exports` names under `source`. The published entry points are the built
 * `lib/`, which would make every edit wait for a build; here the example runs the packages' source, so Fast Refresh
 * reaches them like app code.
 */
const packageSources = new Map(
  fs
    .readdirSync(packagesRoot)
    .map(directory => path.join(packagesRoot, directory))
    .filter(directory => fs.existsSync(path.join(directory, 'package.json')))
    .flatMap(directory => {
      const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'))

      return Object.entries(manifest.exports ?? {})
        .filter(([, target]) => typeof target === 'object' && target.source)
        .map(([subpath, target]) => [path.posix.join(manifest.name, subpath), path.resolve(directory, target.source)])
    })
)

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const source = packageSources.get(moduleName)

  return source ? {filePath: source, type: 'sourceFile'} : context.resolveRequest(context, moduleName, platform)
}

// Storybook reports anonymous usage data to its own servers on every Metro start. Off unless asked for —
// set STORYBOOK_DISABLE_TELEMETRY=false to opt back in.
process.env.STORYBOOK_DISABLE_TELEMETRY = process.env.STORYBOOK_DISABLE_TELEMETRY ?? 'true'

module.exports = withStorybook(config, {
  configPath: path.resolve(projectRoot, '.rnstorybook'),
  // Storybook prepares every story in one pass on mount, and the doc tools add react-docgen argType enhancers to
  // each of them. Nothing here runs the react-docgen Babel plugin, so there is no `__docgenInfo` for them to read —
  // the work is pure first-load cost, and every story declares its own `argTypes` anyway.
  docTools: false,
  // On unless switched off. Disabled, Metro stubs `.rnstorybook`, the route still compiles, and none of Storybook,
  // its UI or the stories reaches the bundle — the gallery hides its link to match.
  enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED !== 'false',
})
