import ExpoModulesCore
import SwiftUI
import UIKit

/**
 Makes the scroll view of the modified SwiftUI view (a `List`) its screen's content scroll view for the top edge, so a
 native-stack large title collapses as it scrolls. UIKit looks for that scroll view in the screen's first subview chain
 and does not find one inside a SwiftUI host, so the title stayed large.
 */
internal struct ContentScrollViewModifier: ViewModifier, Record {
  func body(content: Content) -> some View {
    content.background(ContentScrollViewRegistrar().allowsHitTesting(false))
  }
}

private struct ContentScrollViewRegistrar: UIViewRepresentable {
  func makeUIView(context: Context) -> ContentScrollViewRegistrarView {
    ContentScrollViewRegistrarView()
  }

  func updateUIView(_ uiView: ContentScrollViewRegistrarView, context: Context) {
    uiView.scheduleRegistration()
  }
}

/**
 Finds the nearest scroll view beside it, up to the SwiftUI host, and registers it on the first view controller whose
 parent is a `UINavigationController` (the screen). It waits a turn of the main queue, since SwiftUI adds the list's
 collection view after the background view.
 */
final class ContentScrollViewRegistrarView: UIView {
  override func didMoveToWindow() {
    super.didMoveToWindow()
    scheduleRegistration()
  }

  func scheduleRegistration() {
    DispatchQueue.main.async { [weak self] in
      self?.register()
    }
  }

  private func register() {
    guard #available(iOS 15.0, *), window != nil, let scrollView = siblingScrollView(), let controller = screenController() else {
      return
    }

    if controller.contentScrollView(for: .top) !== scrollView {
      controller.setContentScrollView(scrollView, for: .top)
    }
  }

  private func siblingScrollView() -> UIScrollView? {
    var ancestor = superview

    while let view = ancestor {
      if let scrollView = firstScrollView(in: view) {
        return scrollView
      }
      if String(describing: type(of: view)).contains("HostingView") {
        return nil
      }
      ancestor = view.superview
    }

    return nil
  }

  private func firstScrollView(in view: UIView) -> UIScrollView? {
    var queue = view.subviews

    while !queue.isEmpty {
      let candidate = queue.removeFirst()
      if let scrollView = candidate as? UIScrollView, !isDescendant(of: scrollView) {
        return scrollView
      }
      queue.append(contentsOf: candidate.subviews)
    }

    return nil
  }

  private func screenController() -> UIViewController? {
    var responder: UIResponder? = self

    while let current = responder {
      if let controller = current as? UIViewController, controller.parent is UINavigationController {
        return controller
      }
      responder = current.next
    }

    return nil
  }
}
