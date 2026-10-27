import UIKit

struct ContextMenuPreloadedScreen {
  private static let stackClassName = "RNSScreenStackView"
  private static let screenIdsKey = "screenIds"
  private static let screenIdKey = "screenId"
  private static let activityStateKey = "activityState"
  private static let reactSubviewsSelector = NSSelectorFromString("reactSubviews")
  private static let markChildUpdatedSelector = NSSelectorFromString("markChildUpdated")
  private static let onTopActivityState = 2

  private let stack: UIView
  private let screen: UIView

  init?(screenId: String, from view: UIView) {
    guard let stack = Self.stack(containing: screenId, from: view),
      stack.responds(to: Self.markChildUpdatedSelector),
      let screen = Self.screen(screenId, in: stack),
      screen.responds(to: NSSelectorFromString(Self.activityStateKey))
    else {
      return nil
    }
    self.stack = stack
    self.screen = screen
  }

  func push() {
    screen.setValue(Self.onTopActivityState, forKey: Self.activityStateKey)
    stack.perform(Self.markChildUpdatedSelector)
  }

  private static func stack(containing screenId: String, from view: UIView) -> UIView? {
    guard let stackClass = NSClassFromString(stackClassName) else {
      return nil
    }
    var current = view.superview
    while let candidate = current {
      if candidate.isKind(of: stackClass), candidate.responds(to: NSSelectorFromString(screenIdsKey)),
        let ids = candidate.value(forKey: screenIdsKey) as? [String], ids.contains(screenId)
      {
        return candidate
      }
      current = candidate.superview
    }
    return nil
  }

  private static func screen(_ screenId: String, in stack: UIView) -> UIView? {
    guard stack.responds(to: reactSubviewsSelector),
      let screens = stack.perform(reactSubviewsSelector)?.takeUnretainedValue() as? [UIView]
    else {
      return nil
    }
    return screens.first {
      $0.responds(to: NSSelectorFromString(screenIdKey)) && ($0.value(forKey: screenIdKey) as? String) == screenId
    }
  }
}
