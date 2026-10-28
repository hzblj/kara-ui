import ExpoModulesCore

extension SheetGrabberView {
  static func definition() -> ViewDefinition<SheetGrabberView> {
    View(SheetGrabberView.self) {
      Prop("disableForceFlatten") { (_: SheetGrabberView, _: Bool) in }
      Prop("grabberVisible") { (view: SheetGrabberView, isVisible: Bool?) in
        view.isGrabberVisible = isVisible ?? true
      }
    }
  }
}
