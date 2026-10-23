import {Box, RnScrollView, RnText} from '@hzblj/kara-ui'
import type {ReactNode} from 'react'

/** Every screen of the example: one React Native scroll view under the native large title. */
export const Page = ({children, testID}: {children: ReactNode; testID?: string}) => (
  <RnScrollView
    bg="surface.base"
    content={{gap: 's32', pb: 's48', pt: 's8', px: 's20'}}
    contentInsetAdjustmentBehavior="automatic"
    flex={1}
    testID={testID}
  >
    {children}
  </RnScrollView>
)

/** The sentence under a page's title that says what the page is about. */
export const Lead = ({children}: {children: ReactNode}) => (
  <RnText color="content.secondary" variant="body">
    {children}
  </RnText>
)

type SectionProps = {
  /** A line under the content — what to notice, or where the platforms differ. */
  caption?: string
  children: ReactNode
  /** Moves into place when a section above it changes height, its caption too: for a page whose demos resize. */
  layout?: boolean
  title?: string
}

/** A titled block of a page, in the style of a grouped list's header and footer. */
export const Section = ({caption, children, layout, title}: SectionProps) => (
  <Box gap="s8" layout={layout}>
    {title ? (
      <RnText color="content.secondary" variant="footnoteMedium">
        {title.toUpperCase()}
      </RnText>
    ) : null}
    {children}
    {caption ? (
      <Box layout={layout}>
        <RnText color="content.tertiary" variant="footnote">
          {caption}
        </RnText>
      </Box>
    ) : null}
  </Box>
)
