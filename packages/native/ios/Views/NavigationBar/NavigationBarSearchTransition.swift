import UIKit

/**
 Opens and closes the integrated search as UIKit's own search controller does (`_UIBarButtonItemSearchBarGroup`): the
 search item's glass grows into the field and the cancel splits off its end. The bar pairs an outgoing glass with an
 incoming one by item and position, so the changes are staged. Opening drops the leading items first and adds the cancel
 a moment later; in one change the close grew into the field and the button turned into the cancel. Closing merges the
 cancel into the field, then collapses the field back into the button and brings the title back, which, set while the
 field is still wide, pushes the items into the bar's overflow menu. Steps run on the main thread like the bar's own
 animation, so a stall (the keyboard coming up) delays both alike.
 */
final class NavigationBarSearchTransition {
  private struct Step {
    let delay: TimeInterval
    let change: () -> Void
  }

  private unowned let container: UIView
  private let item: UINavigationItem
  private let titleView: NavigationBarTitleView
  private let field: NavigationBarSearchField
  private let searchItem: UIBarButtonItem
  private var generation = 0

  init(
    container: UIView,
    item: UINavigationItem,
    titleView: NavigationBarTitleView,
    field: NavigationBarSearchField,
    searchItem: UIBarButtonItem
  ) {
    self.container = container
    self.item = item
    self.titleView = titleView
    self.field = field
    self.searchItem = searchItem
  }

  /// Drops the steps of a change still running, when the search is toggled again.
  func cancel() {
    generation += 1
  }

  func open(to content: NavigationBarContent, placement: NavigationBarSearchButtonPlacement, focus: @escaping () -> Void) {
    fadeOutTitle()
    item.titleView = content.titleView
    switch placement {
    case .leading:
      run([
        Step(delay: 0) {
          self.field.expand(isAnimated: true)
          self.setItems(left: content.leftItems, right: content.rightItems)
          focus()
        },
        Step(delay: 0.16) { self.field.revealContent() },
      ])
    case .trailing:
      run([
        Step(delay: 0) {
          self.field.expand(isAnimated: true)
          self.setItems(left: content.leftItems, right: [self.searchItem])
          focus()
        },
        Step(delay: 0.12) { self.setItems(right: content.rightItems) },
        Step(delay: 0.16) { self.field.revealContent() },
      ])
    }
  }

  func close(to content: NavigationBarContent, placement: NavigationBarSearchButtonPlacement, isTitleVisible: Bool) {
    switch placement {
    case .leading:
      run([
        Step(delay: 0) { self.field.fadeContentOut() },
        Step(delay: 0.1) {
          self.field.coverIcon(in: self.container)
          self.field.collapse(isAnimated: true)
          self.fadeInTitle(content.titleView, isVisible: isTitleVisible)
          self.setItems(left: content.leftItems, right: content.rightItems)
        },
        Step(delay: 0.6) { self.field.settleCollapsed() },
      ])
    case .trailing:
      run([
        Step(delay: 0) { self.setItems(right: [self.searchItem]) },
        Step(delay: 0.08) {
          self.field.collapse(isAnimated: true)
          self.fadeInTitle(content.titleView, isVisible: isTitleVisible)
          self.setItems(right: [self.searchItem])
        },
        Step(delay: 0.3) { self.setItems(left: content.leftItems) },
        Step(delay: 0.6) { self.field.settleCollapsed() },
      ])
    }
  }

  private func run(_ steps: [Step]) {
    generation += 1
    let current = generation
    for step in steps {
      guard step.delay > 0 else {
        step.change()
        continue
      }
      DispatchQueue.main.asyncAfter(deadline: .now() + step.delay) { [weak self] in
        if self?.generation == current {
          step.change()
        }
      }
    }
  }

  private func setItems(left: [UIBarButtonItem]? = nil, right: [UIBarButtonItem]? = nil) {
    if let left {
      item.setLeftBarButtonItems(left, animated: true)
    }
    if let right {
      item.setRightBarButtonItems(right, animated: true)
    }
  }

  private func fadeOutTitle() {
    guard titleView.window != nil, let snapshot = titleView.snapshotView(afterScreenUpdates: false) else {
      return
    }
    snapshot.frame = titleView.convert(titleView.bounds, to: container)
    container.addSubview(snapshot)
    titleView.label.alpha = 0
    UIView.animate(withDuration: 0.15, delay: 0, options: [.allowUserInteraction]) {
      snapshot.alpha = 0
    } completion: { _ in
      snapshot.removeFromSuperview()
    }
  }

  private func fadeInTitle(_ titleView: UIView?, isVisible: Bool) {
    self.titleView.label.alpha = 0
    item.titleView = titleView
    UIView.animate(withDuration: 0.25, delay: 0.06, options: [.beginFromCurrentState, .allowUserInteraction]) {
      self.titleView.label.alpha = isVisible ? 1 : 0
    }
  }
}
