import ExpoModulesCore
import ExpoZoomTransition
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

 With a `ZoomTransitionSourceView` (`@hzblj/expo-zoom-transition`) inside the trigger and a custom preview, a tap on
 the preview zooms the preview's photo straight into the pushed screen on iOS 18, the
 way the App Store expands one (see `previewPhotoOnScreen` and the commit below).
 */
public final class ContextMenuView: ExpoView, UIContextMenuInteractionDelegate {
  let onSelectItem = EventDispatcher()
  let onPreviewPress = EventDispatcher()

  var items: [ContextMenuActionRecord] = []

  /// `zoom`, `pop` or `dismiss`; `nil` zooms when the trigger holds a zoom source and pops otherwise.
  var previewTransition: String?

  private weak var previewContentView: UIImageView?
  private var previewPhotoRect: CGRect?
  private var previewPhotoCornerRadius: CGFloat = 0
  private var committedZoomIdentifier: String?
  private let touchCanceller = ContextMenuTouchCanceller()

  /// How long a tapped preview's photo waits for the push before the way back zooms into the card again.
  private static let transientSourceTimeout: TimeInterval = 3

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    let interaction = UIContextMenuInteraction(delegate: self)
    addInteraction(interaction)
    addGestureRecognizer(touchCanceller)
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
    // frame, so we move it off-screen for the capture — both captures take the view's own content
    // regardless of position — then restore. A trigger that can zoom renders an image instead of a
    // snapshot view, so the commit can crop the photo out of it.
    let canZoom = ZoomTransitionRegistry.shared.sourceIdentifier(within: self) != nil
    let wasHidden = previewView.isHidden
    let originalFrame = previewView.frame
    previewView.frame.origin = CGPoint(x: -originalFrame.width - 10000, y: originalFrame.origin.y)
    previewView.isHidden = false
    let content: UIView?
    if canZoom {
      let photoView = Self.firstImageView(in: previewView)
      previewPhotoRect = photoView
        .map { $0.convert($0.bounds, to: previewView) }
        .flatMap { $0.width > 0 && $0.height > 0 ? $0 : nil }
      previewPhotoCornerRadius = Self.cornerRadius(around: photoView, within: previewView)
      let imageView = UIImageView(image: Self.render(previewView))
      previewContentView = imageView
      content = imageView
    } else {
      previewPhotoRect = nil
      previewContentView = nil
      content = previewView.snapshotView(afterScreenUpdates: true)
    }
    previewView.isHidden = wasHidden
    previewView.frame = originalFrame

    guard let content else {
      return nil
    }

