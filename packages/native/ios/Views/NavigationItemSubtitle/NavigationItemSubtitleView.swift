import ExpoModulesCore
import UIKit

/**
 A layout-less view that styles its screen's `UINavigationItem` on iOS 26: `style = .browser`, which puts the title on
 the leading side right after the back button, and an `attributedSubtitle` in the given face, kern and colour. UIKit then
 lays out, truncates and morphs the title and subtitle itself on push and pop. The title stays the stack's own
 (`navigationItem.title`), which a native stack sets on every header update; setting `title` replaces `attributedTitle`,
 while `attributedSubtitle` survives it.

 It finds the item through the responder chain (the first view controller up is the screen's), so it has to sit inside
 the screen's tree. `subtitleHidden` changes cross-dissolve the navigation bar, so a title revealed on scroll and its
 subtitle fade in together. Leaving the window resets the item's style and subtitle.
 */
public final class NavigationItemSubtitleView: ExpoView {
  private static let revealDuration: TimeInterval = 0.25

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

  private weak var navigationItem: UINavigationItem?

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
    navigationItem = item
    let attributedSubtitle = subtitleHidden ? nil : makeAttributedSubtitle()
    let update = {
      item.style = .browser
      item.attributedSubtitle = attributedSubtitle
    }

    guard animated, let navigationBar = controller.navigationController?.navigationBar, window != nil else {
      update()
      return
    }

    UIView.transition(
      with: navigationBar,
      duration: Self.revealDuration,
      options: [.transitionCrossDissolve, .allowUserInteraction],
      animations: update
    )
  }

  private func reset() {
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
