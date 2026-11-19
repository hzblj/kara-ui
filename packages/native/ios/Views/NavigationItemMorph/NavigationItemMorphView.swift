import ExpoModulesCore
import UIKit

/**
 iOS 26: morphs one of the screen's right bar items between its label and an icon, which swapping the items cannot do
 (UIKit only replaces the pill with the circle). Mounted anywhere in the screen's tree (`display: contents`), it finds
 the screen's navigation item and, after every header update that rebuilds the items, replaces the item whose
 `accessibilityIdentifier` is `itemIdentifier` with its own, forwarding a tap to the original's target and action.
 Unmounting puts the original back.
 */
public final class NavigationItemMorphView: ExpoView {
  private static let attachRetryInterval: TimeInterval = 0.1
  private static let attachRetryLimit = 50

  var itemIdentifier = "" {
    didSet {
      guard itemIdentifier != oldValue else {
        return
      }
      button.accessibilityIdentifier = itemIdentifier
      if let navigationItem {
        takeOver(in: navigationItem)
      }
    }
  }

  var label = "" {
    didSet {
      button.label = label
    }
  }

  var imageName = "" {
    didSet {
      button.imageName = imageName
    }
  }

  var itemColor: UIColor = .label {
    didSet {
      button.itemColor = itemColor
    }
  }

  var collapsed = false {
    didSet {
      guard collapsed != oldValue else {
        return
      }
      button.setCollapsed(collapsed, animated: isTakenOver && window != nil)
    }
  }

  private let button = NavigationItemMorphButton()
  private lazy var morphItem = UIBarButtonItem(customView: button)
  private weak var navigationItem: UINavigationItem?
  private weak var originalItem: UIBarButtonItem?
  private var itemsObservation: NSKeyValueObservation?
  private var isReplacing = false
  private var attachAttempts = 0

  private var isTakenOver: Bool {
    navigationItem?.rightBarButtonItems?.contains { $0 === morphItem } ?? false
  }

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    button.onPress = { [weak self] in
      self?.forwardPress()
    }
  }

  public override func didMoveToWindow() {
    super.didMoveToWindow()
    guard window != nil else {
      return
    }
    attachAttempts = 0
    attach()
  }

  public override func didMoveToSuperview() {
    super.didMoveToSuperview()
    if superview == nil {
      detach()
    }
  }

  private func attach() {
    guard #available(iOS 26.0, *) else {
      return
    }
    guard let controller = owningViewController() else {
      retryAttach()
      return
    }
    let item = controller.navigationItem
    if navigationItem !== item {
      itemsObservation = item.observe(\.rightBarButtonItems, options: [.new]) { [weak self] item, _ in
        MainActor.assumeIsolated {
          self?.takeOver(in: item)
        }
      }
      navigationItem = item
    }
    if !takeOver(in: item) {
      retryAttach()
    }
  }

  private func retryAttach() {
    guard attachAttempts < Self.attachRetryLimit else {
      return
    }
    attachAttempts += 1
    DispatchQueue.main.asyncAfter(deadline: .now() + Self.attachRetryInterval) { [weak self] in
      guard let self, self.window != nil, !self.isTakenOver else {
        return
      }
      self.attach()
    }
  }

  @discardableResult
  private func takeOver(in item: UINavigationItem) -> Bool {
    guard !isReplacing, !itemIdentifier.isEmpty, var items = item.rightBarButtonItems else {
      return false
    }
    guard let index = items.firstIndex(where: { $0 !== morphItem && $0.accessibilityIdentifier == itemIdentifier }) else {
      return items.contains { $0 === morphItem }
    }
    let original = items[index]
    originalItem = original
    if #available(iOS 26.0, *) {
      morphItem.sharesBackground = original.sharesBackground
      morphItem.hidesSharedBackground = true
    }
    button.setCollapsed(collapsed, animated: false)
    items[index] = morphItem
    isReplacing = true
    item.rightBarButtonItems = items
    isReplacing = false
    return true
  }

  private func detach() {
    itemsObservation = nil
    defer {
      navigationItem = nil
    }
    guard let item = navigationItem, var items = item.rightBarButtonItems,
      let index = items.firstIndex(where: { $0 === morphItem })
    else {
      return
    }
    if let originalItem {
      items[index] = originalItem
    } else {
      items.remove(at: index)
    }
    isReplacing = true
    item.rightBarButtonItems = items
    isReplacing = false
  }

  private func forwardPress() {
    guard let originalItem, let action = originalItem.action else {
      return
    }
    UIApplication.shared.sendAction(action, to: originalItem.target, from: originalItem, for: nil)
  }

  private func owningViewController() -> UIViewController? {
    var responder: UIResponder? = self
    while let current = responder {
      if let controller = current as? UIViewController {
        return controller
      }
      responder = current.next
    }
    return nil
  }
}
