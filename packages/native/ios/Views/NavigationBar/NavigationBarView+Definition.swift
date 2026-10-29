import ExpoModulesCore

extension NavigationBarView {
  static func definition() -> ViewDefinition<NavigationBarView> {
    View(NavigationBarView.self) {
      Events("onItemPress", "onSearchTextChange", "onSearchFocusChange", "onSearchVoiceAction")

      AsyncFunction("clearSearchText") { (view: NavigationBarView) in
        view.clearSearchText()
      }.runOnQueue(.main)

      AsyncFunction("setSearchText") { (view: NavigationBarView, text: String) in
        view.setSearchText(text)
      }.runOnQueue(.main)

      Prop("title") { (view: NavigationBarView, title: String?) in
        view.setTitle(title)
      }
      Prop("titleAlignment") { (view: NavigationBarView, alignment: String?) in
        view.setTitleAlignment(alignment ?? "center")
      }
      Prop("titleVisible") { (view: NavigationBarView, isVisible: Bool?) in
        view.setTitleVisible(isVisible ?? true)
      }
      Prop("leadingItems") { (view: NavigationBarView, items: [NavigationBarItemRecord]?) in
        view.setItems((items ?? []).map(NavigationBarItem.init(record:)), placement: .leading)
      }
      Prop("trailingItems") { (view: NavigationBarView, items: [NavigationBarItemRecord]?) in
        view.setItems((items ?? []).map(NavigationBarItem.init(record:)), placement: .trailing)
      }
      Prop("searchPlaceholder") { (view: NavigationBarView, placeholder: String?) in
        view.setSearchPlaceholder(placeholder)
      }
      Prop("searchTestID") { (view: NavigationBarView, testID: String?) in
        view.setSearchTestID(testID)
      }
      Prop("searchPlacement") { (view: NavigationBarView, placement: NavigationBarSearchPlacement?) in
        view.setSearchPlacement(placement ?? .stacked)
      }
      Prop("searchButtonPlacement") { (view: NavigationBarView, placement: NavigationBarSearchButtonPlacement?) in
        view.setSearchButtonPlacement(placement ?? .trailing)
      }
      Prop("searchButtonImageName") { (view: NavigationBarView, name: String?) in
        view.setSearchButtonImageName(name)
      }
      Prop("searchButtonLabel") { (view: NavigationBarView, label: String?) in
        view.setSearchButtonLabel(label)
      }
      Prop("searchCancelImageName") { (view: NavigationBarView, name: String?) in
        view.setSearchCancelImageName(name)
      }
      Prop("searchCancelLabel") { (view: NavigationBarView, label: String?) in
        view.setSearchCancelLabel(label)
      }
      Prop("searchClearImageName") { (view: NavigationBarView, name: String?) in
        view.setSearchClearImageName(name)
      }
      Prop("searchVoice") { (view: NavigationBarView, record: SearchVoiceRecord?) in
        view.setSearchVoice(record)
      }
      Prop("searchVoiceMeter") { (view: NavigationBarView, meter: SharedObject?) in
        view.setSearchVoiceMeter(meter)
      }
      Prop("itemColor") { (view: NavigationBarView, color: UIColor) in
        view.setItemColor(color)
      }
      Prop("titleColor") { (view: NavigationBarView, color: UIColor) in
        view.setTitleColor(color)
      }
      Prop("fontFamily") { (view: NavigationBarView, family: String?) in
        view.setFontFamily(family)
      }
      Prop("fontSize") { (view: NavigationBarView, size: Double) in
        view.setFontSize(size)
      }
    }
  }
}
