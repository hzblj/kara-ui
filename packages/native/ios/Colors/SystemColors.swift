import UIKit

/**
 UIKit's semantic colours as the values they draw in one appearance. A `PlatformColor` reaches JS as a name UIKit
 resolves against whatever trait collection draws it, which is right for a style and useless to anything that has to
 interpolate a colour itself: a Reanimated transition of a background reads numbers. `@hzblj/kara-sx` asks this for the
 two ends of such a transition, once per name and appearance.
 */
internal enum SystemColors {
  /// The first name UIKit knows, as `#rrggbbaa` in sRGB, or `nil` when it knows none of them.
  static func hex(_ names: [String], dark: Bool) -> String? {
    let traits = UITraitCollection(userInterfaceStyle: dark ? .dark : .light)

    for name in names {
      if let color = color(named: name) {
        return hex(color.resolvedColor(with: traits))
      }
    }

    return nil
  }

  /// React Native's own lookup: the `UIColor` class property of that name, with or without its `Color` suffix.
  private static func color(named name: String) -> UIColor? {
    let type: AnyObject = UIColor.self
    let candidates = name.hasSuffix("Color") ? [name] : [name, "\(name)Color"]

    for candidate in candidates {
      let selector = NSSelectorFromString(candidate)

      if type.responds(to: selector), let value = type.perform(selector)?.takeUnretainedValue() as? UIColor {
        return value
      }
    }

    return nil
  }

  /// Through sRGB, so a grey (two components) and an extended-range colour come out as four channels alike.
  private static func hex(_ color: UIColor) -> String? {
    guard
      let srgb = CGColorSpace(name: CGColorSpace.sRGB),
      let converted = color.cgColor.converted(to: srgb, intent: .defaultIntent, options: nil),
      let components = converted.components,
      components.count >= 4
    else {
      return nil
    }

    let channel = { (value: CGFloat) in Int((min(max(value, 0), 1) * 255).rounded()) }

    return String(
      format: "#%02x%02x%02x%02x",
      channel(components[0]),
      channel(components[1]),
      channel(components[2]),
      channel(components[3])
    )
  }
}
