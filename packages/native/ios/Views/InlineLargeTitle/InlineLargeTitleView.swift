import ExpoModulesCore
import UIKit

/// Keeps its screen's large title inline: on the leading side of the bar row, level with the bar items, the way the
/// Apple TV app's tabs have it (`UINavigationItem.LargeTitleDisplayMode.inline`, iOS 17). UIKit still collapses it
/// into the small title while the content scrolls under the bar.
///
/// react-native-screens knows only `.always` and `.never` and writes the mode on every header update, so the view
/// watches the property and turns each `.always` into `.inline` in the same call, before the bar lays out. The screen
/// needs `headerLargeTitleEnabled`, which sets `prefersLargeTitles` and the large title's font. A layout-less view
/// (`display: contents`) anywhere in the screen's tree; unmounting puts `.always` back. Earlier iOS ignores it.
public final class InlineLargeTitleView: ExpoView {
  private static let attachAttempts = 10

  private weak var navigationItem: UINavigationItem?
  private var displayModeObservation: NSKeyValueObservation?

  public override func didMoveToSuperview() {
    super.didMoveToSuperview()
    guard superview != nil else {
      reset()
      return
    }
    attach()
  }

  public override func didMoveToWindow() {
    super.didMoveToWindow()
    attach()
  }

  /// The screen's controller is the first one up the responder chain, which reaches it only once Fabric has mounted
  /// the whole branch, so the first attach is retried for a moment.
  private func attach(attempt: Int = 0) {
    guard #available(iOS 17.0, *), superview != nil else {
      return
    }
    guard let item = owningViewController()?.navigationItem else {
      guard attempt < Self.attachAttempts else {
        return
      }
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.05 * Double(attempt + 1)) { [weak self] in
        self?.attach(attempt: attempt + 1)
      }
      return
    }
    guard item !== navigationItem else {
      return
    }
    reset()
    navigationItem = item
    Self.makeInline(item)
    displayModeObservation = item.observe(\.largeTitleDisplayMode) { item, _ in
      MainActor.assumeIsolated {
        Self.makeInline(item)
      }
    }
  }

  /// Leaves `.never` alone: a screen that turns its large title off keeps it off.
  private static func makeInline(_ item: UINavigationItem) {
    guard #available(iOS 17.0, *), item.largeTitleDisplayMode == .always else {
      return
    }
    item.largeTitleDisplayMode = .inline
  }

  private func reset() {
    displayModeObservation = nil
    guard #available(iOS 17.0, *), let item = navigationItem else {
      return
    }
    navigationItem = nil
    if item.largeTitleDisplayMode == .inline {
      item.largeTitleDisplayMode = .always
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
