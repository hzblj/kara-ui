import UIKit

/// The bar's title: a label truncated to `maxWidth`, so a centred title keeps clear of the items on both sides.
final class NavigationBarTitleView: UIView {
  let label = UILabel()

  var maxWidth: CGFloat = .greatestFiniteMagnitude {
    didSet {
      if oldValue != maxWidth {
        contentDidChange()
      }
    }
  }

  override init(frame: CGRect) {
    super.init(frame: frame)
    label.numberOfLines = 1
    label.lineBreakMode = .byTruncatingTail
    label.accessibilityTraits = .header
    addSubview(label)
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override var intrinsicContentSize: CGSize {
    let size = label.intrinsicContentSize
    return CGSize(width: min(size.width, maxWidth), height: size.height)
  }

  override func sizeThatFits(_ size: CGSize) -> CGSize {
    intrinsicContentSize
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    label.frame = bounds
  }

  func contentDidChange() {
    invalidateIntrinsicContentSize()
    frame.size = intrinsicContentSize
    setNeedsLayout()
  }
}
