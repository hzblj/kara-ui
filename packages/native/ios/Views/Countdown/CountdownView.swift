import CoreText
import ExpoModulesCore
import SwiftUI
import UIKit

internal final class CountdownProps: ExpoSwiftUI.ViewProps {
  @Field var endsAt: Double = 0
  @Field var fontFamily: String?
  @Field var fontWeight: TextWeight = .regular
  @Field var fontSize: Double = 12
  @Field var color: Color?
  @Field var units: [String] = ["d", "h", "m", "s"]
  @Field var dividerOpacity: Double = 0.35
  @Field var letterSpacing: Double = 0
  @Field var lineHeight: Double = 0
}

/**
 Counts down to `endsAt` (epoch ms), ticking on the whole seconds before the end. Days show only while there are
 some and hours only while at least one is left; minutes and seconds always show, two digits each, joined by a dimmed
 `/` between no-break spaces. A changed digit rolls with `contentTransition(.numericText(countsDown: true))`.

 It draws over an invisible React Native text of the same shape, which is what gives it a size in the layout, so it
 has to set exactly that text: tabular figures, the same tracking and line height, pinned to the top leading corner.
 iOS copies TextKit there — a line box taller than the font is centred, a shorter one keeps the descender and cuts
 the top (React Native only adds a baseline offset in the taller case).
 */
internal struct CountdownView: ExpoSwiftUI.View {
  @ObservedObject var props: CountdownProps

  var body: some View {
    CountdownTimeline(endDate: Date(timeIntervalSince1970: props.endsAt / 1000), style: CountdownStyle(props: props))
  }
}

private struct CountdownTimeline: View {
  let endDate: Date
  let style: CountdownStyle

  private static let tick: TimeInterval = 1

  var body: some View {
    TimelineView(.periodic(from: Self.firstTick(before: endDate), by: Self.tick)) { timeline in
      CountdownContent(time: CountdownTime(remaining: endDate.timeIntervalSince(timeline.date)), style: style)
    }
  }

  private static func firstTick(before endDate: Date) -> Date {
    let remaining = endDate.timeIntervalSinceNow
    return endDate.addingTimeInterval(-remaining.rounded(.up))
  }
}

private struct CountdownTime: Equatable {
  let days: Int
  let hours: Int
  let minutes: Int
  let seconds: Int

  init(remaining: TimeInterval) {
    let total = max(0, Int(remaining.rounded()))
    days = total / 86_400
    hours = total % 86_400 / 3_600
    minutes = total % 3_600 / 60
    seconds = total % 60
  }

  var hasHours: Bool {
    days > 0 || hours > 0
  }
}

private struct CountdownStyle {
  let font: UIFont
  let color: Color
  let units: [String]
  let dividerOpacity: Double
  let tracking: CGFloat
  let lineHeight: CGFloat?
  let lineAlignment: Alignment
  let digitWidth: CGFloat

  init(props: CountdownProps) {
    let size = CGFloat(props.fontSize)
    let base = props.fontFamily.flatMap { UIFont(name: $0, size: size) }
      ?? .systemFont(ofSize: size, weight: props.fontWeight.uiKit)
    font = Self.tabular(base)
    color = props.color ?? .primary
    units = props.units
    dividerOpacity = props.dividerOpacity
    tracking = CGFloat(props.letterSpacing)
    lineHeight = props.lineHeight > 0 ? CGFloat(props.lineHeight) : nil
    lineAlignment = (lineHeight ?? font.lineHeight) < font.lineHeight ? .bottom : .center
    digitWidth = Self.widestDigit(in: font, tracking: tracking)
  }

  func unit(_ index: Int) -> String {
    units.indices.contains(index) ? units[index] : ""
  }

  private static func tabular(_ font: UIFont) -> UIFont {
    let feature: [UIFontDescriptor.FeatureKey: Int] = [
      .type: kNumberSpacingType,
      .selector: kMonospacedNumbersSelector,
    ]
    let descriptor = font.fontDescriptor.addingAttributes([.featureSettings: [feature]])
    return UIFont(descriptor: descriptor, size: font.pointSize)
  }

  private static func widestDigit(in font: UIFont, tracking: CGFloat) -> CGFloat {
    let widths = (0...9).map { digit in
      (String(digit) as NSString).size(withAttributes: [.font: font, .kern: tracking]).width
    }
    return widths.max() ?? font.pointSize
  }
}

private struct CountdownContent: View {
  let time: CountdownTime
  let style: CountdownStyle

  var body: some View {
    HStack(alignment: .firstTextBaseline, spacing: 0) {
      if time.days > 0 {
        segment(value: time.days, minimumDigits: 1, unit: style.unit(0))
        divider
      }
      if time.hasHours {
        segment(value: time.hours, minimumDigits: 2, unit: style.unit(1))
        divider
      }
      segment(value: time.minutes, minimumDigits: 2, unit: style.unit(2))
      divider
      segment(value: time.seconds, minimumDigits: 2, unit: style.unit(3))
    }
    .font(Font(style.font))
    .tracking(style.tracking)
    .foregroundStyle(style.color)
    .fixedSize()
    .frame(height: style.lineHeight, alignment: style.lineAlignment)
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(accessibilityText)
  }

  private func segment(value: Int, minimumDigits: Int, unit: String) -> some View {
    let digits = Array(String(format: "%0\(minimumDigits)d", value))

    return HStack(alignment: .firstTextBaseline, spacing: 0) {
      ForEach(Array(digits.enumerated()), id: \.offset) { _, digit in
        CountdownDigit(digit: digit, width: style.digitWidth)
      }
      Text(unit)
    }
  }

  private var divider: some View {
    Text("\u{00A0}/\u{00A0}")
      .opacity(style.dividerOpacity)
  }

  private var accessibilityText: String {
    var parts: [String] = []
    if time.days > 0 {
      parts.append("\(time.days)\(style.unit(0))")
    }
    if time.hasHours {
      parts.append("\(time.hours)\(style.unit(1))")
    }
    parts.append("\(time.minutes)\(style.unit(2))")
    parts.append("\(time.seconds)\(style.unit(3))")
    return parts.joined(separator: " ")
  }
}

private struct CountdownDigit: View {
  let digit: Character
  let width: CGFloat

  private static let animation = Animation.spring(response: 0.35, dampingFraction: 0.85)

  var body: some View {
    Text(String(digit))
      .frame(width: width)
      .contentTransition(.numericText(countsDown: true))
      .animation(Self.animation, value: digit)
  }
}
