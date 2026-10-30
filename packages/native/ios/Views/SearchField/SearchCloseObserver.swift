import UIKit

/// Reports a search that closed without its search bar's cancel button: the integrated search's system close only
/// deactivates the controller, so the search bar delegate (react-native-screens, which empties the text and emits
/// `onCancelButtonPress`) never hears of it, and the query stayed. Once an integrated search dismisses, or the
/// controller is no longer active after an editing session, the delegate gets the same `searchBarCancelButtonClicked`
/// the cancel button sends, once per session.
@MainActor
final class SearchCloseObserver: SearchPresentationListener {
  private weak var searchController: UISearchController?
  private weak var relay: SearchPresentationRelay?
  private var activeObservation: NSKeyValueObservation?
  private var endEditingObserver: NSObjectProtocol?
  private var isCloseReported = false

  deinit {
    if let endEditingObserver {
      NotificationCenter.default.removeObserver(endEditingObserver)
    }
  }

  func attach(to searchController: UISearchController) {
    guard self.searchController !== searchController else {
      return
    }
    detach()
    self.searchController = searchController
    isCloseReported = false
    let relay = SearchPresentationRelay.relay(for: searchController)
    relay.add(self)
    self.relay = relay
    activeObservation = searchController.observe(\.isActive, options: [.old, .new]) { [weak self] _, change in
      guard change.oldValue == true, change.newValue == false else {
        return
      }
      DispatchQueue.main.async {
        MainActor.assumeIsolated {
          self?.searchDidClose()
        }
      }
    }
    endEditingObserver = NotificationCenter.default.addObserver(
      forName: UITextField.textDidEndEditingNotification, object: searchController.searchBar.searchTextField, queue: .main
    ) { [weak self] _ in
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.35) {
        MainActor.assumeIsolated {
          guard self?.searchController?.isActive == false else {
            return
          }
          self?.searchDidClose()
        }
      }
    }
  }

  func detach() {
    if let endEditingObserver {
      NotificationCenter.default.removeObserver(endEditingObserver)
    }
    endEditingObserver = nil
    activeObservation = nil
    relay?.remove(self)
    relay = nil
    searchController = nil
  }

  func searchWillPresent() {
    isCloseReported = false
  }

  func searchWillDismiss() {
    guard isIntegratedButton else {
      return
    }
    DispatchQueue.main.async { [weak self] in
      MainActor.assumeIsolated {
        self?.searchDidClose()
      }
    }
  }

  private var isIntegratedButton: Bool {
    guard #available(iOS 26.0, *), let searchController else {
      return false
    }
    return searchController.searchBarPlacement == .integratedButton
  }

  private func searchDidClose() {
    guard !isCloseReported, let searchBar = searchController?.searchBar else {
      return
    }
    isCloseReported = true
    searchBar.delegate?.searchBarCancelButtonClicked?(searchBar)
  }
}
