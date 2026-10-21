import ExpoModulesCore

extension NavigationBarView {
  static func definition() -> ViewDefinition<NavigationBarView> {
    View(NavigationBarView.self) {
      Events("onBack", "onClose")

      Prop("title") { (view: NavigationBarView, title: String?) in
        view.setTitle(title)
      }
      Prop("showsBack") { (view: NavigationBarView, showsBack: Bool) in
        view.setShowsBack(showsBack)
      }
      Prop("showsClose") { (view: NavigationBarView, showsClose: Bool) in
        view.setShowsClose(showsClose)
      }
      Prop("backLabel") { (view: NavigationBarView, label: String?) in
        view.setBackLabel(label)
      }
      Prop("closeLabel") { (view: NavigationBarView, label: String?) in
        view.setCloseLabel(label)
      }
      Prop("backTestID") { (view: NavigationBarView, testID: String?) in
        view.setBackTestID(testID)
      }
      Prop("closeTestID") { (view: NavigationBarView, testID: String?) in
        view.setCloseTestID(testID)
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
