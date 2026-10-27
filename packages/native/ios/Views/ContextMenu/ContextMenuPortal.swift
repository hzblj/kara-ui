import UIKit

enum ContextMenuPortal {
  private static let sourceLayerKey = "sourceLayer"

  static func frame(showing source: UIView, in window: UIWindow) -> CGRect? {
    guard let portal = layer(showing: source.layer, in: window.layer) else {
      return nil
    }
    return portal.convert(portal.bounds, to: window.layer)
  }

  private static func layer(showing source: CALayer, in layer: CALayer) -> CALayer? {
    if layer !== source, !layer.isHidden, layer.bounds.width > 0,
      layer.responds(to: NSSelectorFromString(sourceLayerKey)),
      (layer.value(forKey: sourceLayerKey) as? CALayer) === source
    {
      return layer
    }
    for sublayer in layer.sublayers ?? [] {
      if let portal = self.layer(showing: source, in: sublayer) {
        return portal
      }
    }
    return nil
  }
}
