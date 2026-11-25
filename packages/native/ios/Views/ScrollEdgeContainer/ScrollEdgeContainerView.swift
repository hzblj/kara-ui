import ExpoModulesCore
import SwiftUI

internal enum ScrollEdgeEffectOption: String, Enumerable {
  case automatic
  case soft
  case hard
}

/**
 `nativeTopBarHeight` is the top bar's height as `ScrollEdgeTopBarView` measures it natively, in a window, plus the
 navigation bar while it follows one. The top `safeAreaBar` prefers it over the `topBarHeight` JS sends, which comes a
 few frames later and, in the navigation bar mode, never follows the bar at all.
 */
internal final class ScrollEdgeContainerProps: ExpoSwiftUI.ViewProps {
  @Field var topBarHeight: Double = 0
  @Field var bottomBarHeight: Double = 0
  @Field var effect: ScrollEdgeEffectOption = .soft
  @Field var elementOpacity: Double = 0
  @Field var isTopEdgeEffectHidden: Bool = false
  @Field var scrollableKey: String = ""
  @Field var isContentScrollView: Bool = false
  var nativeTopBarHeight: Double?

  func setNativeTopBarHeight(_ height: Double) {
    guard nativeTopBarHeight != height else {
      return
    }
    objectWillChange.send()
    nativeTopBarHeight = height
  }
}

/**
 The iOS 26 scroll edge effect for a React Native scroll view: SwiftUI `.safeAreaBar(edge:)` around the hosted
 scroll view, with the top and bottom bars hosted as children. Below iOS 26 the bars are still laid out
 (`.safeAreaInset`), just without the effect. `UIScrollEdgeElementContainerInteraction` on a UIKit view did not
 work — it never showed an effect over a React Native scroll view.

 The bars must lie in the scroll view's `contentInset`; a bar laid over padding instead leaves UIKit's scroll pocket
 at alpha 0 until the first scroll. The JS side injects those insets.
 */
internal struct ScrollEdgeContainerView: ExpoSwiftUI.View, ExpoSwiftUI.WithHostingView {
  @ObservedObject var props: ScrollEdgeContainerProps

  var body: some View {
    let children = props.children ?? []
    let scrollChild = children.first
    let scrollHost = scrollChild?.uiView as? ScrollEdgeScrollableView
    let topBarHost = children.indices.contains(1) ? children[1].uiView : nil
    let settings = EdgeEffectSettings(props: props)

    child(at: 0, in: children)
      .ignoresSafeArea()
      .task(id: EdgeEffectTarget(child: scrollChild?.id, scrollableKey: props.scrollableKey, settings: settings)) {
        configureEdgeEffects(in: scrollHost, settings: settings, topBar: topBarView(in: topBarHost))
        syncNavigationBarFollower(in: topBarHost)
      }
      .modifier(ScrollableKeyChangeModifier(scrollableKey: props.scrollableKey) {
        topBarView(in: topBarHost)?.scrollChildDidChange()
      })
      .modifier(
        EdgeBarModifier(
          edge: .top,
          height: props.nativeTopBarHeight ?? props.topBarHeight,
          elementOpacity: props.elementOpacity,
          bar: child(at: 1, in: children)
        )
      )
      .modifier(EdgeBarModifier(edge: .bottom, height: props.bottomBarHeight, elementOpacity: props.elementOpacity, bar: child(at: 2, in: children)))
      .ignoresSafeArea()
  }

  private func child(at index: Int, in children: [any ExpoSwiftUI.AnyChild]) -> AnyView {
    guard children.indices.contains(index) else {
      return AnyView(EmptyView())
    }

    let view: any View = children[index].childView
    return AnyView(view)
  }
}

/**
 Always the same structure, a bar of height 0 included: an `if height > 0` here put `content` in another branch when
 the bar measured itself, and SwiftUI rebuilt the hosted React Native children for it. Each rebuild makes a new
 `UIViewHost` container that takes the view with `addSubview`; on a remount (recycled React Native views) SwiftUI
 made several and dropped the last one, whose dealloc took the scroll view and the top bar with it — they were
 gone until the screen was rebuilt.
 */
