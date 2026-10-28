import UIKit

/// Reports a search that closed without its search bar's cancel button: the integrated search's system close only
/// deactivates the controller, so the search bar delegate (react-native-screens, which empties the text and emits
/// `onCancelButtonPress`) never hears of it, and the query stayed. Once the controller is no longer active after an
/// editing session, the delegate gets the same `searchBarCancelButtonClicked` the cancel button sends.
final class SearchCloseObserver {
  private weak var searchController: UISearchController?
  private var activeObservation: NSKeyValueObservation?
  private var endEditingObserver: NSObjectProtocol?

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
    activeObservation = searchController.observe(\.isActive, options: [.old, .new]) { [weak self] _, change in
      guard change.oldValue == true, change.newValue == false else {
        return
      }
      DispatchQueue.main.async {
        self?.searchDidClose()
      }
    }
    endEditingObserver = NotificationCenter.default.addObserver(
      forName: UITextField.textDidEndEditingNotification, object: searchController.searchBar.searchTextField, queue: .main
    ) { [weak self] _ in
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.35) {
        guard self?.searchController?.isActive == false else {
          return
        }
        self?.searchDidClose()
      }
    }
  }

  func detach() {
    if let endEditingObserver {
      NotificationCenter.default.removeObserver(endEditingObserver)
    }
    endEditingObserver = nil
    activeObservation = nil
    searchController = nil
  }

  private func searchDidClose() {
    guard let searchBar = searchController?.searchBar else {
      return
    }
    searchBar.delegate?.searchBarCancelButtonClicked?(searchBar)
  }
}
