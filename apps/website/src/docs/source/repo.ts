import path from 'node:path'

/**
 * The monorepo's root. The site reads the library's sources, the example's shot list and the changelog straight out
 * of the checkout while it builds — every page is static, so none of this runs once deployed.
 */
export const REPO_ROOT = path.resolve(process.cwd(), '../..')

export const WEBSITE_ROOT = process.cwd()

/**
 * A reader of the checkout, run once per build. In development it reads again once its result is a couple of seconds
 * old — fresh enough that a new capture or a changed type shows on the next reload, without parsing the library once
 * per props table.
 */
export const fromCheckout = <TValue>(read: () => TValue): (() => TValue) => {
  let value: TValue | undefined
  let readAt = 0

  return () => {
    if (value === undefined || (process.env.NODE_ENV !== 'production' && Date.now() - readAt > 2000)) {
      value = read()
      readAt = Date.now()
    }

    return value
  }
}
