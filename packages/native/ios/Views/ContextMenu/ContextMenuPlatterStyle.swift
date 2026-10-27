import UIKit

struct ContextMenuPlatterStyle {
  let cornerRadius: CGFloat
  private let shadowColor: CGColor?
  private let shadowOpacity: Float
  private let shadowRadius: CGFloat
  private let shadowOffset: CGSize

  init(cornerRadius: CGFloat, shadowLayer: CALayer?) {
    self.cornerRadius = cornerRadius
    self.shadowColor = shadowLayer?.shadowColor
    self.shadowOpacity = shadowLayer?.shadowOpacity ?? 0
    self.shadowRadius = shadowLayer?.shadowRadius ?? 0
    self.shadowOffset = shadowLayer?.shadowOffset ?? .zero
  }

  func applyShadow(to layer: CALayer, cornerRadius: CGFloat) {
    guard shadowOpacity > 0 else {
      return
    }
    layer.shadowColor = shadowColor
    layer.shadowOpacity = shadowOpacity
    layer.shadowRadius = shadowRadius
    layer.shadowOffset = shadowOffset
    layer.shadowPath = UIBezierPath(roundedRect: layer.bounds, cornerRadius: cornerRadius).cgPath
  }
}
