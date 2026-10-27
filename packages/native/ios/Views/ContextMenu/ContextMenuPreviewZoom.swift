import ExpoZoomTransition
import UIKit

enum ContextMenuPreviewZoom {
  enum Handoff {
    case covered
    case morph(style: ContextMenuPlatterStyle, onHandOver: (UIView) -> Void)
  }

  private static let transientSourceTimeout: TimeInterval = 3

  static func start(from preview: ContextMenuPreview, in trigger: UIView, handoff: Handoff) -> String? {
    guard #available(iOS 18.0, *), let window = trigger.window,
      let identifier = ZoomTransitionRegistry.shared.sourceIdentifier(within: trigger),
      let transient = makeTransientSource(from: preview, in: window, handoff: handoff)
    else {
      return nil
    }
    ZoomTransitionRegistry.shared.setTransientSource(transient, identifier: identifier)
    DispatchQueue.main.asyncAfter(deadline: .now() + transientSourceTimeout) {
      ZoomTransitionRegistry.shared.finishTransientSource(transient, identifier: identifier)
    }
    return identifier
  }

  private static func makeTransientSource(
    from preview: ContextMenuPreview,
    in window: UIWindow,
    handoff: Handoff
  ) -> ZoomTransitionTransientSource? {
    switch handoff {
    case .covered:
      guard let photo = preview.makePhotoCopy(in: window) else {
        return nil
      }
      window.addSubview(photo)
      return ZoomTransitionTransientSource(view: photo, cover: makeCover(of: window))

    case let .morph(style, onHandOver):
      guard let card = preview.makeCardCopy(in: window, style: style) else {
        return nil
      }
      window.addSubview(card.view)
      return ZoomTransitionTransientSource(
        view: card.view,
        focusRect: card.photoRect,
        cover: nil,
        onHandOver: onHandOver
      )
    }
  }

  private static func makeCover(of window: UIWindow) -> UIView? {
    guard let cover = window.snapshotView(afterScreenUpdates: false) else {
      return nil
    }
    cover.frame = window.bounds
    cover.isUserInteractionEnabled = false
    window.addSubview(cover)
    return cover
  }
}
