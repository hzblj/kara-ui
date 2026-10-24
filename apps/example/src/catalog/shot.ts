/**
 * `?shot=1` on a component's page: the page as the website records it, for a shot that photographs a real route. The
 * title is spelled out in words and the demo stands alone, without the summary, its captions or its settings.
 */
export const SHOT_PARAM = 'shot'

export const isShot = (params: Record<string, unknown> | undefined) => params?.[SHOT_PARAM] === '1'
