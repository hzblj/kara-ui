import ExpoModulesCore

extension NavigationItemMorphView {
  static func definition() -> ViewDefinition<NavigationItemMorphView> {
    View(NavigationItemMorphView.self) {
      Prop("disableForceFlatten") { (_: NavigationItemMorphView, _: Bool) in }
      Prop("itemIdentifier") { (view: NavigationItemMorphView, identifier: String) in
        view.itemIdentifier = identifier
      }
      Prop("label") { (view: NavigationItemMorphView, label: String) in
        view.label = label
      }
      Prop("imageName") { (view: NavigationItemMorphView, imageName: String) in
        view.imageName = imageName
      }
      Prop("itemColor") { (view: NavigationItemMorphView, color: UIColor?) in
        view.itemColor = color ?? .label
      }
      Prop("collapsed") { (view: NavigationItemMorphView, collapsed: Bool?) in
        view.collapsed = collapsed ?? false
      }
    }
  }
}
