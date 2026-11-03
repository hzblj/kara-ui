import {Host, type HostProps} from '@expo/ui/jetpack-compose'
import {RippleConfiguration} from '@hzblj/kara-native/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'

export type ComposeHostProps = Omit<HostProps, 'colorScheme' | 'seedColor'>

/**
 * Every Compose tree kara draws on Android: the theme's appearance and Material seed, and `fill.ripple` as the ripple of
 * every Material control inside, so a press looks the same on a button, a chip and a list row. Import it only from
 * `.android` files.
 */
export const ComposeHost = ({children, ...props}: ComposeHostProps) => {
  const theme = useAppTheme()

  return (
    <Host colorScheme={theme.dark ? 'dark' : 'light'} seedColor={theme.materialSeed} {...props}>
      <RippleConfiguration color={theme.color('fill.ripple')}>{children}</RippleConfiguration>
    </Host>
  )
}
