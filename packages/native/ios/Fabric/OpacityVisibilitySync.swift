import ObjectiveC
import UIKit

/**
 Keeps UIKit's idea of which views are hidden in step with React Native's `opacity`.

 UIKit records per view whether it sits in a hidden subtree — `isHidden`, or an `alpha` below 0.01, counts as hidden.
 It sets the record when a subview is added and updates it only through `isHidden` and `alpha`. Liquid Glass reads
 it: in a "hidden" subtree a `UIGlassEffect` stays set but draws nothing.

 Fabric writes `opacity` straight to `layer.opacity`, past `alpha`. A subtree mounted under a React Native view at
 opacity 0 — Legend List keeps its containers there until the first layout, a `FadeIn` entering starts there — so
 stayed hidden for UIKit after the view turned visible, and the glass in it never showed.

 `RCTViewComponentView`'s `updateProps:oldProps:`, `invalidateLayer` and `prepareForRecycle` are the only places
 React Native writes a view's opacity; Reanimated and Animated go through `updateProps:oldProps:`. Each is wrapped:
 when it moves `layer.opacity` across 0.01, the change is replayed through `alpha` (the old opacity back on the layer,
 then `alpha` to the new value), so UIKit updates the record and notifies the subtree. Other changes pass untouched.
 It is runtime method replacement rather than a patch so it also works with the prebuilt React Native core.

 The replacement happens once per process, in a `static let` (`swift_once`): every React runtime runs the module's
 `OnCreate`, sometimes two at the same time, and a second wrap would wrap the first (every change replayed twice) or,
 racing it, capture the other's half-installed implementation.
 */
enum OpacityVisibilitySync {
  private static let hiddenOpacity: Float = 0.01

  private static let installation: Void = {
    guard let viewClass = NSClassFromString("RCTViewComponentView") else {
      return
    }
    wrapUpdateProps(of: viewClass)
    wrap(NSSelectorFromString("invalidateLayer"), of: viewClass)
    wrap(NSSelectorFromString("prepareForRecycle"), of: viewClass)
  }()

  static func install() {
    _ = installation
  }

  private static func wrap(_ selector: Selector, of viewClass: AnyClass) {
    guard let method = class_getInstanceMethod(viewClass, selector) else {
      return
    }
    typealias Implementation = @convention(c) (UIView, Selector) -> Void
    let original = unsafeBitCast(method_getImplementation(method), to: Implementation.self)
    let replacement: @convention(block) (UIView) -> Void = { view in
      let opacity = view.layer.opacity
      original(view, selector)
      syncAlpha(of: view, from: opacity)
    }
    method_setImplementation(method, imp_implementationWithBlock(replacement))
  }

  /**
   Both props arrive as C++ references (`const Props::Shared &`), which are pointers at the ABI level, so they pass
   through untouched as raw pointers.
   */
  private static func wrapUpdateProps(of viewClass: AnyClass) {
    let selector = NSSelectorFromString("updateProps:oldProps:")
    guard let method = class_getInstanceMethod(viewClass, selector) else {
      return
    }
    typealias Implementation = @convention(c) (UIView, Selector, UnsafeRawPointer, UnsafeRawPointer) -> Void
    let original = unsafeBitCast(method_getImplementation(method), to: Implementation.self)
    let replacement: @convention(block) (UIView, UnsafeRawPointer, UnsafeRawPointer) -> Void = { view, props, oldProps in
      let opacity = view.layer.opacity
      original(view, selector, props, oldProps)
      syncAlpha(of: view, from: opacity)
    }
    method_setImplementation(method, imp_implementationWithBlock(replacement))
  }

  private static func syncAlpha(of view: UIView, from previousOpacity: Float) {
    let opacity = view.layer.opacity
    guard (previousOpacity < hiddenOpacity) != (opacity < hiddenOpacity) else {
      return
    }
    UIView.performWithoutAnimation {
      view.layer.opacity = previousOpacity
      view.alpha = CGFloat(opacity)
    }
  }
}
