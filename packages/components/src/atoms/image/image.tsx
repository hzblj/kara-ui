import {sx} from '@hzblj/kara-sx'
import {duration} from '@hzblj/kara-theme'
import {Image as ExpoImage, type ImageProps as ExpoImageProps} from 'expo-image'
import type {Ref} from 'react'

const FADE = {duration: duration.quick, timing: 'ease-out'} as const

const FadingImage = (props: ExpoImageProps & {ref?: Ref<ExpoImage>}) => <ExpoImage transition={FADE} {...props} />

/**
 * `expo-image` with the `sx` props, the way `Box` is a `View` with them, and the design system's fade (`quick`,
 * eased out) already applied, so a loaded image never pops in. An explicit `transition` wins, and so does an explicit `style`.
 */
export const Image = sx(FadingImage)
