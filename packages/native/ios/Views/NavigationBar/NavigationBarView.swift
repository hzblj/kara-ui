import ExpoModulesCore
import UIKit

private let barItemReservedWidth: CGFloat = 56
private let barGroupedItemWidth: CGFloat = 44
private let barGroupSpacing: CGFloat = 8
private let barHorizontalMargin: CGFloat = 16
private let searchBarRowHeight: CGFloat = 52
private let barItemRowHeight: CGFloat = 44
private let barItemSize: CGFloat = 44
private let searchCancelSpacing: CGFloat = 8

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
 items on both sides.

 A search placeholder adds a `UISearchBar`, placed the way a native-stack header places its search controller:
 `stacked` (the default) in a row of its own under the title, `integratedButton` as a search item beside the trailing
 items that turns the whole bar into the field. A focused field gets a cancel item next to it, a bar item like the
 others, so `searchCancelImageName` can give it the app's own glyph.

 An item's `testID` becomes its `accessibilityIdentifier`, which is what UI test tools match an `id` against.
 */
public final class NavigationBarView: ExpoView, UISearchBarDelegate {
  let onItemPress = EventDispatcher()
  let onSearchTextChange = EventDispatcher()
  let onSearchFocusChange = EventDispatcher()
  let onSearchVoiceAction = EventDispatcher()
  private lazy var searchVoice: SearchFieldAccessory = {
    let accessory = SearchFieldAccessory()
    accessory.onAction = { [weak self] action in
      self?.onSearchVoiceAction(["action": action.rawValue])
    }
    return accessory
  }()
  private let searchAppearance = SearchFieldAppearance()

