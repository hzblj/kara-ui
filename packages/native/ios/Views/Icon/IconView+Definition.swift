import ExpoModulesCore

extension IconView {
  static func definition() -> ViewDefinition<IconView> {
    View(IconView.self) {
      Prop("systemName") { (view: IconView, name: String?) in
        view.systemName = name
      }
      Prop("symbolSize") { (view: IconView, size: Double?) in
        view.symbolSize = CGFloat(size ?? 17)
      }
      Prop("iconColor") { (view: IconView, color: UIColor?) in
        view.iconColor = color
      }
    }
  }
}
