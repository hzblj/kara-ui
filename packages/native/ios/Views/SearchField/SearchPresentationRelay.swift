import UIKit

/// Hears when the screen's header search is about to present or dismiss.
@MainActor
protocol SearchPresentationListener: AnyObject {
  func searchWillPresent()
  func searchWillDismiss()
}

/// The search controller's delegate, one per controller and kept on it, forwarding to every listener. UIKit presents and
/// dismisses a header search without `setActive(_:)` when the field is tapped or the cancel button pressed, so KVO on
/// `isActive` hears nothing then; the delegate's `will…` calls come in the same turn as the bar transition starts.
/// react-native-screens sets no delegate, so anything else that needs it joins as a listener.
@MainActor
final class SearchPresentationRelay: NSObject, UISearchControllerDelegate {
  private static var relayKey: UInt8 = 0

  private let listeners = NSHashTable<AnyObject>.weakObjects()

  static func relay(for searchController: UISearchController) -> SearchPresentationRelay {
    if let relay = objc_getAssociatedObject(searchController, &relayKey) as? SearchPresentationRelay {
      return relay
    }
    let relay = SearchPresentationRelay()
    objc_setAssociatedObject(searchController, &relayKey, relay, .OBJC_ASSOCIATION_RETAIN_NONATOMIC)
    searchController.delegate = relay
    return relay
  }

  func add(_ listener: SearchPresentationListener) {
    listeners.add(listener)
  }

  func remove(_ listener: SearchPresentationListener) {
    listeners.remove(listener)
  }

  func willPresentSearchController(_ searchController: UISearchController) {
    for listener in currentListeners() {
      listener.searchWillPresent()
    }
  }

  func willDismissSearchController(_ searchController: UISearchController) {
    for listener in currentListeners() {
      listener.searchWillDismiss()
    }
  }

  private func currentListeners() -> [SearchPresentationListener] {
    listeners.allObjects.compactMap { $0 as? SearchPresentationListener }
  }
}
