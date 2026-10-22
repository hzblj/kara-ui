import {SITE_URL} from '../site'
import {MARK} from '../ui/wordmark'
import type {SeoPage} from './metadata'

const ORANGE = '#ff5700'

/** The title's size: as large as 88px, but small enough that its longest word fits the text column (~0.61em a letter). */
const titleSize = (title: string) =>
  Math.min(88, Math.floor(620 / (Math.max(...title.split(' ').map(word => word.length)) * 0.61)))

/** Long summaries end at a word, inside the card. */
const clip = (text: string, max: number) =>
  text.length <= max ? text : `${text.slice(0, text.lastIndexOf(' ', max)).replace(/[,.;:—–-]+$/, '')}…`

/**
 * A page's social image, 1200 × 630, drawn by `next/og` (Satori): flexbox only, every box with more than one child
 * says `display: flex`. Dark, with the mark large on the right and the page's title and summary on the left.
 */
export const OgCard = ({page}: {page: SeoPage}) => (
  <div
    style={{
      backgroundColor: '#0a0a0a',
      backgroundImage: 'radial-gradient(circle at 82% 50%, rgba(255, 87, 0, 0.22), transparent 46%)',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter',
      height: '100%',
      justifyContent: 'space-between',
      padding: '64px 72px',
      position: 'relative',
      width: '100%',
    }}
  >
    <svg
      fill={ORANGE}
      height="340"
      style={{position: 'absolute', right: 96, top: 145}}
      viewBox="0 0 100 100"
      width="340"
    >
      <path d={MARK} />
    </svg>

    <div style={{alignItems: 'center', display: 'flex', gap: 16}}>
      <svg fill={ORANGE} height="44" viewBox="0 0 100 100" width="44">
        <path d={MARK} />
      </svg>
      <span style={{fontSize: 44, fontWeight: 700, letterSpacing: '-0.04em'}}>Kara</span>
    </div>

    <div style={{display: 'flex', flexDirection: 'column', maxWidth: 640}}>
      {page.kicker ? (
        <span style={{color: '#ff7d4f', fontSize: 26, fontWeight: 500, marginBottom: 18}}>{page.kicker}</span>
      ) : null}
      <span
        style={{
          fontSize: titleSize(page.title),
          fontWeight: 700,
          letterSpacing: '-0.05em',
          lineHeight: 1,
        }}
      >
        {page.title}
      </span>
      <span style={{color: '#a6a6a6', fontSize: 30, fontWeight: 500, lineHeight: 1.35, marginTop: 24}}>
        {clip(page.description, 110)}
      </span>
    </div>

    <div style={{color: '#666666', display: 'flex', fontSize: 24, fontWeight: 500, justifyContent: 'space-between'}}>
      <span>{SITE_URL.replace('https://', '')}</span>
      <span>iOS · Android · Expo</span>
    </div>
  </div>
)
