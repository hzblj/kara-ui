import ExpoModulesCore
import UIKit

/**
 A standalone `UINavigationBar` with one item: the back chevron and the system `.close`
 are `UIBarButtonItem`s, so inside a sheet that is not a navigation screen they press
 and render exactly like the bar items of a native-stack header. Standalone SwiftUI or
 UIKit glass buttons do not: iOS 26 gives them interactive glass that swells toward the
 finger, while bar items share the bar's glass.

 `backTestID` / `closeTestID` become the items' `accessibilityIdentifier`, which is what
 UI test tools match an `id` against.
 */
public final class NavigationBarView: ExpoView {
  let onBack = EventDispatcher()
  let onClose = EventDispatcher()

  private let bar = UINavigationBar()
  private let item = UINavigationItem()

  private var showsBack = false
  private var showsClose = false
  private var backLabel: String?
  private var closeLabel: String?
  private var backTestID: String?
  private var closeTestID: String?
  private var titleColor: UIColor = .label
  private var fontFamily: String?
  private var fontSize: CGFloat = UIFont.labelFontSize

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    bar.prefersLargeTitles = false
    bar.setItems([item], animated: false)
    addSubview(bar)
    applyAppearance()
  }

  public override func layoutSubviews() {
    super.layoutSubviews()
    let height = min(bar.sizeThatFits(bounds.size).height, bounds.height)
    bar.frame = CGRect(x: 0, y: (bounds.height - height) / 2, width: bounds.width, height: height)
  }

  func setTitle(_ title: String?) {
    item.title = title
  }

  func setShowsBack(_ showsBack: Bool) {
    self.showsBack = showsBack
    updateItems()
  }

  func setShowsClose(_ showsClose: Bool) {
    self.showsClose = showsClose
    updateItems()
  }

  func setBackLabel(_ label: String?) {
    backLabel = label
    updateItems()
  }

  func setCloseLabel(_ label: String?) {
    closeLabel = label
    updateItems()
  }

  func setBackTestID(_ testID: String?) {
    backTestID = testID
    updateItems()
  }

  func setCloseTestID(_ testID: String?) {
    closeTestID = testID
    updateItems()
  }

  func setItemColor(_ color: UIColor) {
    bar.tintColor = color
  }

  func setTitleColor(_ color: UIColor) {
    titleColor = color
    applyAppearance()
  }

  func setFontFamily(_ family: String?) {
    fontFamily = family
    applyAppearance()
  }

  func setFontSize(_ size: Double) {
    fontSize = CGFloat(size)
    applyAppearance()
  }

  private func updateItems() {
    item.leftBarButtonItem = showsBack ? makeBackItem() : nil
    item.rightBarButtonItem = showsClose ? makeCloseItem() : nil
  }

  private func makeBackItem() -> UIBarButtonItem {
    let action = UIAction { [weak self] _ in
      self?.onBack([:])
    }
    let button = UIBarButtonItem(image: UIImage(systemName: "chevron.left"), primaryAction: action)
    button.accessibilityLabel = backLabel
    button.accessibilityIdentifier = backTestID
    return button
  }

  private func makeCloseItem() -> UIBarButtonItem {
    let action = UIAction { [weak self] _ in
      self?.onClose([:])
    }
    let button = UIBarButtonItem(systemItem: .close, primaryAction: action)
    button.accessibilityLabel = closeLabel
    button.accessibilityIdentifier = closeTestID
    return button
  }

  private func applyAppearance() {
    let font = fontFamily.flatMap { UIFont(name: $0, size: fontSize) } ?? UIFont.systemFont(ofSize: fontSize, weight: .semibold)
    let appearance = UINavigationBarAppearance()
    appearance.configureWithTransparentBackground()
    appearance.titleTextAttributes = [.font: font, .foregroundColor: titleColor]
    bar.standardAppearance = appearance
    bar.compactAppearance = appearance
    bar.scrollEdgeAppearance = appearance
  }
}
