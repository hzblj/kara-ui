import UIKit

/**
 Ends the voice accessory's listening look as soon as the search starts to close.

 The meter and the stop button then fade into the microphone inside UIKit's own dismissal; waiting for the app's
 `listening` through JS dropped them only after the bar had landed, a jump of its own. If the app is still listening
 when the search opens again, the listening look comes back.
 */
@MainActor
final class SearchVoiceDismissal: SearchPresentationListener {
  private let accessory: SearchFieldAccessory
  private weak var searchController: UISearchController?
  private weak var relay: SearchPresentationRelay?

  init(accessory: SearchFieldAccessory) {
    self.accessory = accessory
  }

  func attach(to searchController: UISearchController) {
    guard self.searchController !== searchController else {
      return
    }
    detach()
    self.searchController = searchController
    let relay = SearchPresentationRelay.relay(for: searchController)
    relay.add(self)
    self.relay = relay
  }

  func detach() {
    relay?.remove(self)
    relay = nil
    searchController = nil
  }

  func searchWillPresent() {
    accessory.resumeListening()
  }

  func searchWillDismiss() {
    accessory.endListening()
  }
}
