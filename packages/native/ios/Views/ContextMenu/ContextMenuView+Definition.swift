import ExpoModulesCore

extension ContextMenuView {
  static func definition() -> ViewDefinition<ContextMenuView> {
    View(ContextMenuView.self) {
      Events("onSelectItem", "onPreviewPress", "onMenuOpen", "onMenuClose")

      Prop("items") { (view: ContextMenuView, items: [ContextMenuActionRecord]) in
        view.items = items
      }

      Prop("previewTransition") { (view: ContextMenuView, transition: String?) in
        view.previewTransition = transition
      }

      Prop("preloadedScreenId") { (view: ContextMenuView, screenId: String?) in
        view.preloadedScreenId = screenId
      }
    }
  }
}
