import ExpoModulesCore
import UIKit

/**
 A layout-less view (`display: contents`, `disableForceFlatten`) inside a screen presented as a sheet that shows or
 hides the sheet's system grabber: it finds the presented controller (the first `UIViewController` up the responder
 chain, then up its parents to the one with none) and sets its `sheetPresentationController.prefersGrabberVisible`.
 react-native-screens sets the grabber only for `formSheet`; a `modal` (a page sheet) gets one through this, from any
 screen of a stack nested in it. The presentation may not be set up at mount, so it retries for about 5 s.
 */
public final class SheetGrabberView: ExpoView {
  private static let attachAttempts = 10

  var isGrabberVisible = true {
    didSet {
      apply()
    }
  }

  public override func didMoveToWindow() {
    super.didMoveToWindow()
    apply()
  }

  private func apply(attempt: Int = 0) {
    guard window != nil else {
      return
    }
    guard let sheet = presentedController()?.sheetPresentationController else {
      guard attempt < Self.attachAttempts else {
        return
      }
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.1 * Double(attempt + 1)) { [weak self] in
        self?.apply(attempt: attempt + 1)
      }
      return
    }
    guard sheet.prefersGrabberVisible != isGrabberVisible else {
      return
    }
    // While the sheet is being presented the grabber is part of the presentation: animating it on its own laid the
    // presentation out inside that animation, and the dimming view grew from the top-left corner over the screen.
    let controller = sheet.presentedViewController
    guard !controller.isBeingPresented, controller.transitionCoordinator == nil else {
      sheet.prefersGrabberVisible = isGrabberVisible
      return
    }
    sheet.animateChanges {
      sheet.prefersGrabberVisible = isGrabberVisible
    }
  }

  private func presentedController() -> UIViewController? {
    var responder: UIResponder? = self
    while let current = responder, !(current is UIViewController) {
      responder = current.next
    }
    var controller = responder as? UIViewController
    while let current = controller, current.presentingViewController == nil || current.parent != nil {
      controller = current.parent
    }
    return controller
  }
}
