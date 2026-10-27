import ExpoModulesCore
import ExpoZoomTransition
import UIKit

/**
 A `UIContextMenuInteraction` on React Native children: a plain `ExpoView`, so the children keep their Yoga layout,
 with a React Native preview and a commit callback for a tap on it, which SwiftUI's `.contextMenu` cannot deliver.
 Without a `ContextMenuPreviewView` child the system lifts a snapshot of the trigger.

 With a `ZoomTransitionSourceView` in the trigger, a tapped preview zooms into the pushed screen on iOS 18. With
 `preloadedScreenId` it morphs as a whole into that screen, pushed natively at once.
 */
public final class ContextMenuView: ExpoView {
  let onSelectItem = EventDispatcher()
  let onPreviewPress = EventDispatcher()
  let onMenuOpen = EventDispatcher()
  let onMenuClose = EventDispatcher()

  var items: [ContextMenuActionRecord] = []
  var previewTransition: String?
  var preloadedScreenId: String?

  var preview: ContextMenuPreview?
  var committedZoomIdentifier: String?
  var isPreviewCommitted = false
  let touchCanceller = ContextMenuTouchCanceller()

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    addInteraction(UIContextMenuInteraction(delegate: self))
    addGestureRecognizer(touchCanceller)
  }

  var zoomSourceIdentifier: String? {
    ZoomTransitionRegistry.shared.sourceIdentifier(within: self)
  }

  func renderPreview() -> UIViewController? {
    preview = nil
    guard let previewView = subviews.lazy.compactMap({ $0 as? ContextMenuPreviewView }).first,
      let rendered = ContextMenuPreview.render(previewView, isZoomable: zoomSourceIdentifier != nil)
    else {
      return nil
    }
    preview = rendered.preview
    return rendered.controller
  }

  func makeMenu() -> UIMenu {
    let actions = items.map { item in
      let image =
        item.image.flatMap { UIImage(named: $0)?.withRenderingMode(.alwaysTemplate) }
        ?? item.systemImage.flatMap { UIImage(systemName: $0) }
      var attributes: UIMenuElement.Attributes = []
      if item.destructive {
        attributes.insert(.destructive)
      }
      if item.disabled {
        attributes.insert(.disabled)
      }
      return UIAction(
        title: item.title,
        image: image,
        attributes: attributes
      ) { [weak self] _ in
        self?.onSelectItem(["id": item.id])
      }
    }
    return UIMenu(title: "", children: actions)
  }

  func makeWindowTargetedPreview() -> UITargetedPreview? {
    guard let window, bounds.width > 0, bounds.height > 0 else {
      return nil
    }

    let parameters = UIPreviewParameters()
    parameters.backgroundColor = .clear
    let center = convert(CGPoint(x: bounds.midX, y: bounds.midY), to: window)
    return UITargetedPreview(view: self, parameters: parameters, target: UIPreviewTarget(container: window, center: center))
  }

  func isExcluded(at location: CGPoint) -> Bool {
    var view = hitTest(location, with: nil)
    while let current = view, current !== self {
      if current is ContextMenuExclusionView {
        return true
      }
      view = current.superview
    }
    return false
  }
}
