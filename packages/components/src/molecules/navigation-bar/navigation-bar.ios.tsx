import {NavigationBar as NativeNavigationBar} from '@hzblj/kara-native/swift-ui'
import {useAppTheme} from '@hzblj/kara-theme'
import {StyleSheet} from 'react-native'
import type {NavigationBarComponent, NavigationBarProps} from './navigation-bar.types'

/** UIKit's compact bar height. The bar centres itself vertically in whatever it is given. */
const BAR_HEIGHT = 44

const styles = StyleSheet.create({
  bar: {height: BAR_HEIGHT, width: '100%'},
})

export const NavigationBar: NavigationBarComponent = ({
  backLabel = 'Back',
  closeLabel = 'Close',
  ...props
}: NavigationBarProps) => {
  const theme = useAppTheme()
  const title = theme.typography.body

  return (
    <NativeNavigationBar
      {...props}
      backLabel={backLabel}
      closeLabel={closeLabel}
      fontFamily={title.fontFamily}
      fontSize={title.fontSize}
      itemColor={theme.color('content.primary')}
      style={styles.bar}
      titleColor={theme.color('content.primary')}
    />
  )
}
