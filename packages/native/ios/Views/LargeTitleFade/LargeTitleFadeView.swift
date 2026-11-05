import ExpoModulesCore
import UIKit

/// Content under a native header that leaves and comes back with the large title when the header search takes it
/// away: out as fast as UIKit drops the title, back while it returns. It starts in the same frame as UIKit's own
/// animation, which a fade started from JavaScript misses by several frames. While hidden it takes no touches and
/// VoiceOver skips it.
///
/// The fade runs on an inner container that the React Native children mount into, never on the view's own `alpha`:
/// React Native owns the component view's `layer.opacity` and writes it back from props in `invalidateLayer` after
/// every layout change of the view (and on a light/dark change), which brought the content back at full opacity
/// under an open search as soon as its frame moved.
public final class LargeTitleFadeView: ExpoView, SearchPresentationListener {
  private static let attachAttempts = 10
  private static let hideDuration: TimeInterval = 0.08
  private static let showDuration: TimeInterval = 0.25

  private let contentView = LargeTitleFadeContentView()
  private weak var relay: SearchPresentationRelay?

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    contentView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    addSubview(contentView)
  }

  public override func layoutSubviews() {
    super.layoutSubviews()
    contentView.frame = bounds
  }

  public override func mountChildComponentView(_ childComponentView: UIView, index: Int) {
    contentView.insertSubview(childComponentView, at: index)
  }

  public override func unmountChildComponentView(_ childComponentView: UIView, index: Int) {
    childComponentView.removeFromSuperview()
  }

  public override func didMoveToWindow() {
    super.didMoveToWindow()
    guard window != nil else {
      relay?.remove(self)
      relay = nil
      return
    }
    attach()
  }

  func searchWillPresent() {
    applySearching(true, isAnimated: true)
  }

  func searchWillDismiss() {
    applySearching(false, isAnimated: true)
  }

  private func applySearching(_ isSearching: Bool, isAnimated: Bool) {
    isUserInteractionEnabled = !isSearching
    contentView.isUserInteractionEnabled = !isSearching
    contentView.accessibilityElementsHidden = isSearching
    let alpha: CGFloat = isSearching ? 0 : 1
    guard isAnimated else {
      contentView.alpha = alpha
      return
    }
    let curve: UIView.AnimationOptions = isSearching ? .curveEaseOut : .curveEaseInOut
    UIView.animate(
      withDuration: isSearching ? Self.hideDuration : Self.showDuration,
      delay: 0,
      options: [.beginFromCurrentState, .overrideInheritedDuration, .overrideInheritedCurve, curve]
    ) {
      self.contentView.alpha = alpha
    }
  }

  /// react-native-screens sets the search controller after the screen mounts, so the first attach is retried.
  private func attach(attempt: Int = 0) {
    guard window != nil else {
      return
    }
    if let searchController = owningViewController()?.navigationItem.searchController {
      let relay = SearchPresentationRelay.relay(for: searchController)
      relay.add(self)
      self.relay = relay
      applySearching(searchController.isActive, isAnimated: false)
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

/// Holds the React Native children and passes a touch that hits none of them on to React Native's own hit test, so
/// the container never takes a touch the view itself would not.
private final class LargeTitleFadeContentView: UIView {
  override func hitTest(_ point: CGPoint, with event: UIEvent?) -> UIView? {
    guard isUserInteractionEnabled, !isHidden, alpha > 0.01 else {
      return nil
    }
    for subview in subviews.reversed() {
      if let view = subview.hitTest(subview.convert(point, from: self), with: event) {
        return view
      }
    }
    return nil
  }
}
