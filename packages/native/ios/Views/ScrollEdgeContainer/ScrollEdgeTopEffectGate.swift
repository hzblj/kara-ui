import UIKit

/**
 Hides the top edge effect of a list that follows the navigation bar while nothing is under the bar
 (`contentOffset.y + contentInset.top` ≤ 0.5 pt) and shows it once content is; `isTopEdgeEffectHidden` still wins.
 After content had been under the bar, UIKit kept the `hard` effect's separator at the resting top, a 1 px line under
 whatever sits below the bar, which neither toggling `isHidden` nor a layout or inset change cleared.

 KVO on the offset and the inset, with a write only when that state flips. Inside an inset change (`.prior` to after)
 the gate only hides: UIKit's own offset adjustment and `ScrollEdgeTopPin` move the offset in between, and the
 transient value flipped the effect twice on every bar move. Detaching puts the caller's value back, since a recycled
 `UIScrollView` keeps it. A list that does not follow the bar gets the caller's value and no gate.
 */
@MainActor
final class ScrollEdgeTopEffectGate {
  private static var gateKey: UInt8 = 0
  private static let clearTolerance: CGFloat = 0.5

  private weak var scrollView: UIScrollView?
  private weak var owner: UIView?
  private var observations: [NSKeyValueObservation] = []
  private var isCallerHidden = false
  private var isBarClear = false
  private var pendingInsetChanges = 0

  private init(scrollView: UIScrollView) {
    self.scrollView = scrollView
  }

  static func apply(to scrollView: UIScrollView, in owner: UIView, isCallerHidden: Bool, followsNavigationBar: Bool) {
    guard #available(iOS 26.0, *) else {
      return
    }
    guard followsNavigationBar else {
      gate(of: scrollView)?.stopObserving()
      setTopEdgeEffectHidden(isCallerHidden, on: scrollView)
      return
    }
    let gate = gate(of: scrollView) ?? attachGate(to: scrollView)
    gate.owner = owner
    gate.isCallerHidden = isCallerHidden
    gate.isBarClear = hasNothingUnderBar(scrollView)
    setTopEdgeEffectHidden(isCallerHidden || gate.isBarClear, on: scrollView)
  }

  static func detach(from scrollView: UIScrollView) {
    guard let gate = gate(of: scrollView) else {
      return
    }
    gate.stopObserving()
    setTopEdgeEffectHidden(gate.isCallerHidden, on: scrollView)
  }

  private static func gate(of scrollView: UIScrollView) -> ScrollEdgeTopEffectGate? {
    objc_getAssociatedObject(scrollView, &gateKey) as? ScrollEdgeTopEffectGate
  }

  private static func attachGate(to scrollView: UIScrollView) -> ScrollEdgeTopEffectGate {
    let gate = ScrollEdgeTopEffectGate(scrollView: scrollView)
    gate.observations = [
      scrollView.observe(\.contentOffset) { [weak gate] _, _ in
        MainActor.assumeIsolated {
          gate?.offsetDidChange()
        }
      },
      scrollView.observe(\.contentInset, options: [.prior]) { [weak gate] _, change in
        MainActor.assumeIsolated {
          gate?.insetDidChange(isPrior: change.isPrior)
        }
      },
    ]
    objc_setAssociatedObject(scrollView, &gateKey, gate, .OBJC_ASSOCIATION_RETAIN_NONATOMIC)
    return gate
  }

  private static func hasNothingUnderBar(_ scrollView: UIScrollView) -> Bool {
    scrollView.contentOffset.y + scrollView.contentInset.top <= clearTolerance
  }

  private static func setTopEdgeEffectHidden(_ isHidden: Bool, on scrollView: UIScrollView) {
#if compiler(>=6.2)
    guard #available(iOS 26.0, *) else {
      return
    }
    scrollView.topEdgeEffect.isHidden = isHidden
#endif
  }

  private func offsetDidChange() {
    update(canShow: pendingInsetChanges == 0)
  }

  private func insetDidChange(isPrior: Bool) {
    guard !isPrior else {
      pendingInsetChanges += 1
      return
    }
    pendingInsetChanges = max(pendingInsetChanges - 1, 0)
    update(canShow: false)
  }

  private func update(canShow: Bool) {
    guard let scrollView else {
      return
    }
    let isClear = Self.hasNothingUnderBar(scrollView)
    guard isClear != isBarClear, isClear || canShow else {
      return
    }
    guard let owner, scrollView.isDescendant(of: owner) else {
      stopObserving()
      return
    }
    isBarClear = isClear
    Self.setTopEdgeEffectHidden(isCallerHidden || isClear, on: scrollView)
  }

  private func stopObserving() {
    for observation in observations {
      observation.invalidate()
    }
    observations = []
    guard let scrollView else {
      return
    }
    objc_setAssociatedObject(scrollView, &Self.gateKey, nil, .OBJC_ASSOCIATION_RETAIN_NONATOMIC)
  }
}
