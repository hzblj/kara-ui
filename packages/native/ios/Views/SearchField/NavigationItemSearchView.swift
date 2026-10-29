import ExpoModulesCore
import UIKit

/**
 A layout-less view (`display: contents`, `disableForceFlatten`) inside a native-stack screen that dresses the search
 controller react-native-screens puts on that screen's `UINavigationItem`: the app's clear and cancel glyphs
 (`SearchFieldAppearance`), the voice accessory (`SearchFieldAccessory`), the reset of a search that the integrated
 search's system close ended without telling the search bar's delegate (`SearchCloseObserver`) and the fade of the
 field's content while an integrated search button closes (`IntegratedSearchCollapseFade`).

 It finds the item through the responder chain, so it must sit in the screen's tree. react-native-screens sets the
 controller after the screen mounts, so the first attach is retried for about 5 s.
 */
public final class NavigationItemSearchView: ExpoView {
  private static let attachAttempts = 10

  let onVoiceAction = EventDispatcher()
  let accessory = SearchFieldAccessory()
  let appearance = SearchFieldAppearance()
  private let closeObserver = SearchCloseObserver()
  private lazy var collapseFade = IntegratedSearchCollapseFade(accessory: accessory)
  private var isVoiceEnabled = false

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    accessory.onAction = { [weak self] action in
      self?.onVoiceAction(["action": action.rawValue])
    }
  }

  func setVoice(_ record: SearchVoiceRecord?) {
    let record = record ?? SearchVoiceRecord()
    isVoiceEnabled = record.enabled
    accessory.apply(record)
    if !isVoiceEnabled {
      accessory.detach()
    }
    attach()
  }

  public override func didMoveToWindow() {
    super.didMoveToWindow()
    guard window != nil else {
      accessory.detach()
      appearance.detach()
      closeObserver.detach()
      collapseFade.detach()
      return
    }
    attach()
  }

  private func attach(attempt: Int = 0) {
    guard window != nil else {
      return
    }
    if let searchController = owningViewController()?.navigationItem.searchController {
      if isVoiceEnabled {
        accessory.attach(to: searchController.searchBar)
      }
      appearance.attach(to: searchController.searchBar)
      closeObserver.attach(to: searchController)
      collapseFade.attach(to: searchController)
      return
    }
    guard attempt < Self.attachAttempts else {
      return
    }
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.1 * Double(attempt + 1)) { [weak self] in
      self?.attach(attempt: attempt + 1)
    }
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
