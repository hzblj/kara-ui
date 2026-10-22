import Link from 'next/link'
import {Fragment, type ReactNode} from 'react'

const TOKEN = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)]+\))/g

/**
 * The little markdown the docs' strings carry — `code`, **bold**, *emphasis* and [links](/docs/…) — and nothing more, so a JSDoc
 * comment or a note reads the same here as it does in an editor.
 */
export const Inline = ({text}: {text: string}): ReactNode =>
  text.split(TOKEN).map((part, index) => {
    const key = `${index}:${part}`

    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={key}>{part.slice(1, -1)}</code>
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key}>{part.slice(2, -2)}</strong>
    }

    if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
      return <em key={key}>{part.slice(1, -1)}</em>
    }

    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part)

    if (link?.[1] && link[2]) {
      return link[2].startsWith('/') ? (
        <Link href={link[2]} key={key}>
          {link[1]}
        </Link>
      ) : (
        <a href={link[2]} key={key}>
          {link[1]}
        </a>
      )
    }

    return <Fragment key={key}>{part}</Fragment>
  })
