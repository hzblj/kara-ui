import ExpoModulesCore
import UIKit
import UIKit.UIGestureRecognizerSubclass

/// Expands a minimized iOS 26 tab bar as soon as the content is dragged back up. With `.onScrollDown` the header says
/// the bar "expands when scrolling back up", but UIKit expands it only once the list is back at its top, or on a tap.
///
/// A layout-less view (`display: contents`) that finds its tab bar controller (the first view controller up the
/// responder chain when it is one or sits in one, else the first one among that controller's descendants: a sibling of
/// the tabs) and installs one `TabBarScrollUpExpander` on it. Retried while the tabs mount.
public final class TabBarExpandOnScrollUpView: ExpoView {
  private static let attachAttempts = 10

  public override func didMoveToWindow() {
    super.didMoveToWindow()
    attach()
  }

  private func attach(attempt: Int = 0) {
    guard #available(iOS 26.0, *), window != nil else {
      return
    }
    guard let tabBarController = owningTabBarController() else {
      guard attempt < Self.attachAttempts else {
        return
      }
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.1 * Double(attempt + 1)) { [weak self] in
        self?.attach(attempt: attempt + 1)
      }
      return
    }
    TabBarScrollUpExpander.install(on: tabBarController)
  }

  private func owningTabBarController() -> UITabBarController? {
    var responder: UIResponder? = self
    while let current = responder {
      if let controller = current as? UIViewController {
        return controller as? UITabBarController ?? controller.tabBarController ?? Self.descendantTabBarController(of: controller)
      }
      responder = current.next
    }
    return nil
  }

  private static func descendantTabBarController(of controller: UIViewController) -> UITabBarController? {
    var queue = controller.children
    while !queue.isEmpty {
      let child = queue.removeFirst()
      if let tabBarController = child as? UITabBarController {
        return tabBarController
      }
      queue.append(contentsOf: child.children)
    }
    return nil
  }
}

/// Watches every drag of a scroll view inside the tab bar controller. Once one moves the content 24 pt back up from the
/// deepest offset it reached, or ends flicked down at 300 pt/s, and the bar is minimized, it expands the bar. Once per
/// drag, and only while the behavior is `.onScrollDown`.
@available(iOS 26.0, *)
private final class TabBarScrollUpExpander: NSObject {
  private static var key: UInt8 = 0
  private static let expandDistance: CGFloat = 24
  private static let expandVelocity: CGFloat = 300

  private weak var tabBarController: UITabBarController?
  private let observedScrollViews = NSHashTable<UIScrollView>.weakObjects()
  private var deepestOffset: CGFloat = 0
  private var hasExpanded = false

  static func install(on tabBarController: UITabBarController) {
    guard objc_getAssociatedObject(tabBarController, &key) == nil else {
      return
    }
    let expander = TabBarScrollUpExpander(tabBarController: tabBarController)
    objc_setAssociatedObject(tabBarController, &key, expander, .OBJC_ASSOCIATION_RETAIN_NONATOMIC)
    tabBarController.view.addGestureRecognizer(ScrollViewTouchObserver { [weak expander] scrollView in
      expander?.observe(scrollView)
    })
  }

  private init(tabBarController: UITabBarController) {
    self.tabBarController = tabBarController
  }

