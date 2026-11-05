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
      Prop("glassStyle") { (view: GlassView, glassStyle: String?) in
        view.glassStyle = glassStyle
      }
      Prop("cornerRadius") { (view: GlassView, cornerRadius: Double?) in
        view.cornerRadius = cornerRadius.map { CGFloat($0) }
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
