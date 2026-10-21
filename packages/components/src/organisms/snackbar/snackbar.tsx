import {FadeInDown, FadeOutDown} from 'react-native-reanimated'

import {ABox} from '../../atoms/box'
import {Pressable} from '../../atoms/pressable'
import {RnText} from '../../atoms/rn-text'
import type {SnackbarComponent, SnackbarProps} from './snackbar.types'

export const Snackbar: SnackbarComponent = ({actionLabel, message, onAction, visible}: SnackbarProps) => {
  if (!visible) {
    return null
  }

  return (
    <ABox
      align="center"
      bg="surface.high.contrast"
      borderRadius="medium"
      bottom={24}
      entering={FadeInDown}
      exiting={FadeOutDown}
      flexDirection="row"
      gap="s12"
      left={16}
      position="absolute"
      px="s16"
      py="s12"
      right={16}
      shadow="snackbar"
    >
      <RnText color="content.on.high.contrast" variant="footnote">
        {message}
      </RnText>
      {actionLabel ? (
        <Pressable onPress={onAction}>
          <RnText color="content.accent" variant="footnoteMedium">
            {actionLabel}
          </RnText>
        </Pressable>
      ) : null}
    </ABox>
  )
}
