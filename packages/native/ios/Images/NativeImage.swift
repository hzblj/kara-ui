import UIKit

/// An image drawn at a height, its width kept in proportion, in its own colours (never tinted).
enum NativeImage {
  static func rendered(_ image: UIImage, height: CGFloat, scale: CGFloat) -> UIImage? {
    guard image.size.width > 0, image.size.height > 0, height > 0 else {
      return nil
    }

    let size = CGSize(width: image.size.width * height / image.size.height, height: height)
    let format = UIGraphicsImageRendererFormat.preferred()
    format.scale = scale

    return UIGraphicsImageRenderer(size: size, format: format).image { _ in
      image.draw(in: CGRect(origin: .zero, size: size))
    }.withRenderingMode(.alwaysOriginal)
  }
}
