import type {ReactNode} from 'react'

import {DocsLayout} from '../../src/docs/docs-layout'

export default function DocumentationLayout({children}: Readonly<{children: ReactNode}>) {
  return <DocsLayout>{children}</DocsLayout>
}
