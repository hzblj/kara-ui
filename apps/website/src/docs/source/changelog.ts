import {readFileSync} from 'node:fs'
import path from 'node:path'

import {REPO_ROOT} from './repo'

/** The umbrella package's changelog, as changesets writes it — release by release, with the dependency bumps dropped. */

export type ChangelogEntry = {
  commit?: {href: string; sha: string}
  /** The entry's own nested bullets — changesets' way of listing what one change contains. */
  items: string[]
  paragraphs: string[]
}

export type ChangelogRelease = {
  groups: {entries: ChangelogEntry[]; label: string}[]
  version: string
}

const CHANGELOG = path.join(REPO_ROOT, 'packages/kara-ui/CHANGELOG.md')
const VERSION = /^## +(.+?) *$/
const GROUP = /^### +(.+?) *$/
const BULLET = /^- +(.*)$/
const PULL = /^\[#\d+\]\([^)]+\) +/
const COMMIT = /^\[`([^`]+)`\]\(([^)]+)\) *(?:Thanks \[@[^\]]+\]\([^)]+\)! *)?- */

const parse = (source: string): ChangelogRelease[] => {
  const releases: ChangelogRelease[] = []
  let release: ChangelogRelease | undefined
  let group: ChangelogRelease['groups'][number] | undefined
  let entry: ChangelogEntry | undefined
  let isBroken = false

  for (const line of source.split('\n')) {
    const version = VERSION.exec(line)

    if (version) {
      release = {groups: [], version: version[1] ?? ''}
      releases.push(release)
      group = undefined
      entry = undefined
      continue
    }

    const label = GROUP.exec(line)

    if (label && release) {
      group = {entries: [], label: label[1] ?? ''}
      release.groups.push(group)
      entry = undefined
      continue
    }

    if (!group) {
      continue
    }

    const bullet = BULLET.exec(line)

    if (bullet && !line.startsWith(' ')) {
      entry = undefined
      const body = (bullet[1] ?? '').replace(PULL, '')

      if (body.startsWith('Updated dependencies')) {
        continue
      }

      const commit = COMMIT.exec(body)
      entry = {commit: commit ? {href: commit[2] ?? '', sha: commit[1] ?? ''} : undefined, items: [], paragraphs: []}
      group.entries.push(entry)

      const text = body.replace(COMMIT, '').trim()

      if (text) {
        entry.paragraphs.push(text)
      }

      isBroken = false
      continue
    }

    if (!line.trim()) {
      isBroken = true
      continue
    }

    if (entry && line.startsWith(' ')) {
      const text = line.trim()
      const item = BULLET.exec(text)

      if (item) {
        entry.items.push(item[1] ?? '')
      } else if (entry.items.length > 0 && !isBroken) {
        entry.items[entry.items.length - 1] += ` ${text}`
      } else if (isBroken || entry.paragraphs.length === 0) {
        entry.paragraphs.push(text)
      } else {
        entry.paragraphs[entry.paragraphs.length - 1] += ` ${text}`
      }

      isBroken = false
    }
  }

  return releases
    .map(item => ({...item, groups: item.groups.filter(candidate => candidate.entries.length > 0)}))
    .filter(item => item.groups.length > 0)
}

export const readChangelog = () => parse(readFileSync(CHANGELOG, 'utf8'))
