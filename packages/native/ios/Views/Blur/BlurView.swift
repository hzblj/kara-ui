import ExpoModulesCore
import UIKit

/**
 The system's materials as a UIKit view: a `UIVisualEffectView` with one of `UIBlurEffect`'s `system*Material` styles
 behind React Native children — what sheets, bars, menus and HUDs are made of, in SwiftUI's five thicknesses. A plain
 view in React Native layout, not a SwiftUI host, so it costs next to nothing even in a list cell.

 With a vibrancy level the children mount into a `UIVibrancyEffect` over the blur, the way iOS draws labels and fills
 on its own materials: their colour is replaced by the vibrant one of that level, their alpha kept as the mask.
 Without one they mount into the blur's `contentView` and keep their colours. The effect view is the shape — its
 continuous corner radius clips the material and the children alike. The appearance is the app theme's rather than
 the trait the view inherits, the same as `GlassView`, unless the caller pins one.
 */
public final class BlurView: ExpoView {
  private let blurView = UIVisualEffectView(effect: nil)
  private let vibrancyView = UIVisualEffectView(effect: nil)

  var material = "regular" {
    didSet {
      guard material != oldValue else { return }
      applyEffects()
    }
  }

  /// `primary` to `quaternary` (the label levels), `fill`, `separator`, or nothing for children in their own colours.
  var vibrancy: String? {
    didSet {
      guard vibrancy != oldValue else { return }
      moveChildren(from: container(for: oldValue), to: container(for: vibrancy))
      applyEffects()
    }
  }

  /// `light` or `dark` pins the material to that appearance; anything else follows the inherited trait.
  var colorScheme: String? {
    didSet { overrideUserInterfaceStyle = UIUserInterfaceStyle(colorScheme: colorScheme) }
  }

  var cornerRadius: CGFloat = 0 {
    didSet { setNeedsLayout() }
  }

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    blurView.clipsToBounds = true
    blurView.layer.cornerCurve = .continuous
    blurView.contentView.addSubview(vibrancyView)
    addSubview(blurView)
    applyEffects()
  }

  public override func layoutSubviews() {
    super.layoutSubviews()
    blurView.frame = bounds
    vibrancyView.frame = blurView.contentView.bounds
    blurView.layer.cornerRadius = min(cornerRadius, min(bounds.width, bounds.height) / 2)
  }

  public override func mountChildComponentView(_ childComponentView: UIView, index: Int) {
    let container = container(for: vibrancy)
    // The blur's own content view also holds the vibrancy view, under the children.
    let offset = container === blurView.contentView ? 1 : 0
    container.insertSubview(childComponentView, at: index + offset)
  }

  public override func unmountChildComponentView(_ childComponentView: UIView, index: Int) {
    childComponentView.removeFromSuperview()
  }

  private func container(for vibrancy: String?) -> UIView {
    vibrancy == nil ? blurView.contentView : vibrancyView.contentView
  }

  private func moveChildren(from old: UIView, to new: UIView) {
    guard old !== new else { return }
    let children = old.subviews.filter { $0 !== vibrancyView }
    for child in children {
      new.addSubview(child)
    }
  }

  private func applyEffects() {
    let blur = UIBlurEffect(style: BlurView.blurStyle(for: material))
    blurView.effect = blur
    if let vibrancy {
      vibrancyView.effect = UIVibrancyEffect(blurEffect: blur, style: BlurView.vibrancyStyle(for: vibrancy))
      vibrancyView.isHidden = false
    } else {
      vibrancyView.effect = nil
      vibrancyView.isHidden = true
    }
  }

  /// SwiftUI's `Material` names over UIKit's adaptive styles; `overrideUserInterfaceStyle` picks light or dark.
  private static func blurStyle(for material: String) -> UIBlurEffect.Style {
    switch material {
    case "ultraThin":
      return .systemUltraThinMaterial
    case "thin":
      return .systemThinMaterial
    case "thick":
      return .systemThickMaterial
    case "ultraThick":
      return .systemChromeMaterial
    default:
      return .systemMaterial
    }
  }

  private static func vibrancyStyle(for vibrancy: String) -> UIVibrancyEffectStyle {
    switch vibrancy {
    case "secondary":
      return .secondaryLabel
    case "tertiary":
      return .tertiaryLabel
    case "quaternary":
      return .quaternaryLabel
    case "fill":
      return .fill
    case "separator":
      return .separator
    default:
      return .label
    }
  }
}
