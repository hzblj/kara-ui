import ExpoModulesCore
import UIKit

/**
 One of kara's glyphs outside any SwiftUI host, the React Native tier: a system symbol drawn at `symbolSize`, the way
 SwiftUI's `Image(systemName:)` sizes it inside a host, so the two tiers agree. The app's own icons are
 `@hzblj/expo-native-icons`' `NativeIconView`.

 A `UIImageView` rather than a SwiftUI host per glyph: a glyph in every list row would otherwise cost a hosting
 controller and a SwiftUI graph each.
 */
public final class IconView: ExpoView {
  private let imageView = UIImageView()

  var systemName: String? {
    didSet { updateImage() }
  }

  var symbolSize: CGFloat = 17 {
    didSet { updateImage() }
  }

  var iconColor: UIColor? {
    didSet { imageView.tintColor = iconColor }
  }

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    imageView.contentMode = .center
    imageView.isAccessibilityElement = false
    addSubview(imageView)
  }

  public override func layoutSubviews() {
    super.layoutSubviews()
    imageView.frame = bounds
  }

  private func updateImage() {
    let configuration = UIImage.SymbolConfiguration(pointSize: symbolSize)
    imageView.image = systemName.flatMap { UIImage(systemName: $0, withConfiguration: configuration) }
  }
}
