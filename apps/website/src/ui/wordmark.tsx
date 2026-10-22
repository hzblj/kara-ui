import {cn} from './utils'

/** kara's mark: four soft leaves — quarter discs, two and their mirror image — opening from the middle like a flower. */
export const MARK =
  'M47.37 35.79v5.99c0 1.51 -0.65 2.95 -1.78 3.95c-1.13 1 -2.64 1.46 -4.14 1.27c-21.47 -2.7 -38.37 -19.61 -41.08 -41.08c-0.19 -1.5 0.28 -3.01 1.27 -4.14c1 -1.13 2.44 -1.78 3.95 -1.78h5.99c19.77 0 35.79 16.02 35.79 35.79zM11.58 100h-5.99c-1.51 0 -2.95 -0.65 -3.95 -1.78c-1 -1.13 -1.46 -2.64 -1.27 -4.14c2.7 -21.47 19.61 -38.37 41.08 -41.08c1.5 -0.19 3.01 0.28 4.14 1.27c1.13 1 1.78 2.44 1.78 3.95v5.99c0 19.77 -16.02 35.79 -35.79 35.79zM88.42 0h5.99c1.51 0 2.95 0.65 3.95 1.78c1 1.13 1.46 2.64 1.27 4.14c-2.7 21.47 -19.61 38.37 -41.08 41.08c-1.5 0.19 -3.01 -0.28 -4.14 -1.27c-1.13 -1 -1.78 -2.44 -1.78 -3.95v-5.99c0 -19.77 16.02 -35.79 35.79 -35.79zM52.63 64.21v-5.99c0 -1.51 0.65 -2.95 1.78 -3.95c1.13 -1 2.64 -1.46 4.14 -1.27c21.47 2.7 38.37 19.61 41.08 41.08c0.19 1.5 -0.28 3.01 -1.27 4.14c-1 1.13 -2.44 1.78 -3.95 1.78h-5.99c-19.77 0 -35.79 -16.02 -35.79 -35.79z'

export const KaraMark = ({className}: {className?: string}) => (
  <svg aria-hidden="true" className={className} fill="currentColor" viewBox="-4 -4 108 108">
    <path d={MARK} />
  </svg>
)

export const Wordmark = ({className}: {className?: string}) => (
  <span className={cn('inline-flex items-center gap-[0.32em]', className)}>
    <KaraMark className="h-[0.95em] w-auto shrink-0 text-fill-accent-primary" />
    {/* The text, not the mark, is the wordmark's baseline — what "Docs" beside it lines up with. */}
    <span className="self-baseline">Kara</span>
  </span>
)
