import UIKit

/**
 A picture of one line of the bar's title (the title or the subtitle) where it sits in the navigation bar: the sharp
 rendering plus copies blurred in even steps up to the line's `blur`, which a transition plays as keyframes. Taken from
 the label UIKit draws, found by its text, so the stack's own title stays UIKit's.
 */
struct NavigationTitleSnapshot {
  private static let blurLevels = 10

  /** The line's frame in the navigation bar's coordinates. */
  let frame: CGRect
  /** How far the pictures reach past the frame on every side, for the blur to spread into. */
  let padding: CGFloat
  /** The sharp picture first, then ever more blurred ones. */
  let ladder: [CGImage]
  let motion: NavigationTitleLineMotion

  /** The picture for a blur `amount` between 0 (sharp) and 1 (the line's full blur). */
  func image(blurredBy amount: CGFloat) -> CGImage {
    let level = Int((min(max(amount, 0), 1) * CGFloat(ladder.count - 1)).rounded())
    return ladder[level]
  }

  /** The visible label under `view` that shows `text`. */
  static func findLabel(showing text: String, in view: UIView) -> UILabel? {
    for subview in view.subviews where !subview.isHidden && subview.alpha > 0.01 {
      if let label = subview as? UILabel, (label.attributedText?.string ?? label.text) == text {
        return label
      }
      if let label = findLabel(showing: text, in: subview) {
        return label
      }
    }
    return nil
  }

  init?(label: UILabel, in navigationBar: UINavigationBar, motion: NavigationTitleLineMotion) {
    guard label.bounds.width > 0, label.bounds.height > 0 else {
      return nil
    }
    let scale = max(label.traitCollection.displayScale, 1)
    let padding = (motion.blur * 3).rounded(.up) + 1
    guard let sharp = Self.render(label, padding: padding, scale: scale) else {
      return nil
    }
    self.frame = label.convert(label.bounds, to: navigationBar)
    self.padding = padding
    self.motion = motion
    self.ladder = Self.ladder(of: label, sharp: sharp, padding: padding, blur: motion.blur, scale: scale)
  }

  private static func ladder(of label: UILabel, sharp: CGImage, padding: CGFloat, blur: CGFloat, scale: CGFloat) -> [CGImage] {
    guard blur > 0 else {
      return [sharp]
    }
    let reduced = render(label, padding: padding, scale: 1)
    var ladder = [sharp]
    for level in 1...blurLevels {
      let sigma = blur * CGFloat(level) / CGFloat(blurLevels)
      // A wide blur loses nothing at 1×, and blurring the full-resolution picture costs scale² as much.
      let lowResolution = sigma * scale >= 3 ? reduced.flatMap { GaussianBlur.image($0, sigma: sigma) } : nil
      ladder.append(lowResolution ?? GaussianBlur.image(sharp, sigma: sigma * scale) ?? sharp)
    }
    return ladder
  }

  private static func render(_ label: UILabel, padding: CGFloat, scale: CGFloat) -> CGImage? {
    label.layer.displayIfNeeded()
    let format = UIGraphicsImageRendererFormat()
    format.scale = scale
    format.opaque = false
    let size = CGSize(width: label.bounds.width + padding * 2, height: label.bounds.height + padding * 2)
    return UIGraphicsImageRenderer(size: size, format: format).image { context in
      context.cgContext.translateBy(x: padding, y: padding)
      label.layer.render(in: context.cgContext)
    }.cgImage
  }
}
