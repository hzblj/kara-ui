import ExpoModulesCore
import UIKit

/**
 A UIKit-backed context menu. Because it is a plain `ExpoView` (UIView), the React
 Native children take part in the normal Yoga layout — unlike a SwiftUI `Host`,
 which collapses complex React Native content.

 `UIContextMenuInteraction` provides `willPerformPreviewActionForMenuWith`, the
 commit callback fired when the user taps the preview — the behaviour SwiftUI's
 `.contextMenu` cannot deliver.

 The preview is a snapshot of the `ContextMenuPreviewView` child, when there is one.
 A real preview also makes the system attach the menu to it and animate smoothly.
 Without one it falls back to the system default, a snapshot of this view.

 The highlight and dismissal previews target the window rather than this view's
 superview: with the default target the lifted view stays in its own superview, so
 inside a horizontally scrolling row the clipping scroll view cut it off while it
 scaled up.
 */
public final class ContextMenuView: ExpoView, UIContextMenuInteractionDelegate {
  let onSelectItem = EventDispatcher()
  let onPreviewPress = EventDispatcher()

  var items: [ContextMenuActionRecord] = []

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    let interaction = UIContextMenuInteraction(delegate: self)
    addInteraction(interaction)
  }

  private var previewView: ContextMenuPreviewView? {
    subviews.compactMap { $0 as? ContextMenuPreviewView }.first
  }

  private func makePreviewController() -> UIViewController? {
    guard let previewView, previewView.bounds.width > 0, previewView.bounds.height > 0 else {
      return nil
    }

    // `afterScreenUpdates: true` commits a real screen update so the just-unhidden preview renders
    // before we capture it. Doing that in place flashes the (larger) preview over the card for one
    // frame, so we move it off-screen for the capture — `snapshotView` grabs the view's own content
    // regardless of position — then restore.
    let wasHidden = previewView.isHidden
    let originalFrame = previewView.frame
    previewView.frame.origin = CGPoint(x: -originalFrame.width - 10000, y: originalFrame.origin.y)
    previewView.isHidden = false
    let snapshot = previewView.snapshotView(afterScreenUpdates: true)
    previewView.isHidden = wasHidden
    previewView.frame = originalFrame

    guard let snapshot else {
      return nil
    }

    let size = previewView.bounds.size
    let controller = UIViewController()
    controller.view.backgroundColor = .clear
    snapshot.frame = CGRect(origin: .zero, size: size)
    controller.view.addSubview(snapshot)
    controller.preferredContentSize = size
    return controller
  }

  public func contextMenuInteraction(
    _ interaction: UIContextMenuInteraction,
    configurationForMenuAtLocation location: CGPoint
  ) -> UIContextMenuConfiguration? {
    guard !items.isEmpty, !isExcluded(at: location) else {
      return nil
    }

    return UIContextMenuConfiguration(
      identifier: nil,
      previewProvider: { [weak self] in
        self?.makePreviewController()
      },
      actionProvider: { [weak self] _ in
        guard let self else {
          return nil
        }
        let children = self.items.map { action -> UIAction in
          let image = action.systemImage.flatMap { UIImage(systemName: $0) }
          return UIAction(
            title: action.title,
            image: image,
            attributes: action.destructive ? .destructive : []
          ) { _ in
            self.onSelectItem(["id": action.id])
          }
        }
        return UIMenu(title: "", children: children)
      }
    )
  }

  public func contextMenuInteraction(
    _ interaction: UIContextMenuInteraction,
    configuration: UIContextMenuConfiguration,
    highlightPreviewForItemWithIdentifier identifier: any NSCopying
  ) -> UITargetedPreview? {
    makeWindowTargetedPreview()
  }

  public func contextMenuInteraction(
    _ interaction: UIContextMenuInteraction,
    configuration: UIContextMenuConfiguration,
    dismissalPreviewForItemWithIdentifier identifier: any NSCopying
  ) -> UITargetedPreview? {
    makeWindowTargetedPreview()
  }

  private func makeWindowTargetedPreview() -> UITargetedPreview? {
    guard let window, bounds.width > 0, bounds.height > 0 else {
      return nil
    }

    let parameters = UIPreviewParameters()
    parameters.backgroundColor = .clear
    let center = convert(CGPoint(x: bounds.midX, y: bounds.midY), to: window)
    return UITargetedPreview(view: self, parameters: parameters, target: UIPreviewTarget(container: window, center: center))
  }

  private func isExcluded(at location: CGPoint) -> Bool {
    var view = hitTest(location, with: nil)
    while let current = view, current !== self {
      if current is ContextMenuExclusionView {
        return true
      }
      view = current.superview
    }
    return false
  }

  public func contextMenuInteraction(
    _ interaction: UIContextMenuInteraction,
    willPerformPreviewActionForMenuWith configuration: UIContextMenuConfiguration,
    animator: UIContextMenuInteractionCommitAnimating
  ) {
    animator.addCompletion { [weak self] in
      self?.onPreviewPress()
    }
  }
}