private struct EdgeBarModifier: ViewModifier {
  let edge: VerticalEdge
  let height: Double
  let elementOpacity: Double
  let bar: AnyView

  @ViewBuilder
  func body(content: Content) -> some View {
    let sizedBar = bar
      .frame(maxWidth: .infinity)
      .frame(height: max(height, 0))
      .background(EdgeElementShape(edge: edge, opacity: elementOpacity))

#if compiler(>=6.2)
    if #available(iOS 26.0, *) {
      content.safeAreaBar(edge: edge, spacing: 0) { sizedBar }
    } else {
      content.safeAreaInset(edge: edge, spacing: 0) { sizedBar }
    }
#else
    content.safeAreaInset(edge: edge, spacing: 0) { sizedBar }
#endif
  }
}

/**
 UIKit sizes the effect around the elements it recognises (text, controls, glass), and React Native content counts as
 none, so each bar sits on an invisible SwiftUI `Button`. Its content has to stay `Color.red.opacity(opacity)`:
 `Color.clear`, `Color.black.opacity(0)` and `.accessibilityHidden(true)` all stopped the effect when tried.

 iOS 27 no longer counts the button on its own: the effect view keeps the bar's height, but its backdrop layers (the
 blur itself) stop at the status bar or the navigation bar, and the content under the bar stays sharp. A text element
 still counts, hidden from VoiceOver too, and the blur reaches past its far side, so a single space is laid on the
 bar's inner edge (the bottom of a top bar, the top of a bottom one). A clear image, the button without
 `allowsHitTesting(false)`, a scroll-edge element interaction added at runtime and a 2 % opacity did not count; glass
 counted only in part. iOS 26 measures the same as before.
 */
/**
 Syncs the top inset again whenever a new scroll child mounts. `ScrollEdgeTopBarView` syncs only when its own height
 changes, so a list mounted from a bar height JS measured before the bar got its safe area, while the bar had already
 grown natively, kept that inset until JS remounted it: a screen pushed over a busy one sat about the header's height
 too high for a few hundred milliseconds and then jumped. SwiftUI runs the action after the Fabric transaction that
 mounted the child and before the frame renders, so the list starts at the right inset.
 */
private struct ScrollableKeyChangeModifier: ViewModifier {
  let scrollableKey: String
  let action: () -> Void

  @ViewBuilder
  func body(content: Content) -> some View {
    if #available(iOS 17.0, *) {
      content.onChange(of: scrollableKey) { action() }
    } else {
      content.onChange(of: scrollableKey) { _ in action() }
    }
  }
}

private struct EdgeElementShape: View {
  let edge: VerticalEdge
  let opacity: Double

  var body: some View {
    ZStack(alignment: edge == .top ? .bottom : .top) {
      Button(action: {}) {
        Color.red.opacity(opacity).frame(maxWidth: .infinity, maxHeight: .infinity)
      }
      .buttonStyle(.plain)
      Text(verbatim: " ")
        .accessibilityHidden(true)
    }
    .allowsHitTesting(false)
  }
}

/**
 The scroll child's `scrollableKey` (its React `key`) is part of the target: a scroll view remounted by `key` comes
 back as the same recycled view inside the same stable wrapper, so only the key tells the setup to run again.
 */
private struct EdgeEffectTarget: Equatable {
  let child: ObjectIdentifier?
  let scrollableKey: String
  let settings: EdgeEffectSettings
}

private struct EdgeEffectSettings: Equatable {
  let effect: ScrollEdgeEffectOption
  let isTopHidden: Bool
  let isContentScrollView: Bool

  init(props: ScrollEdgeContainerProps) {
    effect = props.effect
    isTopHidden = props.isTopEdgeEffectHidden
    isContentScrollView = props.isContentScrollView
  }
}

typealias ScrollEdgeContainerHost = ExpoSwiftUI.HostingView<ScrollEdgeContainerProps, ScrollEdgeContainerView>

