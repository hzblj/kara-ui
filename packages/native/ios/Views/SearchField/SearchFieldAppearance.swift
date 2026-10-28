import UIKit

/**
 The app's own glyphs on a search bar: `clearImageName` for the field's clear button, `cancelImageName` for iOS 26's
 cancel circle beside the field.

 That cancel is a `UIButton` with a `UIButton.Configuration` and no public API, so this takes the first `UIButton` of
 the search bar outside its text field and sets the image from a `configurationUpdateHandler` (UIKit sets none there),
 again on every begin editing, since the button may appear only then. Older iOS has a text cancel button (no
 configuration image) and keeps it.

 The integrated search's close (`integratedButton`) is another thing: a system `.close` bar item beside the field, which
 takes no image and gets its `xmark` back on every update. No public API replaces it while the field is focused, and
 swapping its glyph showed through during the morph, so it stays the system's.
 */
final class SearchFieldAppearance {
  var clearImageName: String? {
    didSet {
      guard clearImageName != oldValue else {
        return
      }
      applyClearImage()
    }
  }

  var cancelImageName: String? {
    didSet {
      guard cancelImageName != oldValue else {
        return
      }
      applyCancelImage()
    }
  }

  var clearColor: UIColor = .secondaryLabel {
    didSet {
      applyClearImage()
    }
  }

  private weak var searchBar: UISearchBar?
  private weak var cancelButton: UIButton?
  private var editingObserver: NSObjectProtocol?

  deinit {
    if let editingObserver {
      NotificationCenter.default.removeObserver(editingObserver)
    }
  }

  func attach(to searchBar: UISearchBar) {
    guard self.searchBar !== searchBar else {
      return
    }
    detach()
    self.searchBar = searchBar
    editingObserver = NotificationCenter.default.addObserver(
      forName: UITextField.textDidBeginEditingNotification, object: searchBar.searchTextField, queue: .main
    ) { [weak self] _ in
      DispatchQueue.main.async {
        self?.applyCancelImage()
      }
    }
    applyClearImage()
    applyCancelImage()
  }

  func detach() {
    guard let searchBar else {
      return
    }
    if let editingObserver {
      NotificationCenter.default.removeObserver(editingObserver)
    }
    editingObserver = nil
    if clearImageName != nil {
      searchBar.setImage(nil, for: .clear, state: .normal)
    }
    resetCancelButton()
    self.searchBar = nil
  }

  private func applyClearImage() {
    guard let searchBar else {
      return
    }
    let image = clearImageName.flatMap { UIImage(named: $0) }
    searchBar.setImage(image?.withTintColor(clearColor, renderingMode: .alwaysOriginal), for: .clear, state: .normal)
  }

  private func applyCancelImage() {
    guard let searchBar else {
      return
    }
    guard let image = cancelImageName.flatMap({ UIImage(named: $0)?.withRenderingMode(.alwaysTemplate) }) else {
      resetCancelButton()
      return
    }
    guard let button = findCancelButton(in: searchBar), button.configuration?.image != nil else {
      return
    }
    cancelButton = button
    button.configurationUpdateHandler = { button in
      guard var configuration = button.configuration, configuration.image !== image else {
        return
      }
      configuration.image = image
      button.configuration = configuration
    }
    button.setNeedsUpdateConfiguration()
  }

  private func resetCancelButton() {
    guard let cancelButton else {
      return
    }
    cancelButton.configurationUpdateHandler = nil
    cancelButton.configuration?.image = UIImage(systemName: "xmark")
    self.cancelButton = nil
  }

  private func findCancelButton(in searchBar: UISearchBar) -> UIButton? {
    var views: [UIView] = [searchBar]
    while !views.isEmpty {
      let view = views.removeFirst()
      if let button = view as? UIButton {
        return button
      }
      views.append(contentsOf: view.subviews.filter { $0 !== searchBar.searchTextField })
    }
    return nil
  }
}
