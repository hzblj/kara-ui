import ExpoModulesCore
import UIKit

/**
 A layout-less view that styles its screen's `UINavigationItem` on iOS 26: `style = .browser`, which puts the title on
 the leading side right after the back button, and an `attributedSubtitle` in the given face, kern and colour. UIKit then
 lays out, truncates and morphs the title and subtitle itself on push and pop. The title stays the stack's own
 (`navigationItem.title`), which a native stack sets on every header update; setting `title` replaces `attributedTitle`,
 while `attributedSubtitle` survives it.

 It finds the item through the responder chain (the first view controller up is the screen's), so it has to sit inside
 the screen's tree. `subtitleHidden` changes play `transition` (`NavigationTitleAnimator`) over the title and subtitle.
 The stack clears its title in the same commit that hides it, so the view takes pictures of both lines just before
 (KVO with `.prior` on `navigationItem.title`) and the exit plays those. When the trailing bar items change in the same
 commit, a snapshot of the old bar, masked to the side of the title, fades out over them. Leaving the window resets the
 item's style and subtitle.
 */
public final class NavigationItemSubtitleView: ExpoView {
  private static let trailingItemsFadeDuration: TimeInterval = 0.25
  private static let trailingItemsGap: CGFloat = 4

  var subtitle = "" {
    didSet {
      guard subtitle != oldValue else {
        return
      }
      apply(animated: false)
    }
  }

  var subtitleHidden = false {
    didSet {
      guard subtitleHidden != oldValue else {
        return
      }
      apply(animated: true)
    }
  }

  var fontFamily: String? {
    didSet {
      guard fontFamily != oldValue else {
        return
      }
      apply(animated: false)
    }
  }

  var fontSize: CGFloat = UIFont.smallSystemFontSize {
    didSet {
      guard fontSize != oldValue else {
        return
      }
      apply(animated: false)
    }
  }

  var letterSpacing: CGFloat = 0 {
    didSet {
      guard letterSpacing != oldValue else {
        return
      }
      apply(animated: false)
    }
  }

  var color: UIColor = .secondaryLabel {
    didSet {
      guard color != oldValue else {
        return
      }
      apply(animated: false)
    }
  }

  var transition = NavigationTitleTransition.rise

  private weak var navigationItem: UINavigationItem?
  private var titleObservation: NSKeyValueObservation?
  private var shownSnapshots: [NavigationTitleSnapshot] = []
  private var trailingItems: [String] = []
  private let animator = NavigationTitleAnimator()

  public override func didMoveToSuperview() {
    super.didMoveToSuperview()
    guard superview != nil else {
      reset()
      return
    }
    DispatchQueue.main.async { [weak self] in
      self?.apply(animated: false)
    }
  }

  private func apply(animated: Bool) {
    guard #available(iOS 26.0, *), let controller = owningViewController() else {
      return
    }

    let item = controller.navigationItem
    observeTitle(of: item)
    navigationItem = item
    let attributedSubtitle = subtitleHidden ? nil : makeAttributedSubtitle()
    let currentTrailingItems = Self.signature(of: item.rightBarButtonItems)
    let haveTrailingItemsChanged = currentTrailingItems != trailingItems
    trailingItems = currentTrailingItems

    guard animated, let navigationBar = controller.navigationController?.navigationBar, window != nil else {
      animator.cancel()
      item.style = .browser
      item.attributedSubtitle = attributedSubtitle
      return
    }

    let previousBar = haveTrailingItemsChanged ? navigationBar.snapshotView(afterScreenUpdates: false) : nil
    let exitSnapshots = subtitleHidden ? takeExitSnapshots(in: navigationBar, item: item) : []
    item.style = .browser
    item.attributedSubtitle = attributedSubtitle

