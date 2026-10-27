import UIKit

final class ContextMenuPreview {
  private weak var contentView: UIImageView?
  private let photoRect: CGRect
  private let photoCornerRadius: CGFloat

  private init(contentView: UIImageView, photoRect: CGRect, photoCornerRadius: CGFloat) {
    self.contentView = contentView
    self.photoRect = photoRect
    self.photoCornerRadius = photoCornerRadius
  }

  static func render(
    _ previewView: ContextMenuPreviewView,
    isZoomable: Bool
  ) -> (controller: UIViewController, preview: ContextMenuPreview?)? {
    guard previewView.bounds.width > 0, previewView.bounds.height > 0 else {
      return nil
    }

    let wasHidden = previewView.isHidden
    let originalFrame = previewView.frame
    previewView.frame.origin = CGPoint(x: -originalFrame.width - 10000, y: originalFrame.origin.y)
    previewView.isHidden = false
    let content: UIView?
    var preview: ContextMenuPreview?
    if isZoomable {
      let photoView = firstImageView(in: previewView)
      let photoRect = photoView.map { $0.convert($0.bounds, to: previewView) }
      let imageView = UIImageView(image: snapshot(of: previewView))
      if let photoRect, photoRect.width > 0, photoRect.height > 0 {
        preview = ContextMenuPreview(
          contentView: imageView,
          photoRect: photoRect,
          photoCornerRadius: cornerRadius(around: photoView, within: previewView)
        )
      }
      content = imageView
    } else {
      content = previewView.snapshotView(afterScreenUpdates: true)
    }
    previewView.isHidden = wasHidden
    previewView.frame = originalFrame

    guard let content else {
      return nil
    }

    let size = previewView.bounds.size
    let controller = UIViewController()
    controller.view.backgroundColor = .clear
    content.frame = CGRect(origin: .zero, size: size)
    controller.view.addSubview(content)
    controller.preferredContentSize = size
    return (controller, preview)
  }

  func makePhotoCopy(in window: UIWindow) -> UIImageView? {
    guard let image = contentView?.image, let onScreen = onScreen(in: window) else {
      return nil
    }
    let photo = UIImageView(image: Self.crop(image, to: photoRect))
    photo.frame = Self.scaled(photoRect, by: onScreen.scale).offsetBy(dx: onScreen.frame.minX, dy: onScreen.frame.minY)
    photo.layer.cornerRadius = photoCornerRadius * onScreen.scale
    photo.layer.cornerCurve = .continuous
    photo.clipsToBounds = true
    photo.isUserInteractionEnabled = false
    return photo
  }

  func makeCardCopy(in window: UIWindow, style: ContextMenuPlatterStyle) -> (view: UIView, photoRect: CGRect)? {
    guard let image = contentView?.image, let onScreen = onScreen(in: window) else {
      return nil
    }
    let cornerRadius = style.cornerRadius * onScreen.scale

    let card = UIView(frame: onScreen.frame)
    card.isUserInteractionEnabled = false
    card.layer.cornerRadius = cornerRadius
    card.layer.cornerCurve = .continuous
    style.applyShadow(to: card.layer, cornerRadius: cornerRadius)

    let content = UIImageView(image: image)
    content.frame = card.bounds
    content.layer.cornerRadius = cornerRadius
    content.layer.cornerCurve = .continuous
    content.clipsToBounds = true
    card.addSubview(content)

    return (card, Self.scaled(photoRect, by: onScreen.scale))
  }

  private func onScreen(in window: UIWindow) -> (frame: CGRect, scale: CGFloat)? {
    guard let container = contentView?.superview,
      container.bounds.width > 0, container.bounds.height > 0,
      let previewFrame = ContextMenuPortal.frame(showing: container, in: window)
    else {
      return nil
    }
    let scale = previewFrame.width / container.bounds.width
    guard scale > 0 else {
      return nil
    }
    return (previewFrame, scale)
  }

  private static func scaled(_ rect: CGRect, by scale: CGFloat) -> CGRect {
    CGRect(x: rect.minX * scale, y: rect.minY * scale, width: rect.width * scale, height: rect.height * scale)
  }

  private static func snapshot(of view: UIView) -> UIImage {
    let format = UIGraphicsImageRendererFormat(for: view.traitCollection)
    format.opaque = false
    return UIGraphicsImageRenderer(bounds: view.bounds, format: format).image { _ in
      view.drawHierarchy(in: view.bounds, afterScreenUpdates: true)
    }
  }

  private static func crop(_ image: UIImage, to rect: CGRect) -> UIImage {
    let format = UIGraphicsImageRendererFormat()
    format.scale = image.scale
    format.opaque = false
    return UIGraphicsImageRenderer(size: rect.size, format: format).image { _ in
      image.draw(at: CGPoint(x: -rect.minX, y: -rect.minY))
    }
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

  private static func cornerRadius(around view: UIView?, within container: UIView) -> CGFloat {
    var current = view
    while let candidate = current, candidate !== container {
      if candidate.layer.cornerRadius > 0 {
        return candidate.layer.cornerRadius
      }
      current = candidate.superview
    }
    return 0
  }
}
