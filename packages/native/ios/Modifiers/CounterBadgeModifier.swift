import ExpoModulesCore
import ExpoUI
import SwiftUI

/**
 * An @expo/ui view modifier that draws a count badge as a native SwiftUI overlay. Being part of the modified view,
 * it moves with the view's own press animation — the swell of interactive Liquid Glass included — where a React
 * Native overlay laid over the host would stay put while the glass grows under it.
 *
 * Registered as `counterBadge` in `KaraUIModule` and created from JS with `createModifier`.
 */
internal struct CounterBadgeModifier: ViewModifier, Record {
  @Field var count: Int = 0
  @Field var backgroundColor: Color = .red
  @Field var foregroundColor: Color = .white
  @Field var fontFamily: String?

  private var badgeFont: Font {
    if let fontFamily {
      return .custom(fontFamily, size: 10)
    }
    return .system(size: 10, weight: .medium)
  }

  func body(content: Content) -> some View {
    content.overlay(alignment: .topTrailing) {
      if count > 0 {
        Text("\(count)")
          .font(badgeFont)
          .foregroundColor(foregroundColor)
          .padding(.horizontal, 4)
          .frame(minWidth: 16, minHeight: 16)
          .background(Capsule().fill(backgroundColor))
          .offset(x: 4, y: -4)
      }
    }
  }
}