    let titleSnapshots = subtitleHidden ? exit(in: navigationBar, snapshots: exitSnapshots) : enter(in: navigationBar, item: item)
    if let previousBar {
      fadeTrailingItems(of: navigationBar, from: previousBar, beside: titleSnapshots)
    }
  }

  private func enter(in navigationBar: UINavigationBar, item: UINavigationItem) -> [NavigationTitleSnapshot] {
    let snapshots = animator.enter(in: navigationBar, title: item.title ?? "", subtitle: subtitle, transition: transition)
    guard snapshots.isEmpty, transition.isAnimated else {
      return snapshots
    }
    // The stack may set its title after this view's props in the same commit; one turn later the label is there.
    DispatchQueue.main.async { [weak self, weak navigationBar] in
      guard let self, let navigationBar, !self.subtitleHidden else {
        return
      }
      self.animator.enter(in: navigationBar, title: item.title ?? "", subtitle: self.subtitle, transition: self.transition)
    }
    return snapshots
  }

  private func exit(in navigationBar: UINavigationBar, snapshots: [NavigationTitleSnapshot]) -> [NavigationTitleSnapshot] {
    if transition.exit == .reverse {
      animator.exit(in: navigationBar, snapshots: snapshots)
    } else {
      animator.cancel()
    }
    return snapshots
  }

  private func takeExitSnapshots(in navigationBar: UINavigationBar, item: UINavigationItem) -> [NavigationTitleSnapshot] {
    defer {
      shownSnapshots = []
    }
    if !shownSnapshots.isEmpty {
      return shownSnapshots
    }
    return animator.snapshots(in: navigationBar, title: item.title ?? "", subtitle: subtitle, transition: transition)
  }

  private func observeTitle(of item: UINavigationItem) {
    guard navigationItem !== item || titleObservation == nil else {
      return
    }
    titleObservation = item.observe(\.title, options: [.prior]) { [weak self] item, change in
      guard change.isPrior else {
        return
      }
      MainActor.assumeIsolated {
        self?.captureShownTitle(of: item)
      }
    }
  }

  private func captureShownTitle(of item: UINavigationItem) {
    guard !subtitleHidden, transition.exit == .reverse, window != nil,
      let navigationBar = owningViewController()?.navigationController?.navigationBar
    else {
      shownSnapshots = []
      return
    }
    shownSnapshots = animator.snapshots(in: navigationBar, title: item.title ?? "", subtitle: subtitle, transition: transition)
  }

  private func fadeTrailingItems(
    of navigationBar: UINavigationBar,
    from previousBar: UIView,
    beside titleSnapshots: [NavigationTitleSnapshot]
  ) {
    guard let container = navigationBar.superview else {
      return
    }
    let titleEnd = titleSnapshots.map(\.frame.maxX).max() ?? navigationBar.bounds.midX
    let start = titleEnd + Self.trailingItemsGap
    let mask = CALayer()
    mask.backgroundColor = UIColor.black.cgColor
    mask.frame = CGRect(x: start, y: 0, width: max(0, navigationBar.bounds.width - start), height: navigationBar.bounds.height)
    previousBar.frame = navigationBar.frame
    previousBar.isUserInteractionEnabled = false
    previousBar.layer.mask = mask
    container.insertSubview(previousBar, aboveSubview: navigationBar)
    UIView.animate(
      withDuration: Self.trailingItemsFadeDuration,
      delay: 0,
      options: [.allowUserInteraction],
      animations: { previousBar.alpha = 0 },
      completion: { _ in previousBar.removeFromSuperview() }
    )
  }

  /** What tells the trailing items apart; a native stack builds new ones on every header update. */
  private static func signature(of items: [UIBarButtonItem]?) -> [String] {
    (items ?? []).map { item in
      "\(item.title ?? "")|\(item.image != nil)|\(item.customView != nil)|\(item.accessibilityLabel ?? "")"
    }
  }

  private func reset() {
    animator.cancel()
    titleObservation = nil
    shownSnapshots = []
    guard #available(iOS 26.0, *), let item = navigationItem else {
      return
    }
    item.style = .navigator
    item.attributedSubtitle = nil
    navigationItem = nil
  }

  @available(iOS 26.0, *)
  private func makeAttributedSubtitle() -> AttributedString {
    let font = fontFamily.flatMap { UIFont(name: $0, size: fontSize) } ?? UIFont.systemFont(ofSize: fontSize, weight: .medium)
    var attributedSubtitle = AttributedString(subtitle)
    attributedSubtitle.uiKit.font = font
    attributedSubtitle.uiKit.kern = letterSpacing
    attributedSubtitle.uiKit.foregroundColor = color
    return attributedSubtitle
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
