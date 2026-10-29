import UIKit

/**
 Keeps a scroll view that rests at its top at the top when its top inset changes (KVO on `contentInset`). The inset
 grows once the top bar is measured, and a list left at the old top would start under the bar. A drag or a deceleration
 in progress is left alone. The observer stays on a recycled `UIScrollView`, where it only ever keeps a list at its top.
 */
@MainActor
enum ScrollEdgeTopPin {
  private static var observationKey: UInt8 = 0

  static func attach(to scrollView: UIScrollView) {
    guard objc_getAssociatedObject(scrollView, &observationKey) == nil else {
      return
    }

    let observation = scrollView.observe(\.contentInset, options: [.old, .new]) { scrollView, change in
      guard let oldInset = change.oldValue, let newInset = change.newValue, oldInset.top != newInset.top else {
        return
      }

      MainActor.assumeIsolated {
        keepAtTop(scrollView, oldTop: oldInset.top, newTop: newInset.top)
      }
    }

    objc_setAssociatedObject(scrollView, &observationKey, observation, .OBJC_ASSOCIATION_RETAIN_NONATOMIC)
  }

  private static func keepAtTop(_ scrollView: UIScrollView, oldTop: CGFloat, newTop: CGFloat) {
    let isAtOldTop = abs(scrollView.contentOffset.y + oldTop) < 1

    guard isAtOldTop, !scrollView.isTracking, !scrollView.isDecelerating else {
      return
    }

    scrollView.contentOffset = CGPoint(x: scrollView.contentOffset.x, y: -newTop)
  }
}