  /// Adds a target to the scroll view's own pan recognizer, so nothing competes with the scroll for the touch.
  private func observe(_ scrollView: UIScrollView) {
    guard !observedScrollViews.contains(scrollView) else {
      return
    }
    observedScrollViews.add(scrollView)
    scrollView.panGestureRecognizer.addTarget(self, action: #selector(handlePan(_:)))
  }

  @objc private func handlePan(_ pan: UIPanGestureRecognizer) {
    guard let scrollView = pan.view as? UIScrollView else {
      return
    }
    let offset = scrollView.contentOffset.y
    switch pan.state {
    case .began:
      deepestOffset = offset
      hasExpanded = false
    case .changed:
      deepestOffset = max(deepestOffset, offset)
      if deepestOffset - offset >= Self.expandDistance {
        expand(from: scrollView)
      }
    case .ended:
      if pan.velocity(in: scrollView).y >= Self.expandVelocity {
        expand(from: scrollView)
      }
    default:
      break
    }
  }

  private func expand(from scrollView: UIScrollView) {
    guard !hasExpanded, let tabBarController, tabBarController.tabBarMinimizeBehavior == .onScrollDown else {
      return
    }
    hasExpanded = true
    guard let interaction = TabBarScrollAwayInteraction(tabBar: tabBarController.tabBar) else {
      tabBarController.tabBarMinimizeBehavior = .never
      tabBarController.tabBarMinimizeBehavior = .onScrollDown
      return
    }
    if interaction.isMinimized {
      interaction.expand(fallbackScrollView: scrollView)
    }
  }
}

/// UIKit's `_UIScrollAwayInteraction` of the floating tab bar, the one that minimizes it on scroll down. Its
/// `_observeScrollViewWillScrollToTop:` is the path of a status bar tap: it expands the bar with UIKit's own animation
/// and resets its own progress, so the next scroll down minimizes it again. The state is read through `Mirror`; nothing
/// on `UITabBar` is called, since `_isMinimized` and `_setMinimized:` throw "This can only be called by an approved
/// app". Without the interaction the expander sets `.never` and `.onScrollDown` again, which expands the bar in one
/// frame.
@available(iOS 26.0, *)
private struct TabBarScrollAwayInteraction {
  private typealias WillScrollToTop = @convention(c) (AnyObject, Selector, UIScrollView) -> Bool

  private static let willScrollToTopSelector = NSSelectorFromString("_observeScrollViewWillScrollToTop:")

  private let interaction: NSObject
  private let fields: [String: Any]

  init?(tabBar: UITabBar) {
    guard let ivar = class_getInstanceVariable(UITabBar.self, "_visualProvider"),
      let provider = object_getIvar(tabBar, ivar),
      let interaction = Self.field("scrollAwayInteraction", of: provider) as? NSObject,
      interaction.responds(to: Self.willScrollToTopSelector)
    else {
      return nil
    }
    self.interaction = interaction
    var fields: [String: Any] = [:]
    for child in Mirror(reflecting: interaction).children {
      if let label = child.label {
        fields[label] = child.value
      }
    }
    self.fields = fields
  }

  var isMinimized: Bool {
    guard let progress = fields["progress"] else {
      return true
    }
    if let progress = progress as? CGFloat {
      return progress > 0
    }
    if let progress = progress as? Double {
      return progress > 0
    }
    return true
  }

  func expand(fallbackScrollView: UIScrollView) {
    let scrollView = fields["contentScrollView"] as? UIScrollView ?? fallbackScrollView
    let method = interaction.method(for: Self.willScrollToTopSelector)
    _ = unsafeBitCast(method, to: WillScrollToTop.self)(interaction, Self.willScrollToTopSelector, scrollView)
  }

  private static func field(_ name: String, of object: Any) -> Any? {
    Mirror(reflecting: object).children.first { $0.label == name }?.value
  }
}

/// Learns which scroll views are under a finger without ever taking a touch: it fails in `touchesBegan`, so React
/// Native's touch handler, which waits for recognizers outside its root view to fail, is never held up.
private final class ScrollViewTouchObserver: UIGestureRecognizer, UIGestureRecognizerDelegate {
  private let onScrollView: (UIScrollView) -> Void

  init(onScrollView: @escaping (UIScrollView) -> Void) {
    self.onScrollView = onScrollView
    super.init(target: nil, action: nil)
    cancelsTouchesInView = false
    delaysTouchesBegan = false
    delaysTouchesEnded = false
    delegate = self
  }

  override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent) {
    for touch in touches {
      var current = touch.view
      while let view = current, view !== self.view {
        if let scrollView = view as? UIScrollView {
          onScrollView(scrollView)
        }
        current = view.superview
      }
    }
    state = .failed
  }

  override func canPrevent(_ preventedGestureRecognizer: UIGestureRecognizer) -> Bool {
    false
  }

  override func canBePrevented(by preventingGestureRecognizer: UIGestureRecognizer) -> Bool {
    false
  }

  func gestureRecognizer(
    _ gestureRecognizer: UIGestureRecognizer,
    shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer
  ) -> Bool {
    true
  }
}
