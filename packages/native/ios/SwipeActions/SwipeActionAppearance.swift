import ObjectiveC
import UIKit

/**
 Colours list swipe actions, which SwiftUI gives no API for: `.swipeActions` become `UIContextualAction`s, which take a
 title, a background colour and an image, but no title colour, and SwiftUI's image is drawn as a white template.

 On iOS 26+ each action is a `_UISwipeActionDynamicButtonView` holding the capsule (`_UISwipeActionDynamicButton`, a
 `UIButton` with a filled configuration) and the title `UILabel`, which UIKit gives `secondaryLabelColor` itself, so
 a `UILabel` appearance proxy loses to it. This wraps that class's `layoutSubviews` once per process (adding an
 override that calls the superclass when the class has none of its own, so `UIView` itself is never touched) and,
 after each layout, sets the title colour and the capsule's `baseForegroundColor` and image tint: the destructive
 icon colour when the capsule's background matches `destructiveBackground`, the icon colour otherwise. The class is
 looked up by name, so a renamed one leaves the system colours. Below iOS 26 the title sits white inside the coloured
 button, so nothing is done there.
 */
enum SwipeActionAppearance {
  struct Colors {
    var title: UIColor?
    var icon: UIColor?
    var destructiveIcon: UIColor?
    var destructiveBackground: UIColor?
  }

  private static let buttonViewClassName = "_UISwipeActionDynamicButtonView"
  private static let colorTolerance: CGFloat = 0.02
  private static var colors: Colors?

  private static let installation: Void = {
    guard let buttonViewClass = NSClassFromString(buttonViewClassName) else {
      return
    }
    wrapLayoutSubviews(of: buttonViewClass)
  }()

  static func configure(_ record: SwipeActionAppearanceRecord) {
    guard #available(iOS 26.0, *) else {
      return
    }
    colors = Colors(
      title: record.titleColor?.dynamicColor,
      icon: record.iconColor?.dynamicColor,
      destructiveIcon: record.destructiveIconColor?.dynamicColor,
      destructiveBackground: record.destructiveBackgroundColor?.dynamicColor
    )
    _ = installation
  }

  private static func wrapLayoutSubviews(of viewClass: AnyClass) {
    let selector = #selector(UIView.layoutSubviews)
    typealias Implementation = @convention(c) (UIView, Selector) -> Void

    if let method = ownInstanceMethod(of: viewClass, selector: selector) {
      let original = unsafeBitCast(method_getImplementation(method), to: Implementation.self)
      let replacement: @convention(block) (UIView) -> Void = { view in
        original(view, selector)
        apply(to: view)
      }
      method_setImplementation(method, imp_implementationWithBlock(replacement))
      return
    }

    guard let superclass = class_getSuperclass(viewClass) else {
      return
    }
    let replacement: @convention(block) (UIView) -> Void = { view in
      if let inherited = class_getMethodImplementation(superclass, selector) {
        unsafeBitCast(inherited, to: Implementation.self)(view, selector)
      }
      apply(to: view)
    }
    class_addMethod(viewClass, selector, imp_implementationWithBlock(replacement), "v@:")
  }

  private static func ownInstanceMethod(of viewClass: AnyClass, selector: Selector) -> Method? {
    var count: UInt32 = 0
    guard let methods = class_copyMethodList(viewClass, &count) else {
      return nil
    }
    defer { free(methods) }
    for index in 0..<Int(count) where method_getName(methods[index]) == selector {
      return methods[index]
    }
    return nil
  }

  private static func apply(to buttonView: UIView) {
    guard let colors else {
      return
    }
    if let title = colors.title, let label = buttonView.subviews.first(where: { $0 is UILabel }) as? UILabel,
       label.textColor != title {
      label.textColor = title
    }
    guard let button = buttonView.subviews.first(where: { $0 is UIButton }) as? UIButton else {
      return
    }
    let isDestructive = matches(backgroundColor(of: button), colors.destructiveBackground, traits: button.traitCollection)
    guard let icon = isDestructive ? colors.destructiveIcon : colors.icon else {
      return
    }
    if var configuration = button.configuration, configuration.baseForegroundColor != icon {
      configuration.baseForegroundColor = icon
      button.configuration = configuration
    }
    if let imageView = firstImageView(in: button), imageView.tintColor != icon {
      imageView.tintColor = icon
    }
  }

  private static func backgroundColor(of button: UIButton) -> UIColor? {
    button.configuration?.background.backgroundColor ?? button.configuration?.baseBackgroundColor
  }

  private static func matches(_ color: UIColor?, _ other: UIColor?, traits: UITraitCollection) -> Bool {
    guard let color, let other else {
      return false
    }
    var first: (CGFloat, CGFloat, CGFloat, CGFloat) = (0, 0, 0, 0)
    var second: (CGFloat, CGFloat, CGFloat, CGFloat) = (0, 0, 0, 0)
    guard color.resolvedColor(with: traits).getRed(&first.0, green: &first.1, blue: &first.2, alpha: &first.3),
          other.resolvedColor(with: traits).getRed(&second.0, green: &second.1, blue: &second.2, alpha: &second.3) else {
      return false
    }
    return abs(first.0 - second.0) < colorTolerance && abs(first.1 - second.1) < colorTolerance
      && abs(first.2 - second.2) < colorTolerance
  }

  private static func firstImageView(in view: UIView) -> UIImageView? {
    for subview in view.subviews {
      if let imageView = subview as? UIImageView {
        return imageView
      }
      if let imageView = firstImageView(in: subview) {
        return imageView
      }
    }
    return nil
  }
}
