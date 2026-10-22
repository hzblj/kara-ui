import ExpoModulesCore

extension GlassView {
  static func definition() -> ViewDefinition<GlassView> {
    View(GlassView.self) {
      Prop("glassTint") { (view: GlassView, color: UIColor?) in
        view.glassTint = color
      }
      Prop("isInteractive") { (view: GlassView, isInteractive: Bool?) in
        view.isInteractive = isInteractive ?? false
      }
      Prop("colorScheme") { (view: GlassView, colorScheme: String?) in
        view.colorScheme = colorScheme
      }

      OnViewDidUpdateProps { view in
        view.applyEffectIfNeeded()
      }
    }
  }
}
