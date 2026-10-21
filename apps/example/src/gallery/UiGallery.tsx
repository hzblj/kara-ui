import {RnFlatList, RnScrollView} from '@hzblj/kara-ui'
import {Fragment} from 'react'
import {Platform} from 'react-native'

import {GalleryHeader} from './components/gallery-header'
import {GallerySectionHeader} from './components/gallery-section'
import {GALLERY_SECTIONS} from './gallery-sections'
import type {GallerySectionEntry, UiGalleryComponent} from './UiGallery.types'

const Section = ({Content, title}: GallerySectionEntry) => (
  <>
    <GallerySectionHeader title={title} />
    <Content />
  </>
)

const renderSection = ({item}: {item: GallerySectionEntry}) => <Section {...item} />

/**
 * Virtualized on Android: every section hosts native views, and mounting all of them at once — dozens of Compose
 * hosts composed in one frame when the tab attaches — stalls the main thread long enough for an ANR. `RnFlatList`
 * mounts the sections near the viewport and keeps each host in normal flow. iOS keeps one scroll view: SwiftUI hosts
 * are cheap to mount, and `ScrollEdgeContainer` draws only its bottom bar inside a virtualized cell.
 */
export const UiGallery: UiGalleryComponent = () =>
  Platform.OS === 'android' ? (
    <RnFlatList
      bg="surface.base"
      content={{pb: 's32', pt: 's8', px: 's20'}}
      data={GALLERY_SECTIONS}
      flex={1}
      initialNumToRender={3}
      keyExtractor={section => section.id}
      ListHeaderComponent={GalleryHeader}
      maxToRenderPerBatch={2}
      renderItem={renderSection}
      testID="ui-gallery"
      windowSize={5}
    />
  ) : (
    <RnScrollView
      bg="surface.base"
      content={{pb: 's32', pt: 's8', px: 's20'}}
      contentInsetAdjustmentBehavior="automatic"
      flex={1}
      testID="ui-gallery"
    >
      <GalleryHeader />
      {GALLERY_SECTIONS.map(section => (
        <Fragment key={section.id}>
          <Section {...section} />
        </Fragment>
      ))}
    </RnScrollView>
  )
