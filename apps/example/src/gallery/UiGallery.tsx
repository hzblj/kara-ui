import {RnScrollView} from '@hzblj/kara-ui'
import {Fragment} from 'react'

import {GalleryHeader} from './components/gallery-header'
import {GallerySectionHeader} from './components/gallery-section'
import {GALLERY_SECTIONS} from './gallery-sections'
import type {UiGalleryComponent} from './UiGallery.types'

export const UiGallery: UiGalleryComponent = () => (
  <RnScrollView
    bg="surface.base"
    content={{pb: 's32', pt: 's8', px: 's20'}}
    contentInsetAdjustmentBehavior="automatic"
    flex={1}
    testID="ui-gallery"
  >
    <GalleryHeader />
    {GALLERY_SECTIONS.map(({Content, id, title}) => (
      <Fragment key={id}>
        <GallerySectionHeader title={title} />
        <Content />
      </Fragment>
    ))}
  </RnScrollView>
)
