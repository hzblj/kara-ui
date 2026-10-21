import ExpoModulesCore
import UIKit

/**
 iOS 26 Liquid Glass as a UIKit view: a `UIVisualEffectView` with `UIGlassEffect` (`regular`, a tint,
 `isInteractive`), shaped as a capsule. Below iOS 26 it draws nothing, the same as SwiftUI's `glassEffect`.

 It exists for glass in places a SwiftUI `Host` is too expensive — list cells above all. A host per cell is a
 `UIHostingController` plus a SwiftUI graph, which cost a scrolling list several frames per second of main-thread
 time in a Release build; this view costs next to nothing and renders the same glass.

 React Native children mount into the effect's `contentView`, so the interactive swell scales them with the glass
 (a sibling icon stayed put while the glass grew). Give them `pointerEvents="none"`: the press still goes to the
 nearest React Native ancestor, a `Pressable` around this view.
 */
public final class GlassView: ExpoView {
  private let effectView = UIVisualEffectView(effect: nil)

  var glassTint: UIColor? {
    didSet { applyEffectWhenVisible() }
  }

  var isInteractive = false {
    didSet { applyEffectWhenVisible() }
  }

  /**
   Pins the view's appearance to the app theme rather than the trait it inherits. Inside a scroll edge container's
   bar, SwiftUI's scroll pocket switches the bar content's trait to dark over dark content scrolling underneath, and
   once flipped it stays dark — light glass chips turned dark grey with dark labels.
   */
  var colorScheme: String? {
    didSet { overrideUserInterfaceStyle = UIUserInterfaceStyle(colorScheme: colorScheme) }
  }

  private static let materializeDuration: TimeInterval = 0.2
  private static let fastRetryInterval: TimeInterval = 1.0 / 60
  private static let slowRetryInterval: TimeInterval = 0.5
  private static let fastRetryCount = 120

  private var visibilityRetry: DispatchWorkItem?

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    addSubview(effectView)
    if Self.isGlassAvailable {
      effectView.contentView.alpha = 0
    }
  }

  private static var isGlassAvailable: Bool {
#if compiler(>=6.2)
    if #available(iOS 26.0, *) {
      return true
    }
#endif
    return false
  }

  public override func layoutSubviews() {
    super.layoutSubviews()
    effectView.frame = bounds
    effectView.layer.cornerRadius = min(bounds.width, bounds.height) / 2
  }

  public override func didMoveToWindow() {
    super.didMoveToWindow()
    applyEffectWhenVisible()
  }

  public override func mountChildComponentView(_ childComponentView: UIView, index: Int) {
    effectView.contentView.insertSubview(childComponentView, at: index)
  }

  public override func unmountChildComponentView(_ childComponentView: UIView, index: Int) {
    childComponentView.removeFromSuperview()
  }

  /**
   The effect is set only once this view and every ancestor are at full opacity — exactly 1. React Native fades
   through `layer.opacity`, which UIKit does not watch: a `UIGlassEffect` assigned under an ancestor below 1 stays set
   but never renders, and UIKit only looks again when the view re-enters a window. A 0.99 threshold let it through
   during the last frames of an ease-out fade, and the glass went missing at random.

   So this polls every frame for two seconds, then every half second while the view is in a window — one retry
   chain, restarted by a prop change or a new window. Until the glass is set the content stays at alpha 0 and
   materialises with it, so an icon never shows before its glass; after two seconds it is revealed without one.
   */
  private func applyEffectWhenVisible() {
    visibilityRetry?.cancel()
    visibilityRetry = nil
    applyEffectWhenVisible(attempt: 0)
  }

  private func applyEffectWhenVisible(attempt: Int) {
    if isFullyVisible {
      visibilityRetry = nil
      applyEffect()
      return
    }
    guard window != nil else {
      visibilityRetry = nil
      return
    }
    if attempt == Self.fastRetryCount {
      revealContent()
    }
    let retry = DispatchWorkItem { [weak self] in
      self?.applyEffectWhenVisible(attempt: attempt + 1)
    }
    visibilityRetry = retry
    let interval = attempt < Self.fastRetryCount ? Self.fastRetryInterval : Self.slowRetryInterval
    DispatchQueue.main.asyncAfter(deadline: .now() + interval, execute: retry)
  }

  private func applyEffect() {
#if compiler(>=6.2)
    if #available(iOS 26.0, *) {
      let effect = UIGlassEffect(style: .regular)
      effect.tintColor = glassTint
      effect.isInteractive = isInteractive
      effectView.cornerConfiguration = .capsule()
      UIView.animate(withDuration: Self.materializeDuration) {
        self.effectView.effect = effect
        self.effectView.contentView.alpha = 1
      }
    }
#endif
  }

  private func revealContent() {
    UIView.animate(withDuration: Self.materializeDuration) {
      self.effectView.contentView.alpha = 1
    }
  }
}

extension UIView {
  var isFullyVisible: Bool {
    guard window != nil else {
      return false
    }
    var current: UIView? = self
    while let view = current {
      if view.isHidden || view.alpha < 1 || (view.layer.presentation()?.opacity ?? view.layer.opacity) < 1 {
        return false
      }
      current = view.superview
    }
    return true
  }
}

extension UIUserInterfaceStyle {
  init(colorScheme: String?) {
    switch colorScheme {
    case "light":
      self = .light
    case "dark":
      self = .dark
    default:
      self = .unspecified
    }
  }
}
