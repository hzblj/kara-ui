import type {SearchEntry, SearchKind} from './search-index'

/** Lower case, accents gone: `Ča` finds `ca`, and the other way round. */
export const normalize = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export type SearchTarget = SearchEntry & {
  /** The normalised fields, worked out once rather than on every keystroke. */
  match: {detail: string; keywords: string; title: string; words: string[]}
}

export const toTargets = (entries: SearchEntry[]): SearchTarget[] =>
  entries.map(entry => {
    const title = normalize(entry.title)

    return {
      ...entry,
      match: {
        detail: normalize(`${entry.detail} ${entry.context}`),
        keywords: normalize(entry.keywords),
        title,
        words: title.split(/[^a-z0-9]+/).filter(Boolean),
      },
    }
  })

/** A component is what a reader most often looks for, then a guide, then a section of one. */
const KIND_WEIGHT: Record<SearchKind, number> = {component: 3, guide: 2, section: 0}

/** How well one term matches: in the title above all, then the line under it, then the rest. `0` is no match. */
const termScore = ({match}: SearchTarget, term: string) => {
  if (match.title === term) {
    return 100
  }

  if (match.title.startsWith(term)) {
    return 60
  }

  if (match.words.some(word => word.startsWith(term))) {
    return 40
  }

  if (match.title.includes(term)) {
    return 25
  }

  if (match.detail.includes(term)) {
    return 10
  }

  return match.keywords.includes(term) ? 4 : 0
}

/** Every term has to match somewhere; the best matches first, the index's own order between equals. */
export const search = (targets: SearchTarget[], query: string, limit = 30): SearchTarget[] => {
  const terms = normalize(query).split(/\s+/).filter(Boolean)

  if (terms.length === 0) {
    return []
  }

  return targets
    .map((target, index) => {
      let score = 0

      for (const term of terms) {
        const points = termScore(target, term)

        if (points === 0) {
          return null
        }

        score += points
      }

      return {index, score: score + KIND_WEIGHT[target.kind], target}
    })
    .filter(result => result !== null)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(result => result.target)
}
