const warned = new Set<string>()

/**
 * Announces an atom that only one platform can implement. The stub still satisfies the shared
 * component type, so `contract.check.ts` keeps both files honest — this just makes the gap loud
 * in dev instead of leaving a control that mysteriously never appears.
 *
 * Warns once per atom: the gap is permanent, so repeating it every render would be noise.
 */
export const warnUnsupported = (atom: string, platform: 'Android' | 'iOS') => {
  if (!__DEV__ || warned.has(atom)) {
    return
  }

  warned.add(atom)

  console.error(
    `[kara-ui] <${atom}> has no ${platform} implementation and renders nothing there. Branch on Platform.OS at the call site.`
  )
}
