import ExpoModulesCore

extension ContextMenuView {
  static func definition() -> ViewDefinition<ContextMenuView> {
    View(ContextMenuView.self) {
      Events("onSelectItem", "onPreviewPress")

      Prop("items") { (view: ContextMenuView, items: [ContextMenuActionRecord]) in
        view.items = items
      }
      Prop("previewTransition") { (view: ContextMenuView, transition: String?) in
        view.previewTransition = transition
      }
    }
  }
}