    let size = previewView.bounds.size
    let controller = UIViewController()
    controller.view.backgroundColor = .clear
    content.frame = CGRect(origin: .zero, size: size)
    controller.view.addSubview(content)
    controller.preferredContentSize = size
    return controller
  }

  private static func render(_ view: UIView) -> UIImage {
    let format = UIGraphicsImageRendererFormat(for: view.traitCollection)
    format.opaque = false
    return UIGraphicsImageRenderer(bounds: view.bounds, format: format).image { _ in
      view.drawHierarchy(in: view.bounds, afterScreenUpdates: true)
    }
  }

  /// The preview's photo: its first image view, badges drawn over it included.
  private static func firstImageView(in view: UIView) -> UIImageView? {
    for subview in view.subviews {
      if let imageView = subview as? UIImageView {
        return imageView
      }
      if let imageView = firstImageView(in: subview) {
        return imageView
      }
    }
    return nil
  }

  private static func cornerRadius(around view: UIView?, within container: UIView) -> CGFloat {
    var current = view
    while let candidate = current, candidate !== container {
      if candidate.layer.cornerRadius > 0 {
        return candidate.layer.cornerRadius
      }
      current = candidate.superview
    }
    return 0
  }

  private static func crop(_ image: UIImage, to rect: CGRect) -> UIImage {
    let format = UIGraphicsImageRendererFormat()
    format.scale = image.scale
    format.opaque = false
    return UIGraphicsImageRenderer(size: rect.size, format: format).image { _ in
      image.draw(at: CGPoint(x: -rect.minX, y: -rect.minY))
    }
  }

  /// Where the lifted preview shows its photo in the window. UIKit keeps the preview controller's view off screen and
  /// shows it through a `_UIPortalView` whose `sourceView` is that view, so the portal's frame is the preview's.
  private func previewPhotoOnScreen(in window: UIWindow) -> (frame: CGRect, cornerRadius: CGFloat)? {
    guard let previewContentView, let container = previewContentView.superview, let previewPhotoRect,
      container.bounds.width > 0, container.bounds.height > 0,
      let previewFrame = Self.previewFrame(showing: container, in: window)
    else {
      return nil
    }
    let scale = previewFrame.width / container.bounds.width
    guard scale > 0 else {
      return nil
    }
    let frame = CGRect(
      x: previewFrame.minX + previewPhotoRect.minX * scale,
      y: previewFrame.minY + previewPhotoRect.minY * scale,
      width: previewPhotoRect.width * scale,
      height: previewPhotoRect.height * scale
    )
    return (frame, previewPhotoCornerRadius * scale)
  }

  private static func previewFrame(showing source: UIView, in window: UIWindow) -> CGRect? {
    guard let portal = portalLayer(showing: source.layer, in: window.layer) else {
      return nil
    }
    return portal.convert(portal.bounds, to: window.layer)
  }

  private static func portalLayer(showing source: CALayer, in layer: CALayer) -> CALayer? {
    let sourceLayerKey = "sourceLayer"
    if layer !== source, !layer.isHidden, layer.bounds.width > 0,
      layer.responds(to: NSSelectorFromString(sourceLayerKey)),
      (layer.value(forKey: sourceLayerKey) as? CALayer) === source
    {
      return layer
    }
    for sublayer in layer.sublayers ?? [] {
      if let portal = portalLayer(showing: source, in: sublayer) {
        return portal
      }
    }
    return nil
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
          let image =
            action.image.flatMap { UIImage(named: $0)?.withRenderingMode(.alwaysTemplate) }
            ?? action.systemImage.flatMap { UIImage(systemName: $0) }
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
    // A committed zoom fades the menu away unseen under the frozen screen instead of flying it back.
    committedZoomIdentifier == nil ? makeWindowTargetedPreview() : nil
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
    let identifier = ZoomTransitionRegistry.shared.sourceIdentifier(within: self)
    let transition = previewTransition ?? (identifier == nil ? "pop" : "zoom")

    // A zoom that cannot happen falls back to `.dismiss`: `.pop` would fly the preview off and the card's photo
    // flash back in just before the push zooms out of it.
    if transition != "pop" {
      animator.preferredCommitStyle = .dismiss
    }

    guard transition == "zoom", #available(iOS 18.0, *), let identifier,
      let previewContentView, let image = previewContentView.image, let previewPhotoRect, let window,
      let onScreen = previewPhotoOnScreen(in: window),
      let cover = window.snapshotView(afterScreenUpdates: false)
    else {
      animator.addCompletion { [weak self] in
        self?.onPreviewPress()
      }
      return
    }

    // JavaScript takes a while to push (about 300 ms in a dev build) and the menu would vanish meanwhile, so the
    // screen freezes as it is under a copy of the preview's photo; the zoom grows from that copy.
    cover.frame = window.bounds
    cover.isUserInteractionEnabled = false

    let photo = UIImageView(image: Self.crop(image, to: previewPhotoRect))
    photo.frame = onScreen.frame
    photo.layer.cornerRadius = onScreen.cornerRadius
    photo.layer.cornerCurve = .continuous
    photo.clipsToBounds = true
    photo.isUserInteractionEnabled = false

    window.addSubview(photo)
    window.addSubview(cover)

    let transient = ZoomTransitionTransientSource(view: photo, cover: cover)
    committedZoomIdentifier = identifier
    ZoomTransitionRegistry.shared.setTransientSource(transient, identifier: identifier)
    DispatchQueue.main.asyncAfter(deadline: .now() + Self.transientSourceTimeout) {
      ZoomTransitionRegistry.shared.finishTransientSource(transient, identifier: identifier)
    }
    onPreviewPress()
  }

  public func contextMenuInteraction(
    _ interaction: UIContextMenuInteraction,
    willDisplayMenuFor configuration: UIContextMenuConfiguration,
    animator: (any UIContextMenuInteractionAnimating)?
  ) {
    touchCanceller.cancelTouches()
  }

  public func contextMenuInteraction(
    _ interaction: UIContextMenuInteraction,
    willEndFor configuration: UIContextMenuConfiguration,
    animator: (any UIContextMenuInteractionAnimating)?
  ) {
    guard committedZoomIdentifier != nil else {
      return
    }

    let finish: () -> Void = { [weak self] in
      self?.committedZoomIdentifier = nil
    }

    guard let animator else {
      finish()
      return
    }
    animator.addCompletion(finish)
  }
}
