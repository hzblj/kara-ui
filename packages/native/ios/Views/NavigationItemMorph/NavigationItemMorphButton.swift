import UIKit

/**
 The custom view of a bar item that morphs between its label and an icon. It draws its own interactive glass, since the
 bar's own platter jumps to a new size in one frame: the bar gets the new width at once (so the title gets its room),
 while the glass and the content animate inside the view from where they were shown, trailing-anchored, the content
 always centred in the glass. Collapsing fades the label out, widens the glass a little, springs it into a 44 pt circle
 and scales the icon in; expanding reverses it.
 */
final class NavigationItemMorphButton: UIControl {
  private static let height: CGFloat = 44
  private static let collapsedWidth: CGFloat = 44
  private static let labelPadding: CGFloat = 14
  private static let overshoot: CGFloat = 6
  private static let iconSize: CGFloat = 24
  private static let hiddenIconScale = CGAffineTransform(scaleX: 0.6, y: 0.6)
  private static let hiddenLabelScale = CGAffineTransform(scaleX: 0.92, y: 0.92)

  private let effectView = UIVisualEffectView(effect: nil)
  private let contentView = UIView()
  private let labelView = UILabel()
  private let iconView = UIImageView()
  private lazy var widthConstraint = widthAnchor.constraint(equalToConstant: expandedWidth)
  private var generation = 0
  private var isMorphing = false

  private(set) var isCollapsed = false

  /// Called on a tap, or when VoiceOver activates the item.

  var onPress: (() -> Void)?

  var label = "" {
    didSet {
      labelView.text = label
      labelView.sizeToFit()
      accessibilityLabel = label
      if !isCollapsed {
        widthConstraint.constant = expandedWidth
      }
      setNeedsLayout()
    }
  }

  var imageName = "" {
    didSet {
      iconView.image = UIImage(named: imageName)?.withRenderingMode(.alwaysTemplate)
    }
  }

  var itemColor: UIColor = .label {
    didSet {
      labelView.textColor = itemColor
      iconView.tintColor = itemColor
    }
  }

  private var expandedWidth: CGFloat {
    let width = (label as NSString).size(withAttributes: [.font: labelView.font as Any]).width
    return ceil(width) + 2 * Self.labelPadding
  }

  override init(frame: CGRect) {
    super.init(frame: frame)
    translatesAutoresizingMaskIntoConstraints = false
    accessibilityTraits = .button
    isAccessibilityElement = true
    clipsToBounds = false

#if compiler(>=6.2)
    if #available(iOS 26.0, *) {
      let effect = UIGlassEffect(style: .regular)
      effect.isInteractive = true
      effectView.effect = effect
      effectView.cornerConfiguration = .capsule()
    }
#endif
    addSubview(effectView)

    contentView.isUserInteractionEnabled = false
    effectView.contentView.addSubview(contentView)

    addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(handleTap)))

    labelView.font = .systemFont(ofSize: 17, weight: .medium)
    labelView.textColor = itemColor
    contentView.addSubview(labelView)

    iconView.contentMode = .scaleAspectFit
    iconView.tintColor = itemColor
    iconView.alpha = 0
    iconView.transform = Self.hiddenIconScale
    iconView.bounds = CGRect(x: 0, y: 0, width: Self.iconSize, height: Self.iconSize)
    contentView.addSubview(iconView)

    NSLayoutConstraint.activate([heightAnchor.constraint(equalToConstant: Self.height), widthConstraint])
  }

  @available(*, unavailable)
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override func accessibilityActivate() -> Bool {
    onPress?()
    return true
  }

  @objc private func handleTap() {
    onPress?()
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    guard !isMorphing else {
      return
    }
    place(in: bounds)
  }

  func setCollapsed(_ collapsed: Bool, animated: Bool) {
    guard collapsed != isCollapsed else {
      return
    }
    isCollapsed = collapsed
    generation += 1

    guard animated, let bar = navigationBar else {
      isMorphing = false
      widthConstraint.constant = collapsed ? Self.collapsedWidth : expandedWidth
      labelView.alpha = collapsed ? 0 : 1
      labelView.transform = .identity
      iconView.alpha = collapsed ? 1 : 0
      iconView.transform = collapsed ? .identity : Self.hiddenIconScale
      setNeedsLayout()
      return
    }

    let shownWidth = effectView.layer.presentation()?.frame.width ?? effectView.frame.width
    let fromWidth = shownWidth > 0 ? shownWidth : widthConstraint.constant
    let toWidth = collapsed ? Self.collapsedWidth : expandedWidth
    isMorphing = true
    widthConstraint.constant = toWidth
    UIView.performWithoutAnimation {
      bar.layoutIfNeeded()
      place(in: trailingRect(width: fromWidth))
    }

    if collapsed {
      animateCollapse(from: fromWidth)
    } else {
      animateExpand()
    }
  }

  private func animateCollapse(from fromWidth: CGFloat) {
    let current = generation
    UIView.animate(withDuration: 0.22, delay: 0, options: [.curveEaseInOut, .beginFromCurrentState]) {
      self.labelView.alpha = 0
      self.labelView.transform = Self.hiddenLabelScale
    }
    UIView.animate(withDuration: 0.2, delay: 0, options: [.curveEaseOut, .beginFromCurrentState]) {
      self.place(in: self.trailingRect(width: fromWidth + Self.overshoot))
    } completion: { _ in
      guard current == self.generation else {
        return
      }
      UIView.animate(
        withDuration: 0.6,
        delay: 0,
        usingSpringWithDamping: 0.86,
        initialSpringVelocity: 0,
        options: [.beginFromCurrentState, .allowUserInteraction]
      ) {
        self.place(in: self.bounds)
      } completion: { _ in
        self.finishMorph(generation: current)
      }
      UIView.animate(
        withDuration: 0.5,
        delay: 0.12,
        usingSpringWithDamping: 0.8,
        initialSpringVelocity: 0,
        options: [.beginFromCurrentState, .allowUserInteraction]
      ) {
        self.iconView.alpha = 1
        self.iconView.transform = .identity
      }
    }
  }

  private func animateExpand() {
    let current = generation
    UIView.animate(withDuration: 0.2, delay: 0, options: [.curveEaseIn, .beginFromCurrentState]) {
      self.iconView.alpha = 0
      self.iconView.transform = Self.hiddenIconScale
    }
    UIView.animate(
      withDuration: 0.65,
      delay: 0.06,
      usingSpringWithDamping: 0.88,
      initialSpringVelocity: 0,
      options: [.beginFromCurrentState, .allowUserInteraction]
    ) {
      self.place(in: self.bounds)
    } completion: { _ in
      self.finishMorph(generation: current)
    }
    labelView.transform = Self.hiddenLabelScale
    UIView.animate(withDuration: 0.35, delay: 0.28, options: [.curveEaseOut, .beginFromCurrentState]) {
      self.labelView.alpha = 1
      self.labelView.transform = .identity
    }
  }

  private func finishMorph(generation current: Int) {
    guard current == generation else {
      return
    }
    isMorphing = false
    setNeedsLayout()
  }

  private func trailingRect(width: CGFloat) -> CGRect {
    CGRect(x: bounds.width - width, y: 0, width: width, height: Self.height)
  }

  private func place(in rect: CGRect) {
    effectView.frame = rect
    contentView.frame = CGRect(origin: .zero, size: rect.size)
    let center = CGPoint(x: rect.width / 2, y: rect.height / 2)
    labelView.center = center
    iconView.center = center
  }

  private var navigationBar: UINavigationBar? {
    var view = superview
    while let current = view {
      if let bar = current as? UINavigationBar {
        return bar
      }
      view = current.superview
    }
    return nil
  }
}
