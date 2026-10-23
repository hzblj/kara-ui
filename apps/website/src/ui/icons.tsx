type IconProps = {className?: string}

export const MenuIcon = ({className}: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 16 16">
    <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
  </svg>
)

export const CloseIcon = ({className}: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 16 16">
    <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
  </svg>
)

export const CopyIcon = ({className}: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 16 16">
    <rect height="9" rx="2" stroke="currentColor" strokeWidth="1.2" width="9" x="5.5" y="5.5" />
    <path
      d="M10.5 3.5v-.5a1.5 1.5 0 0 0-1.5-1.5H3A1.5 1.5 0 0 0 1.5 3v6A1.5 1.5 0 0 0 3 10.5h.5"
      stroke="currentColor"
      strokeWidth="1.2"
    />
  </svg>
)

export const CheckIcon = ({className}: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 16 16">
    <path d="m3 8.5 3 3 7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
  </svg>
)

export const ArrowRightIcon = ({className}: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 16 16">
    <path
      d="M3 8h10M9 4l4 4-4 4"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.4"
    />
  </svg>
)

export const PlayIcon = ({className}: IconProps) => (
  <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 16 16">
    <path d="M5 3.6v8.8a.6.6 0 0 0 .9.5l7-4.4a.6.6 0 0 0 0-1L5.9 3.1a.6.6 0 0 0-.9.5Z" />
  </svg>
)

export const GithubMark = ({className}: IconProps) => (
  <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
)

export const NpmMark = ({className}: IconProps) => (
  <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 16 16">
    <path d="M0 4.5v6h4.5v1H8v-1h8v-6H0Zm4.5 5H3.5v-3h-1v3h-1v-4h3v4Zm3 0v1H5.5v-5h3v4h-1Zm7.5 0h-1v-3h-1v3h-1v-3h-1v3h-1v-4h5v4ZM7.5 6.5h-1v2h1v-2Z" />
  </svg>
)

export const SearchIcon = ({className}: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 16 16">
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="m10.5 10.5 3 3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
  </svg>
)

/** A component: four tiles, the way the gallery lays them out. */
export const ComponentIcon = ({className}: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 16 16">
    <rect height="4.5" rx="1.2" stroke="currentColor" strokeWidth="1.2" width="4.5" x="2.5" y="2.5" />
    <rect height="4.5" rx="1.2" stroke="currentColor" strokeWidth="1.2" width="4.5" x="9" y="2.5" />
    <rect height="4.5" rx="1.2" stroke="currentColor" strokeWidth="1.2" width="4.5" x="2.5" y="9" />
    <rect height="4.5" rx="2.25" stroke="currentColor" strokeWidth="1.2" width="4.5" x="9" y="9" />
  </svg>
)

/** A guide: a page with lines of text. */
export const PageIcon = ({className}: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 16 16">
    <path
      d="M4.5 1.5h4.6l3.4 3.4v8.1a1.5 1.5 0 0 1-1.5 1.5h-6.5A1.5 1.5 0 0 1 3 13V3a1.5 1.5 0 0 1 1.5-1.5Z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.2"
    />
    <path d="M5.5 8.5h5M5.5 11h3.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" />
  </svg>
)

/** A section of a guide. */
export const HashIcon = ({className}: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 16 16">
    <path
      d="M6.5 2.5 5 13.5M11 2.5 9.5 13.5M2.5 6h11M2 10.5h11"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.2"
    />
  </svg>
)
