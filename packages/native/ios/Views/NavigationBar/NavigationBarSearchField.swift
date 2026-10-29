import UIKit

private let platterInset: CGFloat = 4
private let buttonContentSize: CGFloat = 36
private let fieldIconSize: CGFloat = 18
private let iconFadeDuration: TimeInterval = 0.2
private let placeholderFadeKey = "navigationBarSearchFieldPlaceholderFade"
private let iconCoverKey = "navigationBarSearchFieldIconCover"

/**
 The integrated search's field, the search item's custom view. The bar draws its glass, so the `UISearchBar` inside has
 no field background of its own, and the bar's own Liquid Glass morph grows it from the search button into the field.

 Collapsed it is the search button: the button's glyph centred, the placeholder and the voice hidden, and a tap starts
 the search instead of editing (the navigation bar's `searchBarShouldBeginEditing`). It stays this custom view in both
 states: swapping it for an image item makes the bar redraw the item's content with its blur, and the glyph blinked.
 */
final class NavigationBarSearchField: UIView {
  private let searchBar: UISearchBar
  private let voice: SearchFieldAccessory
  private var iconCover: UIImageView?

  private(set) var isCollapsed = true

  /// The width of the glass the field fills while searching; the bar's item insets come off it.
  var expandedPlatterWidth: CGFloat = 0 {
    didSet {
      if oldValue != expandedPlatterWidth, !isCollapsed {
        invalidateIntrinsicContentSize()
      }
    }
  }

  var placeholder: String? {
    didSet {
      if isHosting {
        searchBar.placeholder = isCollapsed ? nil : placeholder
      }
    }
  }

  var buttonImage: UIImage? {
    didSet {
      if isHosting {
        searchBar.setImage(icon, for: .search, state: .normal)
      }
    }
  }

  var buttonLabel: String? {
    didSet {
      if isHosting, isCollapsed {
        searchBar.searchTextField.accessibilityLabel = buttonLabel
      }
    }
  }

  var isHosting: Bool {
    searchBar.superview === self
  }

  /// The button's glyph at the size of UIKit's own field magnifier (a 16 pt glyph).
  var fieldIcon: UIImage? {
    buttonImage.map { image in
      let size = CGSize(width: fieldIconSize, height: fieldIconSize)
      return UIGraphicsImageRenderer(size: size).image { _ in
        image.draw(in: CGRect(origin: .zero, size: size))
      }.withRenderingMode(.alwaysTemplate)
    }
  }

  private var icon: UIImage? {
    isCollapsed ? buttonImage : fieldIcon
  }

