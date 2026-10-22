import {Box, useAppTheme} from '@hzblj/kara-ui'
import {useMemo} from 'react'
import {Platform, Text} from 'react-native'

const MONOSPACE = Platform.select({android: 'monospace', default: 'Menlo'})

/** A snippet to copy. Plain React Native text: kara's own text has no monospaced face, and should not need one. */
export const CodeBlock = ({code}: {code: string}) => {
  const theme = useAppTheme()
  const style = useMemo(
    () => ({color: theme.color('content.primary'), fontFamily: MONOSPACE, fontSize: 13, lineHeight: 20}),
    [theme]
  )

  return (
    <Box bg="fill.tertiary" borderRadius="medium" p="s16">
      <Text selectable style={style}>
        {code}
      </Text>
    </Box>
  )
}
