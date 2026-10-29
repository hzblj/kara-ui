import {createModifier} from '@expo/ui/swift-ui/modifiers'

/**
 * Makes the scroll view of the modified view (a `List`) its screen's content scroll view, so the native-stack large
 * title collapses as it scrolls. Without it the title stays large: UIKit does not find a scroll view inside a SwiftUI
 * host.
 */
export const contentScrollView = () => createModifier('contentScrollView', {})
