import ExpoModulesCore
import SwiftUI
import UIKit
import UIKit.UIGestureRecognizerSubclass

/**
 A controlled rich tooltip anchored to its React Native children. It never hides itself: `onDismissRequest(reason)`
 reports a touch outside (`outside`) or the anchor's centre leaving the visible area (`anchorHidden` — the window minus
 the boundary insets, clipped by every clipping ancestor such as a scroll view), and JS flips `isPresented`.
 `onShown` fires once the appear animation ends.

 The bubble is SwiftUI inside a pass-through overlay on the anchor's window, so it sits above every sibling and stays
 tappable outside the anchor's bounds; a display link keeps it under the anchor while the content scrolls. SwiftUI's
 `popover` was not usable: a modal popover blocks scrolling and swallows the tap meant for the control underneath.
 */
public final class TooltipView: ExpoView {
  let onShown = EventDispatcher()
  let onAction = EventDispatcher()
  let onDismissRequest = EventDispatcher()

  let model = TooltipBubbleModel()

  private var isPresented = false
  private var isAppeared = false
  private var hasRequestedDismiss = false
  private var needsMeasure = true
  private var boundaryInsets = UIEdgeInsets.zero
  private var lastAnchorRect = CGRect.null

  private var overlay: TooltipOverlayView?
  private var hostingController: UIHostingController<TooltipBubble>?
  private var displayLink: CADisplayLink?
  private var outsideTapObserver: TooltipOutsideTapObserver?

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    model.onAction = { [weak self] index in
      self?.onAction(["index": index])
    }
  }

  deinit {
    displayLink?.invalidate()
    if let outsideTapObserver {
      outsideTapObserver.view?.removeGestureRecognizer(outsideTapObserver)
    }
    overlay?.removeFromSuperview()
  }

  func setPresented(_ presented: Bool) {
    guard presented != isPresented else {
      return
    }
    isPresented = presented
    presented ? present() : hide(animated: true)
  }

  func setContentNeedsMeasure() {
    needsMeasure = true
  }

  func setBubbleWidth(_ width: Double) {
    model.width = CGFloat(width)
    needsMeasure = true
  }

  func setBoundaryInsets(top: Double?, bottom: Double?) {
    if let top {
      boundaryInsets.top = CGFloat(top)
    }
    if let bottom {
      boundaryInsets.bottom = CGFloat(bottom)
    }
  }

  public override func didMoveToWindow() {
    super.didMoveToWindow()
    if window == nil {
      hide(animated: false)
    } else if isPresented, overlay == nil {
      present()
    }
  }

  private func present() {
    guard let window, overlay == nil else {
      return
    }

    hasRequestedDismiss = false
    isAppeared = false
    needsMeasure = true
    lastAnchorRect = .null

    let overlay = TooltipOverlayView(frame: window.bounds)
    overlay.autoresizingMask = [.flexibleWidth, .flexibleHeight]

    let hostingController = UIHostingController(rootView: TooltipBubble(model: model))
    hostingController.view.backgroundColor = .clear
    hostingController.safeAreaRegions = []
    hostingController.view.alpha = 0
    overlay.bubbleView = hostingController.view
    overlay.addSubview(hostingController.view)
    window.addSubview(overlay)

    let observer = TooltipOutsideTapObserver { [weak self] in
      self?.requestDismiss(.outside)
    }
    observer.bubbleView = hostingController.view
    window.addGestureRecognizer(observer)

    let displayLink = CADisplayLink(target: TooltipDisplayLinkTarget(owner: self), selector: #selector(TooltipDisplayLinkTarget.tick))
    displayLink.add(to: .main, forMode: .common)

    self.overlay = overlay
    self.hostingController = hostingController
    self.outsideTapObserver = observer
    self.displayLink = displayLink
  }

  private func hide(animated: Bool) {
    displayLink?.invalidate()
    displayLink = nil

    if let outsideTapObserver {
      outsideTapObserver.view?.removeGestureRecognizer(outsideTapObserver)
    }
    outsideTapObserver = nil

    guard let overlay else {
      return
    }
    self.overlay = nil
    hostingController = nil
    isAppeared = false

    guard animated, overlay.window != nil else {
      overlay.removeFromSuperview()
      return
    }

    overlay.isUserInteractionEnabled = false
    UIView.animate(
      withDuration: 0.15,
      delay: 0,
      options: [.beginFromCurrentState, .curveEaseIn],
      animations: {
        overlay.bubbleView?.alpha = 0
      },
      completion: { _ in
        overlay.removeFromSuperview()
      }
    )
  }

  private func requestDismiss(_ reason: TooltipDismissReason) {
    guard isPresented, !hasRequestedDismiss else {
      return
    }
    hasRequestedDismiss = true
    onDismissRequest(["reason": reason.rawValue])
  }

  fileprivate func tick() {
    guard let window, let bubble = hostingController?.view, let hostingController else {
      return
    }

    let anchorRect = convert(bounds, to: window)
    guard anchorRect.width > 0, anchorRect.height > 0 else {
      return
    }

    if !isAnchorVisible(anchorRect, in: window) {
      requestDismiss(.anchorHidden)
      if !isAppeared {
        return
      }
    }

    guard needsMeasure || anchorRect != lastAnchorRect else {
      return
    }

    let maxWidth = max(window.bounds.width - TooltipMetrics.padding * 2, 0)
    if model.width > maxWidth {
      model.width = maxWidth
    }

    var size = bubble.bounds.size
    if needsMeasure {
      size = hostingController.sizeThatFits(in: CGSize(width: model.width, height: .greatestFiniteMagnitude))
      needsMeasure = false
    }

    let minX = window.bounds.minX + TooltipMetrics.padding
    let maxX = window.bounds.maxX - TooltipMetrics.padding - size.width
    let originX = min(max(anchorRect.maxX - size.width, minX), max(maxX, minX))
    let originY = anchorRect.maxY + 4

    let arrowInset = TooltipMetrics.cornerRadius + TooltipMetrics.arrowWidth / 2
    let arrowCenterX = min(max(anchorRect.midX - originX, arrowInset), size.width - arrowInset)
    if abs(model.arrowCenterX - arrowCenterX) > 0.5 {
      model.arrowCenterX = arrowCenterX
    }

    bubble.bounds = CGRect(origin: .zero, size: size)
    bubble.center = CGPoint(x: originX + size.width / 2, y: originY + size.height / 2)
    lastAnchorRect = anchorRect

    if !isAppeared {
      appear(bubble, arrowTip: CGPoint(x: arrowCenterX - size.width / 2, y: -size.height / 2))
    }
  }

  private func appear(_ bubble: UIView, arrowTip: CGPoint) {
    isAppeared = true
    bubble.transform = CGAffineTransform(translationX: arrowTip.x, y: arrowTip.y)
      .scaledBy(x: 0.9, y: 0.9)
      .translatedBy(x: -arrowTip.x, y: -arrowTip.y)

    UIView.animate(
      withDuration: 0.3,
      delay: 0,
      usingSpringWithDamping: 0.85,
      initialSpringVelocity: 0,
      options: [.beginFromCurrentState, .allowUserInteraction],
      animations: {
        bubble.alpha = 1
        bubble.transform = .identity
      },
      completion: { [weak self] _ in
        guard let self, self.isPresented, self.hostingController?.view === bubble else {
          return
        }
        self.onShown()
        UIAccessibility.post(notification: .layoutChanged, argument: bubble)
      }
    )
  }

  private func isAnchorVisible(_ anchorRect: CGRect, in window: UIWindow) -> Bool {
    var visibleRect = window.bounds.inset(by: boundaryInsets)
    var ancestor = superview
    while let view = ancestor, view !== window {
      if view.clipsToBounds {
        visibleRect = visibleRect.intersection(view.convert(view.bounds, to: window))
      }
      ancestor = view.superview
    }
    return visibleRect.contains(CGPoint(x: anchorRect.midX, y: anchorRect.midY))
  }
}

