import ExpoModulesCore

extension InlineLargeTitleView {
  static func definition() -> ViewDefinition<InlineLargeTitleView> {
    View(InlineLargeTitleView.self) {
      Prop("disableForceFlatten") { (_: InlineLargeTitleView, _: Bool) in }
    }
  }
}
