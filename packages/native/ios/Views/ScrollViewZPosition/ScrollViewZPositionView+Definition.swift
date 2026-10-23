import ExpoModulesCore

extension ScrollViewZPositionView {
  static func definition() -> ViewDefinition<ScrollViewZPositionView> {
    View(ScrollViewZPositionView.self) {
      Prop("layerZPosition") { (view: ScrollViewZPositionView, layerZPosition: Double?) in
        view.layerZPosition = CGFloat(layerZPosition ?? 0)
      }
    }
  }
}
