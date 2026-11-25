import ExpoModulesCore
import UIKit

/**
 Content at the top of a native-stack screen that sits right under the navigation bar and moves with it in the same
 call. Yoga lays the children out as usual; the view overrides `center`, which Fabric sets from the layout metrics,
 adds the screen's top safe area to it and applies it again on every `RNSSafeAreaDidChange`
 (`SafeAreaProviderObserver`). That notification comes inside UIKit's search present and dismiss animations, so the
 move animates with the bar, with no commit, layout or JS per frame.

 Yoga does not know the shift. React Native's hit test treats a parent without Yoga overflow as clipping, so the parent
 must already cover where the view ends up (a full-screen `box-none` overlay). `measure` reports the unshifted position,
 so it suits native controls (a segmented control, chips) rather than React Native pressables, whose press retention
 measures through the shadow tree.
 */
public final class NavigationBarAnchorView: ExpoView {
  private let navigationBarObserver = SafeAreaProviderObserver()
  private var layoutCenter: CGPoint?
  private var navigationInset: CGFloat = 0

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    navigationBarObserver.onChange = { [weak self] in
      self?.applyNavigationInset()
    }
  }

  public override var center: CGPoint {
    get {
      super.center
    }
    set {
      layoutCenter = newValue
      super.center = shiftedCenter(newValue)
    }
  }

  public override func didMoveToWindow() {
    super.didMoveToWindow()
    guard window != nil else {
      navigationBarObserver.detach()
      return
    }
    navigationBarObserver.attach(from: self)
    applyNavigationInset()
  }

  private func applyNavigationInset() {
    guard let inset = navigationBarObserver.topInset, inset != navigationInset else {
      return
    }
    navigationInset = inset
    guard let layoutCenter else {
      return
    }
    super.center = shiftedCenter(layoutCenter)
  }

  private func shiftedCenter(_ point: CGPoint) -> CGPoint {
    CGPoint(x: point.x, y: point.y + navigationInset)
  }
}
