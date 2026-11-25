import ExpoModulesCore
import UIKit

/**
 Holds the top bar's content inside `ScrollEdgeContainer` and sets the scroll view's top inset from its own height (plus
 `scrollInsetExtra`, the scroll view's own top inset) as soon as Fabric lays it out in a window. The JS side sends the
 same inset after `onLayout`, a few frames later; until then a list sat under its bar and jumped. That shows most on a
 screen rendered before it is shown (a tab that mounts with the app): a bar under a safe area view measures without the
 header there, and only gets it when the screen appears. The same height goes into the container's SwiftUI bar
 (`nativeTopBarHeight`), only while in a window.

 It is a view inside the bar wrapper rather than the wrapper itself, because SwiftUI's host container sets the wrapper's
 frame to the bar height JS last sent.

 With `followsNavigationBar` (JS `navigationBarInset`, the list under a native header with
 `contentInsetAdjustmentBehavior` `never`) the bar holds only what sits under the navigation bar, and the view adds the
 screen's top safe area to the inset and to `nativeTopBarHeight`, unrounded, in the call that changes it
 (`SafeAreaProviderObserver`), and again from the container's setup; JS keeps `initialTopBarHeight` and ignores the bar's
 layout, so React Native never writes the inset back. UIKit moves a bar that hides its stacked search incrementally
 (new height = old height − (offset + adjusted top inset)), so on the bar's top content scroll view any gap between the
 bar's bottom and the inset comes back as a bar move of that size. Through react-native-screens' `SafeAreaView`
 (changes up to 1 px ignored, Yoga's pixel rounding, a Fabric commit per frame) the inset was always a fraction off:
 the content jittered 1–2 px while the search hid, and inside one layout pass the two never settled and the main thread
 spun at 100 %. With the exact value one step ends at offset + inset = 0, as with UIKit's own safe-area inset.

 The bar reads offset + inset inside every `setContentInset`, so a resting list must never look scrolled for that call:
 when this side grows the inset of a list resting at its top, the offset moves first and UIKit sees only overscroll.
 The bar's own moves are only followed (`ScrollEdgeTopPin`). The first sync of each scroll child, and again a
 main-queue turn later unless the list is touched, puts the list at its top, which clears stale offsets: React Native's
 `prepareForRecycle` writes the old `contentOffset` prop back, and a JS estimate below the expanded header left the
 list scrolled. Callers therefore estimate the expanded header, never less.
 */
public final class ScrollEdgeTopBarView: ExpoView {
  private static let insetTolerance: CGFloat = 0.00001
  private static let restingTolerance: CGFloat = 1

  private let navigationBarObserver = SafeAreaProviderObserver()
  private weak var placedScrollView: UIScrollView?

  var scrollInsetExtra: Double? {
    didSet {
      guard scrollInsetExtra != oldValue else {
        return
      }
      syncScrollInset()
    }
  }

  var followsNavigationBar = false {
    didSet {
      guard followsNavigationBar != oldValue else {
        return
      }
      updateNavigationBarObservation()
      syncScrollInset()
    }
  }

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    navigationBarObserver.onChange = { [weak self] in
      self?.syncScrollInset(isNavigationBarMove: true)
    }
  }

  public override var bounds: CGRect {
    didSet {
      guard bounds.height != oldValue.height else {
        return
      }
      syncScrollInset()
    }
  }

  public override func didMoveToWindow() {
    super.didMoveToWindow()
    updateNavigationBarObservation()
    syncScrollInset()
  }

  func syncScrollInset() {
    syncScrollInset(isNavigationBarMove: false)
  }

  /** A new scroll child: its first sync places it at its top again. */
  func scrollChildDidChange() {
    placedScrollView = nil
    syncScrollInset()
  }

  private func syncScrollInset(isNavigationBarMove: Bool) {
    guard window != nil, let navigationInset, let host = scrollEdgeContainerHost(of: self) else {
      return
    }
    let height = bounds.height + navigationInset
    (host.getProps() as? ScrollEdgeContainerProps)?.setNativeTopBarHeight(Double(height))

    guard
      let scrollInsetExtra,
      let scrollView = (host.getProps().children?.first?.uiView as? ScrollEdgeScrollableView)?.scrollView
    else {
      return
    }

    applyTopInset(height + scrollInsetExtra, to: scrollView, isNavigationBarMove: isNavigationBarMove)
    placeAtTopOnFirstSync(scrollView)
  }

  private func applyTopInset(_ top: CGFloat, to scrollView: UIScrollView, isNavigationBarMove: Bool) {
    let oldTop = scrollView.contentInset.top
    let delta = top - oldTop

    guard abs(delta) > Self.insetTolerance else {
      return
    }

    ScrollEdgeTopPin.attach(to: scrollView)
    if followsNavigationBar, !isNavigationBarMove, delta > 0, Self.isResting(scrollView, atTop: oldTop) {
      scrollView.contentOffset = CGPoint(x: scrollView.contentOffset.x, y: -top)
    }
    scrollView.verticalScrollIndicatorInsets.top += delta
    scrollView.contentInset.top = top
  }

  private func placeAtTopOnFirstSync(_ scrollView: UIScrollView) {
    guard followsNavigationBar, scrollView !== placedScrollView else {
      return
    }
    placedScrollView = scrollView
    Self.placeAtTop(scrollView)
    DispatchQueue.main.async { [weak self, weak scrollView] in
      guard let self, let scrollView, scrollView === self.placedScrollView else {
        return
      }
      Self.placeAtTop(scrollView)
    }
  }

  private static func placeAtTop(_ scrollView: UIScrollView) {
    let top = -scrollView.contentInset.top
    guard !isTouched(scrollView), abs(scrollView.contentOffset.y - top) > insetTolerance else {
      return
    }
    scrollView.contentOffset = CGPoint(x: scrollView.contentOffset.x, y: top)
  }

  private static func isResting(_ scrollView: UIScrollView, atTop top: CGFloat) -> Bool {
    !isTouched(scrollView) && abs(scrollView.contentOffset.y + top) < restingTolerance
  }

  private static func isTouched(_ scrollView: UIScrollView) -> Bool {
    scrollView.isTracking || scrollView.isDragging || scrollView.isDecelerating
  }

  /** 0 when not following; `nil` while following but no screen view is found yet, so nothing is written. */
  private var navigationInset: CGFloat? {
    guard followsNavigationBar else {
      return 0
    }
    return navigationBarObserver.topInset
  }

  private func updateNavigationBarObservation() {
    guard followsNavigationBar, window != nil else {
      navigationBarObserver.detach()
      return
    }
    navigationBarObserver.attach(from: self)
  }
}
