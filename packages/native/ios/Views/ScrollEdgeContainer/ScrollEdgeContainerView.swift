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

    child(at: 0, in: children)
      .ignoresSafeArea()
      .task(id: EdgeEffectTarget(child: scrollChild?.id, effect: effect)) {
        configureEdgeEffects(in: scrollHost, effect: effect)
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
      .frame(height: height)
      .background(EdgeElementShape(opacity: height > 0 ? elementOpacity : 0))

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
 UIKit sizes the effect around the elements it recognises — text, controls, glass — and React Native content counts
 as none, so each bar sits on an invisible SwiftUI `Button`. Its content has to stay `Color.red.opacity(opacity)`:
 `Color.clear`, `Color.black.opacity(0)` and `.accessibilityHidden(true)` all stopped the effect when tried.
 */
private struct EdgeElementShape: View {
  let opacity: Double

  var body: some View {
    Button(action: {}) {
      Color.red.opacity(opacity).frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    .buttonStyle(.plain)
    .allowsHitTesting(false)
  }
}

private struct EdgeEffectTarget: Equatable {
  let child: ObjectIdentifier?
  let effect: ScrollEdgeEffectOption
}

/**
 Edge-effect state survives Fabric view recycling: a sheet that hides both vertical edges of the scroll view it pins
 hands that `UIScrollView` on to the next React Native scroll view with its edges still hidden. So both edges are
 reset (`isHidden = false`, style from `effect`) whenever the scroll child changes — SwiftUI's
 `.scrollEdgeEffectStyle` never reaches a hosted UIKit scroll view.
 */
@MainActor
private func configureEdgeEffects(in host: UIView?, effect: ScrollEdgeEffectOption) {
#if compiler(>=6.2)
  guard #available(iOS 26.0, *), let scrollView = firstScrollView(in: host) else {
    return
  }

  let style = effect.edgeEffectStyle
  for edgeEffect in [scrollView.topEdgeEffect, scrollView.bottomEdgeEffect] {
    edgeEffect.isHidden = false
    edgeEffect.style = style
  }
#endif
}

@MainActor
private func firstScrollView(in view: UIView?) -> UIScrollView? {
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

