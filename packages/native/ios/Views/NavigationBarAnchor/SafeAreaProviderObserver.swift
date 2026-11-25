import UIKit

/**
 Follows the safe area of the nearest react-native-screens screen view above a view (the first superview that answers
 `providerSafeAreaInsets`, an `RNSScreenView`) through its `RNSSafeAreaDidChange` notification, observed without a
 queue, so `onChange` runs in the call that changed the inset: inside UIKit's layout pass, and inside the bar's animation
 when the header search opens or closes. `topInset` is that screen's top safe area (the status bar, the navigation bar
 and its search field), unrounded.

 react-native-screens' own `SafeAreaView` takes the same value through a Fabric commit, where Yoga rounds it to pixels
 and ignores changes up to 1 px, and lands it frames later than the bar.
 */
@MainActor
final class SafeAreaProviderObserver {
  private static let providerSelector = NSSelectorFromString("providerSafeAreaInsets")
  private static let changeNotification = Notification.Name("RNSSafeAreaDidChange")

  var onChange: (() -> Void)?

  private weak var provider: UIView?
  private var observer: NSObjectProtocol?

  var topInset: CGFloat? {
    provider?.safeAreaInsets.top
  }

  deinit {
    if let observer {
      NotificationCenter.default.removeObserver(observer)
    }
  }

  func attach(from view: UIView) {
    let nearestProvider = Self.nearestProvider(above: view)
    guard nearestProvider !== provider || observer == nil else {
      return
    }
    detach()
    guard let nearestProvider else {
      return
    }
    provider = nearestProvider
    observer = NotificationCenter.default.addObserver(
      forName: Self.changeNotification, object: nearestProvider, queue: nil
    ) { [weak self] _ in
      MainActor.assumeIsolated {
        self?.onChange?()
      }
    }
  }

  func detach() {
    if let observer {
      NotificationCenter.default.removeObserver(observer)
    }
    observer = nil
    provider = nil
  }

  private static func nearestProvider(above view: UIView) -> UIView? {
    var current = view.superview
    while let candidate = current {
      if candidate.responds(to: providerSelector) {
        return candidate
      }
      current = candidate.superview
    }
    return nil
  }
}
