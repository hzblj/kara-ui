import ExpoModulesCore

extension ScrollEdgeTopBarView {
  static func definition() -> ViewDefinition<ScrollEdgeTopBarView> {
    View(ScrollEdgeTopBarView.self) {
      Prop("scrollInsetExtra") { (view: ScrollEdgeTopBarView, extra: Double?) in
        view.scrollInsetExtra = extra
      }
    }
  }
}
