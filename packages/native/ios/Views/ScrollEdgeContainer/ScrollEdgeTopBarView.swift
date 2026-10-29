import ExpoModulesCore
import UIKit

/**
 Holds the top bar's content inside `ScrollEdgeContainer` and sets the scroll view's top inset from its own height (plus
 `scrollInsetExtra`, the scroll view's own top inset) as soon as Fabric lays it out in a window. The JS side sends the
 same inset after `onLayout`, a few frames later; until then a list sat under its bar and jumped. That shows most on a
 screen rendered before it is shown (a tab that mounts with the app): a bar under a safe area view measures without the
 header there, and only gets it when the screen appears.

 It is a view inside the bar wrapper rather than the wrapper itself, because SwiftUI's host container sets the wrapper's
 frame to the bar height JS last sent.
 */
public final class ScrollEdgeTopBarView: ExpoView {
  var scrollInsetExtra: Double?

  public override var bounds: CGRect {
    didSet {
      guard bounds.height != oldValue.height else {
        return
      }
      syncScrollInset()
    }
  }

  private func syncScrollInset() {
    guard let scrollInsetExtra, window != nil, let scrollView = containerScrollView() else {
      return
    }

    let top = bounds.height + scrollInsetExtra
    let delta = top - scrollView.contentInset.top

    guard abs(delta) > 0.00001 else {
      return
    }

    ScrollEdgeTopPin.attach(to: scrollView)
    scrollView.verticalScrollIndicatorInsets.top += delta
    scrollView.contentInset.top = top
  }

  private func containerScrollView() -> UIScrollView? {
    var current = superview
    while let view = current {
      if let host = view as? ExpoSwiftUI.HostingView<ScrollEdgeContainerProps, ScrollEdgeContainerView> {
        return firstScrollView(in: host.getProps().children?.first?.uiView)
      }
      current = view.superview
    }
    return nil
  }
}
