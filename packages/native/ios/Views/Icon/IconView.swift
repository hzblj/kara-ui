import ExpoModulesCore
import UIKit

/**
 * An icon outside any SwiftUI host — the React Native tier. Either an app icon from the asset catalog (a template image
 * the plugin generated from an SVG, scaled to fit the view) or a system symbol drawn at `symbolSize`, the way SwiftUI's
 * `Image(systemName:)` sizes it inside a host, so the two tiers agree.
 *
 * A `UIImageView` rather than a SwiftUI host per icon: an icon in every list row would otherwise cost a hosting
 * controller and a SwiftUI graph each.
 */
public final class IconView: ExpoView {
  private let imageView = UIImageView()

  var assetName: String? {
    didSet { updateImage() }
  }

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
    imageView.isAccessibilityElement = false
    addSubview(imageView)
  }

  public override func layoutSubviews() {
    super.layoutSubviews()
    imageView.frame = bounds
  }

  private func updateImage() {
    if let systemName {
      let configuration = UIImage.SymbolConfiguration(pointSize: symbolSize)
      imageView.image = UIImage(systemName: systemName, withConfiguration: configuration)
      imageView.contentMode = .center
      return
    }

    imageView.image = assetName.flatMap { UIImage(named: $0) }?.withRenderingMode(.alwaysTemplate)
    imageView.contentMode = .scaleAspectFit
  }
}
