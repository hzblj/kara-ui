import {presentKeys} from './present-keys'
import type {Sx} from './sx.types'
import {SX_BUCKET_KEYS, SX_CORE_KEYS} from './sx-keys'
import {valueKey} from './value-key'

const SX_CORE_KEY_SET = new Set<string>(SX_CORE_KEYS)

/**
 * Keys sorted, because two buckets holding the same values can list them in a different order and
 * still have to key alike. Object configs flatten through `valueKey`, one level — which is all the
 * `Bucket` constraint admits. `modifiers` is skipped: it holds opaque configs, so no string stands
 * in for it — `useSxModifiers` depends on that array itself alongside this key.
 */
const bucketKey = (bucket: Record<string, unknown> | undefined): string => {
  if (!bucket) {
    return ''
  }

  return Object.keys(bucket)
    .filter(name => name !== 'modifiers')
    .sort()
    .map(name => `${name}:${valueKey(bucket[name])}`)
    .join(',')
}

/**
 * A stable `useMemo` dependency for an `Sx`. Atoms take theirs from a rest spread, so the object is
 * a fresh identity on every render even when nothing in it changed — the values flattened into one
 * string say exactly as much as the object does.
 *
 * Only the keys actually set are written, each under its name — see `presentKeys`, which
 * `resolve-cache` keys its entries by too.
 */
export const sxKey = (sx: Sx): string => {
  let key = ''

  for (const name of presentKeys(sx, SX_CORE_KEY_SET)) {
    key += `|${name}:${valueKey(sx[name])}`
  }

  for (const name of SX_BUCKET_KEYS) {
    const bucket = sx[name]

    if (bucket) {
      key += `|${name}:${bucketKey(bucket)}`
    }
  }

  return key
}
