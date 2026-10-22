import ExpoModulesCore
import UIKit

private let barItemReservedWidth: CGFloat = 56
private let barGroupedItemWidth: CGFloat = 44
private let barGroupSpacing: CGFloat = 8
private let barHorizontalMargin: CGFloat = 16

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

/**
 A standalone `UINavigationBar` for a header that is not a navigation screen's — a sheet's, above all. Its items are
 `UIBarButtonItem`s, so they press and render exactly like a native-stack header's: on iOS 26 neighbours on one side
 share a glass capsule (`separated` gives an item its own), where standalone glass buttons would each swell toward the
 finger. The title is a custom view so it can sit centred or leading, fade with `titleVisible`, and keep clear of the
 items on both sides; a search placeholder swaps it for a `UISearchBar`.

 An item's `testID` becomes its `accessibilityIdentifier`, which is what UI test tools match an `id` against.
 */
public final class NavigationBarView: ExpoView, UISearchBarDelegate {
  let onItemPress = EventDispatcher()
  let onSearchTextChange = EventDispatcher()
  let onSearchFocusChange = EventDispatcher()

  private let bar = UINavigationBar()
  private let item = UINavigationItem()
  private let titleView = NavigationBarTitleView()
  private lazy var searchBar: UISearchBar = {
    let searchBar = UISearchBar()
    searchBar.searchBarStyle = .minimal
    searchBar.autocapitalizationType = .none
    searchBar.autocorrectionType = .no
    searchBar.spellCheckingType = .no
    searchBar.smartQuotesType = .no
    searchBar.smartDashesType = .no
    searchBar.returnKeyType = .done
    searchBar.enablesReturnKeyAutomatically = false
    searchBar.delegate = self
    return searchBar
  }()
  private lazy var leadingTitleItem: UIBarButtonItem = {
    let titleItem = UIBarButtonItem(customView: titleView)
    if #available(iOS 26.0, *) {
      titleItem.hidesSharedBackground = true
    }
    return titleItem
  }()

  private var titleAlignment = "center"
  private var isTitleVisible = true
  private var leadingItems: [NavigationBarItem] = []
  private var trailingItems: [NavigationBarItem] = []
  private var leadingReservedWidth: CGFloat = 0
  private var trailingReservedWidth: CGFloat = 0
  private var searchPlaceholder: String?
  private var fontFamily: String?
  private var fontSize: CGFloat = UIFont.labelFontSize

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    bar.prefersLargeTitles = false
    titleView.label.textColor = .label
    bar.setItems([item], animated: false)
    addSubview(bar)
    applyAppearance()
    updateItems()
  }

  public override func layoutSubviews() {
    super.layoutSubviews()
    let height = min(bar.sizeThatFits(bounds.size).height, bounds.height)
    bar.frame = CGRect(x: 0, y: (bounds.height - height) / 2, width: bounds.width, height: height)
    updateTitleMaxWidth()
  }

  func setTitle(_ title: String?) {
    titleView.label.text = title
    titleView.label.accessibilityLabel = title
    titleView.contentDidChange()
    if !isLeading && !isSearchEnabled {
      item.titleView = nil
      item.titleView = titleView
    }
    bar.setNeedsLayout()
  }

  func setSearchPlaceholder(_ placeholder: String?) {
    let wasSearchEnabled = isSearchEnabled
    searchPlaceholder = placeholder
    searchBar.placeholder = placeholder
    if wasSearchEnabled != isSearchEnabled {
      updateItems()
    }
  }

  func setSearchTestID(_ testID: String?) {
    searchBar.searchTextField.accessibilityIdentifier = testID
  }

  func clearSearchText() {
    searchBar.text = nil
    searchBar.resignFirstResponder()
  }

  public func searchBar(_ searchBar: UISearchBar, textDidChange searchText: String) {
    onSearchTextChange(["text": searchText])
  }

  public func searchBarSearchButtonClicked(_ searchBar: UISearchBar) {
    searchBar.resignFirstResponder()
  }

  public func searchBarTextDidBeginEditing(_ searchBar: UISearchBar) {
    onSearchFocusChange(["isFocused": true])
  }

  public func searchBarTextDidEndEditing(_ searchBar: UISearchBar) {
    onSearchFocusChange(["isFocused": false])
  }

  func setTitleAlignment(_ alignment: String) {
    guard titleAlignment != alignment else {
      return
    }
    titleAlignment = alignment
    updateItems()
    updateTitleMaxWidth()
  }

  func setTitleVisible(_ isVisible: Bool) {
    guard isTitleVisible != isVisible else {
      return
    }
    isTitleVisible = isVisible
    titleView.label.isAccessibilityElement = isVisible

    let alpha: CGFloat = isVisible ? 1 : 0
    guard window != nil else {
      titleView.label.alpha = alpha
      return
    }
    UIView.animate(withDuration: 0.2, delay: 0, options: [.beginFromCurrentState, .allowUserInteraction]) {
      self.titleView.label.alpha = alpha
    }
  }

  func setItems(_ items: [NavigationBarItem], placement: NavigationBarItemPlacement) {
    switch placement {
    case .leading:
      guard leadingItems != items else {
        return
      }
      leadingItems = items
    case .trailing:
      guard trailingItems != items else {
        return
      }
      trailingItems = items
    }
    updateItems()
    updateTitleMaxWidth()
  }

  func setItemColor(_ color: UIColor) {
    bar.tintColor = color
  }

  func setTitleColor(_ color: UIColor) {
    titleView.label.textColor = color
  }

  func setFontFamily(_ family: String?) {
    fontFamily = family
    applyAppearance()
  }

  func setFontSize(_ size: Double) {
    fontSize = CGFloat(size)
    applyAppearance()
  }

  private var isLeading: Bool {
    titleAlignment == "leading"
  }

  private var isSearchEnabled: Bool {
    searchPlaceholder != nil
  }

  private func updateItems() {
    let leadingGroups = makeGroups(leadingItems, placement: .leading)
    let trailingGroups = makeGroups(trailingItems, placement: .trailing)

    var leftItems = barItems(from: leadingGroups)
    if isLeading && !isSearchEnabled {
      leftItems.append(leadingTitleItem)
    }

    if isSearchEnabled {
      item.titleView = searchBar
    } else {
      item.titleView = isLeading ? nil : titleView
    }
    item.leftBarButtonItems = leftItems
    item.rightBarButtonItems = Array(barItems(from: trailingGroups).reversed())
    leadingReservedWidth = reservedWidth(of: leadingGroups)
    trailingReservedWidth = reservedWidth(of: trailingGroups)
  }

  private func updateTitleMaxWidth() {
    let reserved = isLeading
      ? leadingReservedWidth + trailingReservedWidth + 2 * barHorizontalMargin
      : 2 * max(leadingReservedWidth, trailingReservedWidth, barHorizontalMargin)
    titleView.maxWidth = max(0, bounds.width - reserved)
  }

  private func makeGroups(_ items: [NavigationBarItem], placement: NavigationBarItemPlacement) -> [[UIBarButtonItem]] {
    var groups: [[UIBarButtonItem]] = []
    var sharedGroup: [UIBarButtonItem] = []

    for (index, barItem) in items.enumerated() {
      let buttonItem = makeButtonItem(barItem, placement: placement, index: index)
      guard barItem.separated else {
        sharedGroup.append(buttonItem)
        continue
      }
      if !sharedGroup.isEmpty {
        groups.append(sharedGroup)
        sharedGroup = []
      }
      groups.append([buttonItem])
    }
    if !sharedGroup.isEmpty {
      groups.append(sharedGroup)
    }
    return groups
  }

  private func barItems(from groups: [[UIBarButtonItem]]) -> [UIBarButtonItem] {
    var items: [UIBarButtonItem] = []
    for group in groups {
      if #available(iOS 26.0, *), groups.count > 1 {
        if !items.isEmpty {
          items.append(.fixedSpace())
        }
        if group.count == 1 {
          group[0].sharesBackground = false
        }
      }
      items.append(contentsOf: group)
    }
    return items
  }

  private func reservedWidth(of groups: [[UIBarButtonItem]]) -> CGFloat {
    let itemCount = groups.reduce(0) { $0 + $1.count }
    guard itemCount > 0 else {
      return 0
    }
    return barItemReservedWidth
      + CGFloat(itemCount - 1) * barGroupedItemWidth
      + CGFloat(groups.count - 1) * barGroupSpacing
  }

  private func makeButtonItem(
    _ barItem: NavigationBarItem,
    placement: NavigationBarItemPlacement,
    index: Int
  ) -> UIBarButtonItem {
    let primaryAction = UIAction { [weak self] _ in
      self?.onItemPress(["placement": placement.rawValue, "index": index])
    }
    let button: UIBarButtonItem
    switch barItem.type {
    case .close:
      button = UIBarButtonItem(systemItem: .close, primaryAction: primaryAction)
    case .back:
      let image = templateImage(named: barItem.imageName) ?? UIImage(systemName: "chevron.backward")
      button = UIBarButtonItem(image: image, primaryAction: primaryAction)
    case .icon:
      button = UIBarButtonItem(
        title: barItem.label,
        image: templateImage(named: barItem.imageName),
        primaryAction: primaryAction,
        menu: nil
      )
    }
    button.accessibilityLabel = barItem.label
    button.accessibilityIdentifier = barItem.testID
    return button
  }

  private func templateImage(named name: String?) -> UIImage? {
    name.flatMap { UIImage(named: $0) }?.withRenderingMode(.alwaysTemplate)
  }

  private func applyAppearance() {
    let font = fontFamily.flatMap { UIFont(name: $0, size: fontSize) } ?? UIFont.systemFont(ofSize: fontSize, weight: .semibold)
    titleView.label.font = font
    titleView.contentDidChange()

    let appearance = UINavigationBarAppearance()
    appearance.configureWithTransparentBackground()
    bar.standardAppearance = appearance
    bar.compactAppearance = appearance
    bar.scrollEdgeAppearance = appearance
  }
}
