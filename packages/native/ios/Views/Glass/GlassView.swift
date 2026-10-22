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
  private var needsEffectUpdate = true

  var glassTint: UIColor? {
    didSet { needsEffectUpdate = true }
  }

  var isInteractive = false {
    didSet { needsEffectUpdate = true }
  }

  /**
   Pins the view's appearance to the app theme rather than the trait it inherits. Inside a scroll edge container's
   bar, SwiftUI's scroll pocket switches the bar content's trait to dark over dark content scrolling underneath, and
   once flipped it stays dark — light glass chips turned dark grey with dark labels.
   */
  var colorScheme: String? {
    didSet { overrideUserInterfaceStyle = UIUserInterfaceStyle(colorScheme: colorScheme) }
  }

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    addSubview(effectView)
  }

  public override func layoutSubviews() {
    super.layoutSubviews()
    effectView.frame = bounds
    effectView.layer.cornerRadius = min(bounds.width, bounds.height) / 2
  }

  public override func mountChildComponentView(_ childComponentView: UIView, index: Int) {
    effectView.contentView.insertSubview(childComponentView, at: index)
  }

  public override func unmountChildComponentView(_ childComponentView: UIView, index: Int) {
    childComponentView.removeFromSuperview()
  }

  /**
   The effect is set as soon as the props arrive, mounted or not. UIKit keeps it from rendering while the view sits
   in a hidden subtree and draws it once the subtree shows — which holds under React Native fades only thanks to
   `OpacityVisibilitySync`. Without it, glass mounted under a view at opacity 0 never rendered; waiting for every
   ancestor to reach full opacity before setting the effect, as this view once did, could not repair that.
   */
  func applyEffectIfNeeded() {
    guard needsEffectUpdate else {
      return
    }
    needsEffectUpdate = false
#if compiler(>=6.2)
    if #available(iOS 26.0, *) {
      let effect = UIGlassEffect(style: .regular)
      effect.tintColor = glassTint
      effect.isInteractive = isInteractive
      effectView.cornerConfiguration = .capsule()
      effectView.effect = effect
    }
#endif
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
