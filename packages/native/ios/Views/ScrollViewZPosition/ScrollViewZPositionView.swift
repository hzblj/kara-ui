import ExpoModulesCore
import UIKit

/**
 A zero-size view placed inside a React Native scroll view that raises the whole scroll view: while it is in a window
 it sets `layer.zPosition` on the scroll view's outer view (`RCTScrollViewComponentView`), and puts it back to 0 when it
 leaves, so a recycled scroll view never keeps it.

 The scroll view then draws above its later siblings while keeping its place among the subviews, which is what UIKit's
 large title (`subviews[0]`) and hit testing go by; Fabric's `zIndex` reorders the subviews instead. iOS 27's scroll
 edge effect blurs only what lies under it, where iOS 26 also showed the background behind the list through it, so a
 large title living in an empty scroll view under the content is covered once the content scrolls under the bar,
 unless that scroll view is raised.
 */
public final class ScrollViewZPositionView: ExpoView {
  var layerZPosition: CGFloat = 0 {
    didSet {
      applyZPosition()
    }
  }

  private weak var raisedView: UIView?

  public override func didMoveToWindow() {
    super.didMoveToWindow()
    applyZPosition()
  }

  private func applyZPosition() {
    let target = window == nil ? nil : enclosingScrollView()?.superview

    if raisedView !== target {
      raisedView?.layer.zPosition = 0
      raisedView = target
    }

    target?.layer.zPosition = layerZPosition
  }

  private func enclosingScrollView() -> UIScrollView? {
    var view = superview

    while let current = view {
      if let scrollView = current as? UIScrollView {
        return scrollView
      }

      view = current.superview
    }

    return nil
  }
}
