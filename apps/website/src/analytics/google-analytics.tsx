import Script from 'next/script'

/** The site's Google Analytics 4 property. */
const MEASUREMENT_ID = 'G-D1JC6JRTTX'

/**
 * Google's tag, as Google gives it, loaded after the page is interactive. Production deployments only — every page is
 * rendered at build, so a preview deployment or `yarn site` never sends a page view.
 */
export const GoogleAnalytics = () =>
  process.env.VERCEL_ENV === 'production' ? (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${MEASUREMENT_ID}');`}
      </Script>
    </>
  ) : null
