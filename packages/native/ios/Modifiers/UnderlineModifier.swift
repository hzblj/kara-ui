import ExpoModulesCore
import ExpoUI
import SwiftUI

/**
 * Draws a line along the bottom edge of the modified view. On a text with a fixed line height that is the bottom of
 * the line box — where a design system usually puts a link's underline. SwiftUI's own `.underline()` sits right
 * under the baseline instead, and Compose's `TextDecoration.Underline` does the same on Android.
 */
internal struct UnderlineModifier: ViewModifier, Record {
  @Field var color: Color = .primary
  @Field var thickness: Double = 1

  func body(content: Content) -> some View {
    content.overlay(alignment: .bottom) {
      Rectangle()
        .fill(color)
        .frame(height: CGFloat(thickness))
    }
  }
}