  init(searchBar: UISearchBar, voice: SearchFieldAccessory) {
    self.searchBar = searchBar
    self.voice = voice
    super.init(frame: .zero)
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override var intrinsicContentSize: CGSize {
    let width = isCollapsed ? buttonContentSize : max(0, expandedPlatterWidth - 2 * platterInset)
    return CGSize(width: width, height: buttonContentSize)
  }

  override func sizeThatFits(_ size: CGSize) -> CGSize {
    intrinsicContentSize
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    guard isHosting else {
      return
    }
    layoutSearchBarAcrossPlatter()
    if isCollapsed {
      centerIcon()
    }
  }

  /// Takes the search bar in and puts it in the given state without animating.
  func host(isCollapsed: Bool) {
    if !isHosting {
      searchBar.setSearchFieldBackgroundImage(UIImage(), for: .normal)
      addSubview(searchBar)
    }
    if isCollapsed {
      collapse(isAnimated: false)
      settleCollapsed()
    } else {
      expand(isAnimated: false)
    }
  }

  /// Gives the search bar back as a plain field, for a stacked search.
  func release() {
    guard isHosting else {
      return
    }
    uncoverIcon()
    placeholderLabel()?.layer.removeAnimation(forKey: placeholderFadeKey)
    searchBar.setSearchFieldBackgroundImage(nil, for: .normal)
    searchBar.setPositionAdjustment(.zero, for: .search)
    searchBar.placeholder = placeholder
    searchBar.setImage(fieldIcon, for: .search, state: .normal)
    searchBar.searchTextField.accessibilityLabel = nil
    voice.setContentHidden(false, isAnimated: false)
    searchBar.removeFromSuperview()
  }

  func expand(isAnimated: Bool) {
    uncoverIcon()
    setCollapsed(false)
    searchBar.searchTextField.accessibilityLabel = nil
    applyIcon(isAnimated: isAnimated)
    if !isAnimated {
      revealContent(isAnimated: false)
    }
  }

  /// Shows the placeholder and the voice once the field has grown, so they never sit inside the button.
  func revealContent(isAnimated: Bool = true) {
    searchBar.placeholder = placeholder
    voice.setContentHidden(false, isAnimated: isAnimated)
    guard isAnimated else {
      placeholderLabel()?.layer.removeAnimation(forKey: placeholderFadeKey)
      return
    }
    searchBar.searchTextField.layoutIfNeeded()
    fadePlaceholder(isShown: true)
  }

  func collapse(isAnimated: Bool) {
    setCollapsed(true)
    searchBar.searchTextField.accessibilityLabel = buttonLabel
    applyIcon(isAnimated: isAnimated)
    fadeContentOut(isAnimated: isAnimated)
  }

  func fadeContentOut(isAnimated: Bool = true) {
    voice.setContentHidden(true, isAnimated: isAnimated)
    if isAnimated {
      fadePlaceholder(isShown: false)
    } else {
      searchBar.placeholder = nil
    }
  }

  /// Ends a collapse: clears the placeholder for good and drops the glyph cover.
  func settleCollapsed() {
    let label = placeholderLabel()
    searchBar.placeholder = nil
    label?.layer.removeAnimation(forKey: placeholderFadeKey)
    uncoverIcon()
  }

  /// Lays a copy of the glyph over the field's own while the bar moves the item to the other side, where it re-hosts
  /// the view and blurs its content in again.
  func coverIcon(in container: UIView) {
    guard let iconView = searchBar.searchTextField.leftView as? UIImageView, iconView.window != nil,
          let image = buttonImage else {
      return
    }
    let cover = UIImageView(image: image)
    cover.tintColor = iconView.tintColor
    let center = iconView.convert(CGPoint(x: iconView.bounds.midX, y: iconView.bounds.midY), to: container)
    cover.frame = CGRect(
      x: center.x - image.size.width / 2,
      y: center.y - image.size.height / 2,
      width: image.size.width,
      height: image.size.height
    )
    container.addSubview(cover)
    iconView.layer.add(Self.opacityHold(at: 0), forKey: iconCoverKey)
    iconCover?.removeFromSuperview()
    iconCover = cover
  }

  private func uncoverIcon() {
    searchBar.searchTextField.leftView?.layer.removeAnimation(forKey: iconCoverKey)
    iconCover?.removeFromSuperview()
    iconCover = nil
  }

  private func setCollapsed(_ isCollapsed: Bool) {
    self.isCollapsed = isCollapsed
    invalidateIntrinsicContentSize()
    setNeedsLayout()
  }

  private func applyIcon(isAnimated: Bool) {
    guard isAnimated, let iconView = searchBar.searchTextField.leftView else {
      searchBar.setImage(icon, for: .search, state: .normal)
      return
    }
    UIView.transition(with: iconView, duration: iconFadeDuration, options: [.transitionCrossDissolve, .allowUserInteraction]) {
      self.searchBar.setImage(self.icon, for: .search, state: .normal)
    }
  }

  private func layoutSearchBarAcrossPlatter() {
    let platter = bounds.insetBy(dx: -platterInset, dy: 0)
    searchBar.setPositionAdjustment(.zero, for: .search)
    let height = searchBar.sizeThatFits(CGSize(width: platter.width, height: .greatestFiniteMagnitude)).height
    searchBar.frame = CGRect(x: platter.minX, y: 0, width: platter.width, height: height)
    searchBar.layoutIfNeeded()
    let field = searchBar.searchTextField.frame
    searchBar.frame = CGRect(
      x: platter.minX - field.minX,
      y: bounds.midY - field.midY,
      width: platter.width + field.minX + platter.width - field.maxX,
      height: height
    )
  }

  private func centerIcon() {
    guard let iconView = searchBar.searchTextField.leftView else {
      return
    }
    searchBar.layoutIfNeeded()
    let iconCenter = iconView.convert(CGPoint(x: iconView.bounds.midX, y: iconView.bounds.midY), to: self)
    searchBar.setPositionAdjustment(UIOffset(horizontal: bounds.midX - iconCenter.x, vertical: 0), for: .search)
    searchBar.layoutIfNeeded()
  }

  private func fadePlaceholder(isShown: Bool) {
    guard let layer = placeholderLabel()?.layer else {
      return
    }
    let fade = CABasicAnimation(keyPath: "opacity")
    if isShown {
      fade.fromValue = 0
      fade.toValue = 1
      fade.duration = 0.18
    } else {
      fade.fromValue = layer.presentation()?.opacity ?? layer.opacity
      fade.toValue = 0
      fade.duration = 0.12
      fade.fillMode = .forwards
      fade.isRemovedOnCompletion = false
    }
    layer.add(fade, forKey: placeholderFadeKey)
  }

  private func placeholderLabel() -> UILabel? {
    guard let placeholder, !placeholder.isEmpty else {
      return nil
    }
    var views: [UIView] = [searchBar.searchTextField]
    while !views.isEmpty {
      let view = views.removeFirst()
      if let label = view as? UILabel, label.text == placeholder {
        return label
      }
      views.append(contentsOf: view.subviews)
    }
    return nil
  }

  private static func opacityHold(at opacity: Float) -> CABasicAnimation {
    let hold = CABasicAnimation(keyPath: "opacity")
    hold.fromValue = opacity
    hold.toValue = opacity
    hold.fillMode = .forwards
    hold.isRemovedOnCompletion = false
    return hold
  }
}
