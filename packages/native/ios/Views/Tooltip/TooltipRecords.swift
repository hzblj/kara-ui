import ExpoModulesCore
import UIKit

internal final class TooltipTextStyleRecord: Record {
  @Field var fontFamily: String?
  @Field var fontWeight: TextWeight = .regular
  @Field var fontSize: Double = 14
  @Field var lineHeight: Double = 20
  @Field var letterSpacing: Double = 0

  required init() {}

  var font: UIFont {
    let size = CGFloat(fontSize)
    return fontFamily.flatMap { UIFont(name: $0, size: size) } ?? .systemFont(ofSize: size, weight: fontWeight.uiKit)
  }
}

internal struct TooltipTextStyle: Equatable {
  var font: UIFont
  var lineHeight: CGFloat
  var letterSpacing: CGFloat

  static let fallback = TooltipTextStyle(font: .systemFont(ofSize: 14), lineHeight: 20, letterSpacing: 0)

  init(font: UIFont, lineHeight: CGFloat, letterSpacing: CGFloat) {
    self.font = font
    self.lineHeight = lineHeight
    self.letterSpacing = letterSpacing
  }

  init(record: TooltipTextStyleRecord) {
    self.init(font: record.font, lineHeight: CGFloat(record.lineHeight), letterSpacing: CGFloat(record.letterSpacing))
  }

  var leading: CGFloat {
    max(lineHeight - font.lineHeight, 0)
  }
}

internal final class TooltipActionRecord: Record {
  @Field var label: String = ""
  @Field var variant: String = TooltipActionVariant.link.rawValue

  required init() {}
}

internal enum TooltipActionVariant: String {
  case link
  case primary
  case secondary
}

internal enum TooltipActionsAlignment: String {
  case start
  case end
}

internal struct TooltipAction: Equatable {
  let label: String
  let variant: TooltipActionVariant

  init(record: TooltipActionRecord) {
    label = record.label
    variant = TooltipActionVariant(rawValue: record.variant) ?? .link
  }
}

internal enum TooltipDismissReason: String {
  case outside
  case anchorHidden
}