@MainActor
func scrollEdgeContainerHost(of view: UIView) -> ScrollEdgeContainerHost? {
  var current = view.superview
  while let candidate = current {
    if let host = candidate as? ScrollEdgeContainerHost {
      return host
    }
    current = candidate.superview
  }
  return nil
}

/** The whole setup for the scroll child mounted last, run by `ScrollEdgeScrollableView` after each mount. */
@MainActor
func configureScrollChild(in host: ScrollEdgeContainerHost) {
  guard let props = host.getProps() as? ScrollEdgeContainerProps, let children = props.children else {
    return
  }
  let topBar = children.indices.contains(1) ? topBarView(in: children[1].uiView) : nil
  let scrollable = children.first?.uiView as? ScrollEdgeScrollableView
  configureEdgeEffects(in: scrollable, settings: EdgeEffectSettings(props: props), topBar: topBar)
  topBar?.scrollChildDidChange()
}

/**
 Edge-effect state survives Fabric view recycling: a sheet that hides both vertical edges of the scroll view it pins
 hands that `UIScrollView` on to the next React Native scroll view with its edges still hidden. So both edges are
 set again (the top one hidden only with `isTopHidden` or by `ScrollEdgeTopEffectGate`, style from `effect`) whenever
 the scroll child changes — SwiftUI's `.scrollEdgeEffectStyle` never reaches a hosted UIKit scroll view.

 `isContentScrollView` makes the scroll view its view controller's content scroll view for the bottom edge, the one
 the iOS 26 tab bar watches to minimise on scroll; UIKit otherwise takes the screen's first scroll view.
 */
@MainActor
private func configureEdgeEffects(
  in scrollable: ScrollEdgeScrollableView?,
  settings: EdgeEffectSettings,
  topBar: ScrollEdgeTopBarView?
) {
  guard let scrollable, let scrollView = scrollable.scrollView else {
    return
  }

  ScrollEdgeTopPin.attach(to: scrollView)

  if settings.isContentScrollView, #available(iOS 15.0, *) {
    owningViewController(of: scrollView)?.setContentScrollView(scrollView, for: .bottom)
  }

  ScrollEdgeTopEffectGate.apply(
    to: scrollView,
    in: scrollable,
    isCallerHidden: settings.isTopHidden,
    followsNavigationBar: topBar?.followsNavigationBar ?? false
  )

#if compiler(>=6.2)
  guard #available(iOS 26.0, *) else {
    return
  }

  let style = settings.effect.edgeEffectStyle
  scrollView.topEdgeEffect.style = style
  scrollView.bottomEdgeEffect.isHidden = false
  scrollView.bottomEdgeEffect.style = style
#endif
}

@MainActor
private func owningViewController(of view: UIView) -> UIViewController? {
  var responder: UIResponder? = view
  while let current = responder {
    if let controller = current as? UIViewController {
      return controller
    }
    responder = current.next
  }
  return nil
}

@MainActor
private func syncNavigationBarFollower(in view: UIView?) {
  guard let bar = topBarView(in: view), bar.followsNavigationBar else {
    return
  }
  bar.syncScrollInset()
}

@MainActor
private func topBarView(in view: UIView?) -> ScrollEdgeTopBarView? {
  guard let view else {
    return nil
  }
  if let bar = view as? ScrollEdgeTopBarView {
    return bar
  }
  for subview in view.subviews {
    if let bar = topBarView(in: subview) {
      return bar
    }
  }
  return nil
}

@MainActor
func firstScrollView(in view: UIView?) -> UIScrollView? {
  guard let view else {
    return nil
  }
  if let scrollView = view as? UIScrollView {
    return scrollView
  }
  for subview in view.subviews {
    if let scrollView = firstScrollView(in: subview) {
      return scrollView
    }
  }
  return nil
}

#if compiler(>=6.2)
@available(iOS 26.0, *)
private extension ScrollEdgeEffectOption {
  var edgeEffectStyle: UIScrollEdgeEffect.Style {
    switch self {
    case .automatic:
      return .automatic
    case .soft:
      return .soft
    case .hard:
      return .hard
    }
  }
}
#endif
