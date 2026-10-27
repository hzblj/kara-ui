import UIKit

final class ContextMenuBackdrop {
  private static let containerClassName = "_UIContextMenuContainerView"
  private static let platterTransitionClassName = "_UIContextMenuPlatterTransitionView"
  private static let platterClassName = "_UIContentPlatterView"
  private static let menuClassName = "_UIContextMenuView"
  private static let menuListClassName = "_UIContextMenuListView"
  private static let tabBarCapsuleClassName = "_UITabBarItemPlatterView"
  private static let platformMetricsKey = "_platformMetrics"
  private static let platterCornerRadiusKey = "previewPlatterCornerRadius"
  private static let backgroundFadeDuration: TimeInterval = 0.35
  private static let menuFadeDuration: TimeInterval = 0.1
  private static let backingHoldDuration: TimeInterval = 0.15
  private static let backingFadeDuration: TimeInterval = 0.2

  let platterStyle: ContextMenuPlatterStyle

  private weak var container: UIView?
  private weak var platterTransition: UIView?
  private weak var menu: UIView?
  private let backgroundEffect: UIVisualEffect?
  private let backgroundColor: UIColor?
  private weak var screen: UIView?
  private weak var tabBarCapsule: UIView?

  init?(in window: UIWindow, behind trigger: UIView) {
    guard let container = Self.subview(of: window, named: Self.containerClassName),
      let controller = Self.controller(owning: trigger)
    else {
      return nil
    }
    let background = container.subviews.lazy.compactMap { $0 as? UIVisualEffectView }.first
    let platterTransition = Self.subview(of: container, named: Self.platterTransitionClassName)
    let platter = platterTransition.flatMap { Self.subview(of: $0, named: Self.platterClassName) }
    let menu = platterTransition.flatMap { Self.subview(of: $0, named: Self.menuClassName) }

    self.container = container
    self.platterTransition = platterTransition
    self.menu = menu
    self.platterStyle = ContextMenuPlatterStyle(
      cornerRadius: menu.flatMap(Self.platterCornerRadius(of:)) ?? 0,
      shadowLayer: platter?.layer
    )
    self.backgroundEffect = background?.effect
    self.backgroundColor = background?.backgroundColor
    self.screen = controller.view
    self.tabBarCapsule = controller.tabBarController.flatMap {
      Self.subview(of: $0.tabBar, named: Self.tabBarCapsuleClassName)
    }
  }

  func detachMenu() {
    if let menu, let window = menu.window {
      let copy = UIImageView(image: Self.render(menu))
      copy.frame = menu.convert(menu.bounds, to: window)
      copy.isUserInteractionEnabled = false
      window.addSubview(copy)
      fadeOut(menuCopy: copy)
    }
    platterTransition?.isHidden = true
  }

  func handOver(from source: UIView) {
    container?.isHidden = true
    fadeOutBackground()
    holdBacking(of: source)
  }

  private func fadeOut(menuCopy: UIView) {
    UIView.animate(
      withDuration: Self.menuFadeDuration,
      delay: 0,
      options: [.curveEaseOut],
      animations: {
        menuCopy.alpha = 0
      },
      completion: { _ in
        menuCopy.removeFromSuperview()
      }
    )
  }

  private func fadeOutBackground() {
    guard backgroundEffect != nil || backgroundColor != nil else {
      return
    }
    var dimmings: [UIVisualEffectView] = []
    if let screen {
      dimmings.append(addDimming(to: screen, cornerRadius: 0))
    }
    if let tabBarCapsule, !tabBarCapsule.isHidden {
      dimmings.append(addDimming(to: tabBarCapsule, cornerRadius: tabBarCapsule.bounds.height / 2))
    }

    UIView.animate(
      withDuration: Self.backgroundFadeDuration,
      delay: 0,
      options: [.curveEaseOut],
      animations: {
        for dimming in dimmings {
          dimming.effect = nil
          dimming.backgroundColor = .clear
        }
      },
      completion: { _ in
        for dimming in dimmings {
          dimming.removeFromSuperview()
        }
      }
    )
  }

  private func addDimming(to host: UIView, cornerRadius: CGFloat) -> UIVisualEffectView {
    let dimming = UIVisualEffectView(effect: backgroundEffect)
    dimming.backgroundColor = backgroundColor
    dimming.frame = host.bounds
    dimming.layer.cornerRadius = cornerRadius
    dimming.clipsToBounds = cornerRadius > 0
    dimming.isUserInteractionEnabled = false
    host.addSubview(dimming)
    return dimming
  }

  private func holdBacking(of source: UIView) {
    guard let screen, let content = source.subviews.lazy.compactMap({ $0 as? UIImageView }).first else {
      return
    }
    let backing = UIImageView(image: content.image)
    backing.frame = screen.convert(source.frame, from: source.superview)
    backing.layer.cornerRadius = content.layer.cornerRadius
    backing.layer.cornerCurve = content.layer.cornerCurve
    backing.clipsToBounds = true
    backing.isUserInteractionEnabled = false
    screen.addSubview(backing)

    UIView.animate(
      withDuration: Self.backingFadeDuration,
      delay: Self.backingHoldDuration,
      options: [.curveEaseOut],
      animations: {
        backing.alpha = 0
      },
      completion: { _ in
        backing.removeFromSuperview()
      }
    )
  }

  private static func render(_ view: UIView) -> UIImage {
    let format = UIGraphicsImageRendererFormat(for: view.traitCollection)
    format.opaque = false
    return UIGraphicsImageRenderer(bounds: view.bounds, format: format).image { _ in
      view.drawHierarchy(in: view.bounds, afterScreenUpdates: false)
    }
  }

  private static func subview(of view: UIView, named className: String) -> UIView? {
    view.subviews.first { NSStringFromClass(type(of: $0)) == className }
  }

  private static func platterCornerRadius(of menu: UIView) -> CGFloat? {
    guard let list = descendant(of: menu, named: menuListClassName),
      list.responds(to: NSSelectorFromString(platformMetricsKey)),
      let metrics = list.value(forKey: platformMetricsKey) as? NSObject,
      metrics.responds(to: NSSelectorFromString(platterCornerRadiusKey))
    else {
      return nil
    }
    return metrics.value(forKey: platterCornerRadiusKey) as? CGFloat
  }

  private static func descendant(of view: UIView, named className: String) -> UIView? {
    var level = view.subviews
    while !level.isEmpty {
      if let match = level.first(where: { NSStringFromClass(type(of: $0)) == className }) {
        return match
      }
      level = level.flatMap(\.subviews)
    }
    return nil
  }

  private static func controller(owning view: UIView) -> UIViewController? {
    var responder: UIResponder? = view
    while let current = responder {
      if let controller = current as? UIViewController {
        return controller
      }
      responder = current.next
    }
    return nil
  }
}
