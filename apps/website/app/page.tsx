import {MarketingPage} from '../src/marketing/marketing-page'
import {homeLd, JsonLd} from '../src/seo/json-ld'
import {homeMetadata} from '../src/seo/metadata'

export const metadata = homeMetadata

export default function Home() {
  return (
    <>
      <JsonLd data={homeLd} />
      <MarketingPage />
    </>
  )
}
