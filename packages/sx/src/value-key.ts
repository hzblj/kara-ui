/**
 * Flattens a value into a cache-key fragment. Objects are walked one level — with keys sorted, so
 * two configs holding the same values key alike — rather than left to `String`, which turns every
 * object into the same `[object Object]` and would have two different ones share a cache entry.
 * One level is all the `Bucket` constraint admits, so deeper nesting cannot reach this.
 */
export const valueKey = (value: unknown): string => {
  if (typeof value !== 'object' || value === null) {
    return String(value)
  }

  const entries = value as Record<string, unknown>

  return `{${Object.keys(entries)
    .sort()
    .map(name => `${name}:${String(entries[name])}`)
    .join(',')}}`
}
