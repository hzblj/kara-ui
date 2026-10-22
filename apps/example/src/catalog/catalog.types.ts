import type {FC} from 'react'

/** One component's page: what it is, what draws it, live examples, and the snippet to start from. */
export type CatalogEntry = {
  code: string
  Demo: FC
  id: string
  name: string
  summary: string
  tags: readonly string[]
}

export type CatalogGroup = {
  entries: readonly CatalogEntry[]
  id: string
  title: string
}
