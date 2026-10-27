import UIKit
import UIKit.UIGestureRecognizerSubclass

/**
 Follows the touches on a context menu's content without taking part in them.

 Once the menu shows, the finger still belongs to the content: RN's `Pressable` (the surface touch
 handler), gesture-handler buttons (a `UIControl`) and gestures fire their press when it lifts, so the
 menu and a navigation would run together. `cancelTouches()` stops all of them: React Native's touch
 handler first ignores the touch and is then reset, which sends JS the cancel, the content's own
 recognizers are reset, and the canceller recognizes itself, which makes UIKit send `touchesCancelled`
 to the views. Resetting React Native's handler while UIKit still gives it the touch made iOS 27 deliver
 the touch's `touchesCancelled` after the reset, which its touch registry assertion turns into a crash in
 a debug build, so the reset waits until the touch has left the handler; if it has not, the handler
 cancels from its own `reset` when the touch ends. The menu's own recognizers live on the menu view and
 are left alone.
 */
final class ContextMenuTouchCanceller: UIGestureRecognizer, UIGestureRecognizerDelegate {
  private static let reactTouchHandlerClass: AnyClass? = NSClassFromString("RCTSurfaceTouchHandler")

  private var activeTouches = Set<UITouch>()
  private var touchEvent: UIEvent?

  init() {
    super.init(target: nil, action: nil)
    cancelsTouchesInView = true
    delaysTouchesBegan = false
    delaysTouchesEnded = false
    delegate = self
  }

  func cancelTouches() {
    guard state == .possible, !activeTouches.isEmpty, let container = view, let touchEvent else {
      return
    }

    var reactTouchHandlers = Set<UIGestureRecognizer>()
    for touch in activeTouches {
      for recognizer in touch.gestureRecognizers ?? [] where recognizer !== self {
        if isReactTouchHandler(recognizer) {
          recognizer.ignore(touch, for: touchEvent)
          reactTouchHandlers.insert(recognizer)
        } else if isContentRecognizer(recognizer, within: container) {
          recognizer.isEnabled = false
          recognizer.isEnabled = true
        }
      }
    }
    for handler in reactTouchHandlers where !tracksActiveTouch(handler) {
      handler.isEnabled = false
      handler.isEnabled = true
    }
    state = .began
  }

  private func tracksActiveTouch(_ recognizer: UIGestureRecognizer) -> Bool {
    activeTouches.contains { $0.gestureRecognizers?.contains(recognizer) ?? false }
  }

  private func isReactTouchHandler(_ recognizer: UIGestureRecognizer) -> Bool {
    guard let reactTouchHandlerClass = Self.reactTouchHandlerClass else {
      return false
    }
    return recognizer.isKind(of: reactTouchHandlerClass)
  }

  private func isContentRecognizer(_ recognizer: UIGestureRecognizer, within container: UIView) -> Bool {
    guard let recognizerView = recognizer.view else {
      return false
    }
    return recognizerView !== container && recognizerView.isDescendant(of: container)
  }

  override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent) {
    activeTouches.formUnion(touches)
    touchEvent = event
  }

  override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent) {
    finish(touches, as: .ended)
  }

  override func touchesCancelled(_ touches: Set<UITouch>, with event: UIEvent) {
    finish(touches, as: .cancelled)
  }

  private func finish(_ touches: Set<UITouch>, as finalState: UIGestureRecognizer.State) {
    activeTouches.subtract(touches)
    guard activeTouches.isEmpty else {
      return
    }
    state = state == .possible ? .failed : finalState
  }

  override func reset() {
    super.reset()
    activeTouches.removeAll()
    touchEvent = nil
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
}
