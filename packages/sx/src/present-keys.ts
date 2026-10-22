/**
 * The names in `props` that `keys` owns and that hold a value, sorted — what both caches build their keys from.
 *
 * Walking the props rather than the key list is the point: the view surface has some seventy keys and a component
 * sets a handful, so going down the list paid a lookup for every key left out, on every render. Sorted, because two
 * call sites setting the same props in a different order still have to share an entry. An `undefined` counts as left
 * out — the rest spreads atoms take their `sx` from carry those explicitly.
 */
export const presentKeys = <T extends object>(props: T, keys: ReadonlySet<string>): (keyof T & string)[] =>
  (Object.keys(props) as (keyof T & string)[]).filter(name => props[name] !== undefined && keys.has(name)).sort()
