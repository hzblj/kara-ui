import {view} from './storybook.requires'

/**
 * Remembers the story that was open last for the session only. Persisting it across launches would mean one more
 * native storage module in an example whose point is the components.
 */
const session = new Map<string, string>()

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: key => session.get(key) ?? null,
    setItem: (key, value) => {
      session.set(key, value)
    },
  },
})

export default StorybookUIRoot
