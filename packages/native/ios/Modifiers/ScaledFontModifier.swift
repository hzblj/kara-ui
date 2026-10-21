import ExpoModulesCore
import ExpoUI
import SwiftUI
import UIKit

/** The weights the theme names. Applied to the system face only — a custom face carries its own. */
internal enum TextWeight: String, Enumerable {
  case regular
  case medium
  case semibold
  case bold

  var swiftUI: Font.Weight {
    switch self {
    case .regular: .regular
    case .medium: .medium
    case .semibold: .semibold
    case .bold: .bold
    }
  }

  var uiKit: UIFont.Weight {
    switch self {
    case .regular: .regular
    case .medium: .medium
    case .semibold: .semibold
    case .bold: .bold
    }
  }
}

internal enum ScaledFontTextStyle: String, Enumerable {
  case largeTitle
  case title
  case title2
  case title3
  case headline
  case subheadline
  case body
  case callout
  case footnote
  case caption
  case caption2

  var swiftUI: Font.TextStyle {
    switch self {
    case .largeTitle: .largeTitle
    case .title: .title
    case .title2: .title2
    case .title3: .title3
    case .headline: .headline
    case .subheadline: .subheadline
    case .body: .body
    case .callout: .callout
    case .footnote: .footnote
    case .caption: .caption
    case .caption2: .caption2
    }
  }

  var uiKit: UIFont.TextStyle {
    switch self {
    case .largeTitle: .largeTitle
    case .title: .title1
    case .title2: .title2
    case .title3: .title3
    case .headline: .headline
    case .subheadline: .subheadline
    case .body: .body
    case .callout: .callout
    case .footnote: .footnote
    case .caption: .caption1
    case .caption2: .caption2
    }
  }
}

/**
 * An exact size that still answers Dynamic Type, for a custom face *and* for the system one. `@expo/ui`'s `font()` can
 * do the first — `Font.custom(_:size:relativeTo:)` — but not the second: a system font is either a text style (Apple's
 * size, not ours) or a fixed size that ignores the setting.
 *
 * With a `family` the face is the weight, so no weight is applied on top. Without one the size is scaled the way UIKit
 * scales the text style's own size, `UIFontMetrics.scaledValue`, at the environment's `dynamicTypeSize` — which a host's
 * `dynamicTypeSize` cap has already clamped, so the system face stops growing where a custom one does.
 *
 * Registered as `scaledFont` in `KaraUIModule`. It applies to a view, so the text-concatenation path of `@expo/ui`
 * (a `Text` nested in a `Text`) does not see it.
 */
internal struct ScaledFontModifier: ViewModifier, Record {
  @Field var family: String?
  @Field var size: Double = 17
  @Field var weight: TextWeight?
  @Field var textStyle: ScaledFontTextStyle = .body

  func body(content: Content) -> some View {
    content.modifier(
      ScaledFont(family: family, size: CGFloat(size), weight: weight?.swiftUI ?? .regular, textStyle: textStyle)
    )
  }
}

/** Kept apart from the `Record` so the environment read lives in a plain modifier. */
private struct ScaledFont: ViewModifier {
  let family: String?
  let size: CGFloat
  let weight: Font.Weight
  let textStyle: ScaledFontTextStyle

  @Environment(\.dynamicTypeSize) private var dynamicTypeSize

  func body(content: Content) -> some View {
    content.font(font)
  }

  private var font: Font {
    if let family {
      return .custom(family, size: size, relativeTo: textStyle.swiftUI)
    }

    let traits = UITraitCollection(preferredContentSizeCategory: UIContentSizeCategory(dynamicTypeSize))
    let scaled = UIFontMetrics(forTextStyle: textStyle.uiKit).scaledValue(for: size, compatibleWith: traits)

    return .system(size: scaled, weight: weight)
  }
}
