import UIKit
import UIKit.UIGestureRecognizerSubclass

final class ContextMenuTouchCanceller: UIGestureRecognizer, UIGestureRecognizerDelegate {
  private static let reactTouchHandlerClass: AnyClass? = NSClassFromString("RCTSurfaceTouchHandler")

  private var touches = Set<UITouch>()
  private var event: UIEvent?

  init() {
    super.init(target: nil, action: nil)
    cancelsTouchesInView = true
    delaysTouchesBegan = false
    delaysTouchesEnded = false
    delegate = self
  }

  func cancelTouches() {
    guard state == .possible, let container = view, let event, !touches.isEmpty else {
      return
    }

    var reactTouchHandlers = Set<UIGestureRecognizer>()
    for touch in touches {
      for recognizer in touch.gestureRecognizers ?? [] where recognizer !== self {
        if Self.isReactTouchHandler(recognizer) {
          recognizer.ignore(touch, for: event)
          reactTouchHandlers.insert(recognizer)
        } else if Self.isContentRecognizer(recognizer, of: container) {
          Self.restart(recognizer)
        }
      }
    }
    reactTouchHandlers.filter { !isTracking($0) }.forEach(Self.restart)
    state = .began
  }

  override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent) {
    self.touches.formUnion(touches)
    self.event = event
  }

  override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent) {
    finish(touches, as: .ended)
  }

  override func touchesCancelled(_ touches: Set<UITouch>, with event: UIEvent) {
    finish(touches, as: .cancelled)
  }

  override func reset() {
    super.reset()
    touches.removeAll()
    event = nil
  }

  override func canPrevent(_ preventedGestureRecognizer: UIGestureRecognizer) -> Bool {
    false
  }

  override func canBePrevented(by preventingGestureRecognizer: UIGestureRecognizer) -> Bool {
    false
  }

  func gestureRecognizer(
    _ gestureRecognizer: UIGestureRecognizer,
    shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer
  ) -> Bool {
    true
  }

  private func finish(_ touches: Set<UITouch>, as finalState: UIGestureRecognizer.State) {
    self.touches.subtract(touches)
    guard self.touches.isEmpty else {
      return
    }
    state = state == .possible ? .failed : finalState
  }

  private func isTracking(_ recognizer: UIGestureRecognizer) -> Bool {
    touches.contains { $0.gestureRecognizers?.contains(recognizer) ?? false }
  }

  private static func restart(_ recognizer: UIGestureRecognizer) {
    recognizer.isEnabled = false
    recognizer.isEnabled = true
  }

  private static func isReactTouchHandler(_ recognizer: UIGestureRecognizer) -> Bool {
    reactTouchHandlerClass.map { recognizer.isKind(of: $0) } ?? false
  }

  private static func isContentRecognizer(_ recognizer: UIGestureRecognizer, of container: UIView) -> Bool {
    guard let view = recognizer.view else {
      return false
    }
    return view !== container && view.isDescendant(of: container)
  }
}
