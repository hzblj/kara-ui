import Link from 'next/link'

import {Wordmark} from '../src/ui/wordmark'

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-screen max-w-[640px] content-center gap-6 px-7">
      <Link className="transition-opacity hover:opacity-70" href="/">
        <Wordmark className="text-[22px] font-bold tracking-[-0.04em]" />
      </Link>
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-content-accent">Error 404</p>
      <h1 className="text-[44px] font-bold leading-none tracking-[-0.05em]">This page does not exist.</h1>
      <p className="text-[17px] leading-7 text-content-secondary">
        The link may be out of date, or the page may have moved.
      </p>
      <div className="flex gap-4">
        <Link className="rounded-full bg-fill-accent-primary px-5 py-3 font-bold text-content-on-accent" href="/docs">
          Read the docs
        </Link>
        <Link className="px-2 py-3 font-semibold text-content-accent" href="/docs/components">
          Components
        </Link>
      </div>
    </main>
  )
}
