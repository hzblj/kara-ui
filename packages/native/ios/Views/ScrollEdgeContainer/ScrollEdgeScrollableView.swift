import ExpoModulesCore
import UIKit

/**
 The stable wrapper around the container's scroll child, which never remounts. Every child it mounts re-runs the
 container's whole setup one main-queue turn later (the content scroll view, the edge effects, `ScrollEdgeTopPin`, the
 top bar's inset and first placement), so a scroll view remounted under the same `key` is set up too: after a Fast
 Refresh remount the navigation bar kept following the removed scroll view. The setup takes the child mounted last,
 because Reanimated keeps an outgoing child with `exiting` descendants mounted next to the new one for a moment, and the
 first scroll view in the wrapper was the dead one.
 */
public final class ScrollEdgeScrollableView: ExpoView {
  private weak var currentChild: UIView?
  private var isSetupPending = false

  var scrollView: UIScrollView? {
    firstScrollView(in: currentChild)
  }

  public override func mountChildComponentView(_ childComponentView: UIView, index: Int) {
    super.mountChildComponentView(childComponentView, index: index)
    currentChild = childComponentView
    scheduleSetup()
  }

  public override func unmountChildComponentView(_ childComponentView: UIView, index: Int) {
    if let scrollView = firstScrollView(in: childComponentView) {
      ScrollEdgeTopEffectGate.detach(from: scrollView)
    }
    super.unmountChildComponentView(childComponentView, index: index)
    guard currentChild === childComponentView else {
      return
    }
    currentChild = subviews.last
    if currentChild != nil {
      scheduleSetup()
    }
  }

  private func scheduleSetup() {
    guard !isSetupPending else {
      return
    }
    isSetupPending = true
    DispatchQueue.main.async { [weak self] in
      guard let self else {
        return
      }
      self.isSetupPending = false
      guard let host = scrollEdgeContainerHost(of: self) else {
        return
      }
      configureScrollChild(in: host)
    }
  }
}
