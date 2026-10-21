import type {FC, ReactNode} from 'react'

export type UiGalleryComponent = () => ReactNode

export type GallerySectionEntry = {
  Content: FC
  id: string
  title: string
}