  private let bar = UINavigationBar()
  private let item = UINavigationItem()
  private let searchRowBar = UINavigationBar()
  private let searchRowItem = UINavigationItem()
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
  private lazy var searchCancelItem = UIBarButtonItem(
    image: UIImage(systemName: "xmark"),
    primaryAction: UIAction { [weak self] _ in self?.cancelSearch() }
  )
  private lazy var searchButtonItem = UIBarButtonItem(
    image: UIImage(systemName: "magnifyingglass"),
    primaryAction: UIAction { [weak self] _ in self?.beginIntegratedSearch() }
  )
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
  private var searchPlacement = "stacked"
  private var isSearchModeActive = false
  private var isSearchCancelShown = false
  private var searchFieldInsets: UIEdgeInsets?
  private var fontFamily: String?
  private var fontSize: CGFloat = UIFont.labelFontSize

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    bar.prefersLargeTitles = false
    titleView.label.textColor = .label
    bar.setItems([item], animated: false)
    addSubview(bar)
    searchRowBar.prefersLargeTitles = false
    searchRowBar.setItems([searchRowItem], animated: false)
    applyAppearance()
    updateItems()
  }

  public override func layoutSubviews() {
    super.layoutSubviews()
    let searchRowHeight = isStackedSearch ? searchBarRowHeight : 0
    let barArea = CGRect(x: 0, y: 0, width: bounds.width, height: max(0, bounds.height - searchRowHeight))
    layout(bar, in: barArea)
    if isStackedSearch {
      let searchArea = CGRect(x: 0, y: barArea.maxY, width: bounds.width, height: searchRowHeight)
      layout(searchRowBar, in: searchArea)
      layoutSearchField(centeredAt: searchArea.midY, isCancelShown: isSearchCancelShown)
    } else if isSearchModeActive {
      layoutSearchField(centeredAt: barArea.midY, isCancelShown: true)
    }
    updateTitleMaxWidth()
  }

  /// iOS 26's bar is 54 pt with its 44 pt row of glass items at the top, so centring the bar left the title and the
  /// items 5 pt high. It is the row that goes in the middle of the area: the bar's top sits half a row above its
  /// centre (below iOS 26 the bar is the row). What of the bar overhangs then is its empty, transparent bottom. The row
  /// used to be found by its glass platters' class name, which iOS 27 renamed; its height needs no lookup.
  private func layout(_ navigationBar: UINavigationBar, in area: CGRect) {
    let height = navigationBar.sizeThatFits(area.size).height
    navigationBar.frame = CGRect(
      x: 0,
      y: area.midY - min(barItemRowHeight, height) / 2,
      width: area.width,
      height: height
    )
  }

  /// The search bar is laid out here, not as a bar's `titleView`: UIKit centres a search bar there in the whole 54 pt
  /// bar, 5 pt below the items, and neither `searchFieldBackgroundPositionAdjustment`, a 44 pt bar nor a transform
  /// moved it reliably. Its field runs from the bar's margin to the trailing margin, or to just before the cancel item,
  /// centred on the item row.
  private func layoutSearchField(centeredAt midY: CGFloat, isCancelShown: Bool) {
    guard let insets = measuredSearchFieldInsets() else {
      return
    }
    let trailingInset = barHorizontalMargin + (isCancelShown ? barItemSize + searchCancelSpacing : 0)
    let fieldWidth = max(0, bounds.width - barHorizontalMargin - trailingInset)
    let fieldHeight = searchBar.bounds.height - insets.top - insets.bottom
    searchBar.frame = CGRect(
      x: barHorizontalMargin - insets.left,
      y: midY - insets.top - fieldHeight / 2,
      width: fieldWidth + insets.left + insets.right,
      height: searchBar.bounds.height
    )
  }

  /// Where the field sits inside its search bar, measured once: the frame is then sized so the field itself lands on
  /// the margins, whatever insets the system gives it.
  private func measuredSearchFieldInsets() -> UIEdgeInsets? {
    if let searchFieldInsets {
      return searchFieldInsets
    }
    guard bounds.width > 0 else {
      return nil
    }
    let height = searchBar.sizeThatFits(CGSize(width: bounds.width, height: .greatestFiniteMagnitude)).height
    searchBar.frame = CGRect(x: 0, y: 0, width: bounds.width, height: height)
    searchBar.layoutIfNeeded()
    let field = searchBar.searchTextField.convert(searchBar.searchTextField.bounds, to: searchBar)
    guard field.width > 0, field.height > 0 else {
      return nil
    }
    let insets = UIEdgeInsets(
      top: field.minY,
      left: field.minX,
      bottom: height - field.maxY,
      right: bounds.width - field.maxX
    )
    searchFieldInsets = insets
    return insets
  }

  func setTitle(_ title: String?) {
    titleView.label.text = title
    titleView.label.accessibilityLabel = title
    titleView.contentDidChange()
    if !isLeading && !isSearchModeActive {
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
      updateSearchPlacement()
    }
  }

  func setSearchPlacement(_ placement: String) {
    guard searchPlacement != placement else {
      return
    }
    searchPlacement = placement
    updateSearchPlacement()
  }

  func setSearchButtonImageName(_ name: String?) {
    searchButtonItem.image = templateImage(named: name) ?? UIImage(systemName: "magnifyingglass")
  }

  func setSearchButtonLabel(_ label: String?) {
    searchButtonItem.accessibilityLabel = label
  }

  func setSearchCancelImageName(_ name: String?) {
    searchCancelItem.image = templateImage(named: name) ?? UIImage(systemName: "xmark")
  }

  func setSearchCancelLabel(_ label: String?) {
    searchCancelItem.accessibilityLabel = label
  }

  func setSearchClearImageName(_ name: String?) {
    searchAppearance.clearImageName = name
    searchAppearance.attach(to: searchBar)
  }

  /// The voice of the search field (`SearchFieldAccessory`): a microphone, a clear button in its place once there is
  /// text, and a waveform with a stop while listening. Off, the field keeps UIKit's own clear button.
  func setSearchVoice(_ record: SearchVoiceRecord?) {
    let record = record ?? SearchVoiceRecord()
    searchVoice.apply(record)
    guard record.enabled else {
      searchVoice.detach()
      return
    }
    searchVoice.attach(to: searchBar)
  }

  func setSearchVoiceMeter(_ meter: AnyObject?) {
    searchVoice.meter = meter
  }

  /// Sets the field's text without a delegate call, the way dictation fills it in.
  func setSearchText(_ text: String) {
    searchBar.text = text
    searchVoice.refresh()
  }

  func setSearchTestID(_ testID: String?) {
    searchBar.searchTextField.accessibilityIdentifier = testID
  }

  func clearSearchText() {
    searchBar.text = nil
    searchVoice.refresh()
    searchBar.resignFirstResponder()
    endIntegratedSearch()
  }

  private func updateSearchPlacement() {
    if !isIntegratedSearch {
      isSearchModeActive = false
    }
    if !isStackedSearch {
      isSearchCancelShown = false
      searchRowItem.rightBarButtonItem = nil
    }
    updateItems()
    if isStackedSearch, searchRowBar.superview == nil {
      addSubview(searchRowBar)
    } else if !isStackedSearch {
      searchRowBar.removeFromSuperview()
    }
    updateSearchFieldVisibility()
    setNeedsLayout()
  }

  private func updateSearchFieldVisibility() {
    guard isStackedSearch || isSearchModeActive else {
      searchBar.removeFromSuperview()
      return
    }
    if searchBar.superview !== self {
      addSubview(searchBar)
    }
    bringSubviewToFront(searchBar)
  }

  /// `integratedButton`: the search item cross-dissolves the bar into the field with the cancel item as its only item.
  /// Cancelling, `clearSearchText()` or ending editing with an empty field brings the title and items back.
  /// `UISearchController`'s own placement needs a `UINavigationController`, which a standalone bar does not have.
  private func beginIntegratedSearch() {
    guard isIntegratedSearch, !isSearchModeActive else {
      return
    }
    isSearchModeActive = true
    transitionSearchMode()
    searchBar.becomeFirstResponder()
  }

  private func endIntegratedSearch() {
    guard isSearchModeActive else {
      return
    }
    isSearchModeActive = false
    transitionSearchMode()
  }

  private func transitionSearchMode() {
    let update = {
      self.updateItems()
      self.updateSearchFieldVisibility()
      self.setNeedsLayout()
      self.layoutIfNeeded()
    }
    guard window != nil else {
      update()
      return
    }
    UIView.transition(with: self, duration: 0.3, options: [.transitionCrossDissolve, .allowUserInteraction], animations: update)
  }

  private func setSearchCancelShown(_ isShown: Bool) {
    guard isStackedSearch, isSearchCancelShown != isShown else {
      return
    }
    isSearchCancelShown = isShown
    searchRowItem.setRightBarButton(isShown ? searchCancelItem : nil, animated: true)
    UIView.animate(withDuration: 0.3, delay: 0, options: [.beginFromCurrentState, .allowUserInteraction]) {
      self.setNeedsLayout()
      self.layoutIfNeeded()
    }
  }

  public func searchBar(_ searchBar: UISearchBar, textDidChange searchText: String) {
    onSearchTextChange(["text": searchText])
  }

  public func searchBarSearchButtonClicked(_ searchBar: UISearchBar) {
    searchBar.resignFirstResponder()
  }

  /// A programmatic text change sends no delegate call, so the emptied text is reported here.
  private func cancelSearch() {
    if searchBar.text?.isEmpty == false {
      searchBar.text = nil
      onSearchTextChange(["text": ""])
    }
    searchBar.resignFirstResponder()
    endIntegratedSearch()
  }

  public func searchBarTextDidBeginEditing(_ searchBar: UISearchBar) {
    setSearchCancelShown(true)
    onSearchFocusChange(["isFocused": true])
  }

  public func searchBarTextDidEndEditing(_ searchBar: UISearchBar) {
    setSearchCancelShown(false)
    if searchBar.text?.isEmpty != false {
      endIntegratedSearch()
    }
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
    searchRowBar.tintColor = color
    searchBar.tintColor = color
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

  private var isStackedSearch: Bool {
    isSearchEnabled && searchPlacement != "integratedButton"
  }

  private var isIntegratedSearch: Bool {
    isSearchEnabled && searchPlacement == "integratedButton"
  }

  private func updateItems() {
    let leadingGroups = makeGroups(leadingItems, placement: .leading)
    var trailingGroups = makeGroups(trailingItems, placement: .trailing)
    if isIntegratedSearch {
      trailingGroups.insert([searchButtonItem], at: 0)
    }
    leadingReservedWidth = reservedWidth(of: leadingGroups)
    trailingReservedWidth = reservedWidth(of: trailingGroups)

    if isSearchModeActive {
      item.titleView = nil
      item.leftBarButtonItems = []
      item.rightBarButtonItems = [searchCancelItem]
      return
    }

    var leftItems = barItems(from: leadingGroups)
    if isLeading {
      leftItems.append(leadingTitleItem)
    }

    item.titleView = isLeading ? nil : titleView
    item.leftBarButtonItems = leftItems
    item.rightBarButtonItems = Array(barItems(from: trailingGroups).reversed())
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
      if let image = templateImage(named: barItem.imageName) {
        button = UIBarButtonItem(image: image, primaryAction: primaryAction)
      } else {
        button = UIBarButtonItem(systemItem: .close, primaryAction: primaryAction)
      }
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
    for navigationBar in [bar, searchRowBar] {
      navigationBar.standardAppearance = appearance
      navigationBar.compactAppearance = appearance
      navigationBar.scrollEdgeAppearance = appearance
    }
  }
}
