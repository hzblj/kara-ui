import type {NextConfig} from 'next'

const config: NextConfig = {
  // The package's own CLAUDE.md is the guide for agents; Next would otherwise write an AGENTS.md beside it.
  agentRules: false,
  // `yarn tsc:check` type-checks the site with the monorepo's TypeScript, which `next build` cannot drive.
  typescript: {ignoreBuildErrors: true},
}

export default config