private final class TooltipDisplayLinkTarget {
  weak var owner: TooltipView?

  init(owner: TooltipView) {
    self.owner = owner
  }

  @objc func tick() {
    owner?.tick()
  }
}

private final class TooltipOverlayView: UIView {
  weak var bubbleView: UIView?

  override func hitTest(_ point: CGPoint, with event: UIEvent?) -> UIView? {
    let hit = super.hitTest(point, with: event)
    return hit === self ? nil : hit
  }
}

/**
 Watches for taps outside the bubble without ever recognising. React Native's `RCTSurfaceTouchHandler` requires every
 recognizer outside its root view to fail first, so a real `UITapGestureRecognizer` on the window would cancel the
 tap on the anchor — and an anchor that both closes the tooltip and does its own thing needs that tap.
 */
private final class TooltipOutsideTapObserver: UIGestureRecognizer, UIGestureRecognizerDelegate {
  weak var bubbleView: UIView?

  private let onTap: () -> Void
  private var startPoint: CGPoint?

  private static let maxMovement: CGFloat = 10

  init(onTap: @escaping () -> Void) {
    self.onTap = onTap
    super.init(target: nil, action: nil)
    cancelsTouchesInView = false
    delaysTouchesBegan = false
    delaysTouchesEnded = false
    delegate = self
  }

  override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent) {
    guard touches.count == 1, startPoint == nil, let touch = touches.first, !isInsideBubble(touch) else {
      state = .failed
      return
    }
    startPoint = touch.location(in: view)
  }

  override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent) {
    guard let startPoint, let point = touches.first?.location(in: view) else {
      return
    }
    if hypot(point.x - startPoint.x, point.y - startPoint.y) > Self.maxMovement {
      state = .failed
    }
  }

  override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent) {
    if startPoint != nil {
      onTap()
    }
    state = .failed
  }

  override func touchesCancelled(_ touches: Set<UITouch>, with event: UIEvent) {
    state = .failed
  }

  override func reset() {
    super.reset()
    startPoint = nil
  }

  func gestureRecognizer(
    _ gestureRecognizer: UIGestureRecognizer,
    shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer
  ) -> Bool {
    true
  }

  private func isInsideBubble(_ touch: UITouch) -> Bool {
    guard let bubbleView else {
      return false
    }
    return bubbleView.bounds.contains(touch.location(in: bubbleView))
  }
}
