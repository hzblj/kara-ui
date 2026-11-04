import ExpoModulesCore

extension TabBarExpandOnScrollUpView {
  static func definition() -> ViewDefinition<TabBarExpandOnScrollUpView> {
    View(TabBarExpandOnScrollUpView.self) {
      Prop("disableForceFlatten") { (_: TabBarExpandOnScrollUpView, _: Bool) in }
    }
  }
}
