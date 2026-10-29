import UIKit

/**
 Hides the field's magnifier and the voice accessory while an integrated search button (`integratedButton`) closes.

 UIKit shows the collapsed field's content again for a few frames right before the bar swaps the field for its button,
 so both flashed sharp in the empty circle and blurred away under the button's glyph (UIKit's grey magnifier hides it in
 a plain app, a tinted search bar made it black). They fade out with the placeholder when the search dismisses and come
 back when it presents again. Other placements keep their field on screen and are left alone.
 */
@MainActor
final class IntegratedSearchCollapseFade: SearchPresentationListener {
  private static let fadeDuration: TimeInterval = 0.15

  private let accessory: SearchFieldAccessory
  private weak var searchController: UISearchController?
  private weak var relay: SearchPresentationRelay?
  private var generation = 0

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
    showContent()
    searchController = nil
  }

  func searchWillPresent() {
    showContent()
  }

  func searchWillDismiss() {
    guard isIntegratedButton, let magnifier = searchController?.searchBar.searchTextField.leftView else {
      return
    }
    generation += 1
    let current = generation
    accessory.setContentHidden(true, isAnimated: true)
    UIView.animate(
      withDuration: Self.fadeDuration,
      delay: 0,
      options: [.beginFromCurrentState, .overrideInheritedDuration, .overrideInheritedCurve]
    ) {
      magnifier.alpha = 0
    } completion: { [weak self] _ in
      if self?.generation == current {
        magnifier.isHidden = true
      }
    }
  }

  private var isIntegratedButton: Bool {
    guard #available(iOS 26.0, *), let searchController else {
      return false
    }
    return searchController.searchBarPlacement == .integratedButton
  }

  private func showContent() {
    generation += 1
    if let magnifier = searchController?.searchBar.searchTextField.leftView {
      magnifier.isHidden = false
      magnifier.alpha = 1
    }
    accessory.setContentHidden(false, isAnimated: false)
  }
}
