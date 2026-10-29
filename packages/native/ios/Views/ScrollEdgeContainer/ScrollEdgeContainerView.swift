import ExpoModulesCore
import SwiftUI

internal enum ScrollEdgeEffectOption: String, Enumerable {
  case automatic
  case soft
  case hard
}

internal final class ScrollEdgeContainerProps: ExpoSwiftUI.ViewProps {
  @Field var topBarHeight: Double = 0
  @Field var bottomBarHeight: Double = 0
  @Field var effect: ScrollEdgeEffectOption = .soft
  @Field var elementOpacity: Double = 0
  @Field var isTopEdgeEffectHidden: Bool = false
  @Field var scrollableKey: String = ""
  @Field var isContentScrollView: Bool = false
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
    let scrollHost = scrollChild?.uiView
    let effect = props.effect
    let isTopHidden = props.isTopEdgeEffectHidden
    let isContentScrollView = props.isContentScrollView

    child(at: 0, in: children)
      .ignoresSafeArea()
      .task(
        id: EdgeEffectTarget(
          child: scrollChild?.id,
          scrollableKey: props.scrollableKey,
          effect: effect,
          isTopHidden: isTopHidden,
          isContentScrollView: isContentScrollView
        )
      ) {
        configureEdgeEffects(in: scrollHost, effect: effect, isTopHidden: isTopHidden, isContentScrollView: isContentScrollView)
      }
      .modifier(EdgeBarModifier(edge: .top, height: props.topBarHeight, elementOpacity: props.elementOpacity, bar: child(at: 1, in: children)))
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
  let effect: ScrollEdgeEffectOption
  let isTopHidden: Bool
  let isContentScrollView: Bool
}

/**
 Edge-effect state survives Fabric view recycling: a sheet that hides both vertical edges of the scroll view it pins
 hands that `UIScrollView` on to the next React Native scroll view with its edges still hidden. So both edges are
 set again (the top one hidden only with `isTopHidden`, style from `effect`) whenever the scroll child changes —
 SwiftUI's `.scrollEdgeEffectStyle` never reaches a hosted UIKit scroll view.

 `isContentScrollView` makes the scroll view its view controller's content scroll view for the bottom edge, the one
 the iOS 26 tab bar watches to minimise on scroll; UIKit otherwise takes the screen's first scroll view.
 */
@MainActor
private func configureEdgeEffects(
  in host: UIView?,
  effect: ScrollEdgeEffectOption,
  isTopHidden: Bool,
  isContentScrollView: Bool
) {
  guard let scrollView = firstScrollView(in: host) else {
    return
  }

  ScrollEdgeTopPin.attach(to: scrollView)

  if isContentScrollView, #available(iOS 15.0, *) {
    owningViewController(of: scrollView)?.setContentScrollView(scrollView, for: .bottom)
  }

#if compiler(>=6.2)
  guard #available(iOS 26.0, *) else {
    return
  }

  let style = effect.edgeEffectStyle
  scrollView.topEdgeEffect.isHidden = isTopHidden
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

