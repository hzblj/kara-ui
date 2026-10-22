import ExpoModulesCore

extension BlurView {
  static func definition() -> ViewDefinition<BlurView> {
    View(BlurView.self) {
      Prop("material") { (view: BlurView, material: String?) in
        view.material = material ?? "regular"
      }
      Prop("vibrancy") { (view: BlurView, vibrancy: String?) in
        view.vibrancy = vibrancy
      }
      Prop("colorScheme") { (view: BlurView, colorScheme: String?) in
        view.colorScheme = colorScheme
      }
      Prop("cornerRadius") { (view: BlurView, radius: Double?) in
        view.cornerRadius = CGFloat(radius ?? 0)
      }
    }
  }
}
