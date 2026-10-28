import ExpoModulesCore

extension NavigationItemSearchView {
  static func definition() -> ViewDefinition<NavigationItemSearchView> {
    View(NavigationItemSearchView.self) {
      Events("onVoiceAction")

      Prop("disableForceFlatten") { (_: NavigationItemSearchView, _: Bool) in }
      Prop("voice") { (view: NavigationItemSearchView, record: SearchVoiceRecord?) in
        view.setVoice(record)
      }
      Prop("voiceMeter") { (view: NavigationItemSearchView, meter: SharedObject?) in
        view.accessory.meter = meter
      }
      Prop("clearImageName") { (view: NavigationItemSearchView, name: String?) in
        view.appearance.clearImageName = name
      }
      Prop("cancelImageName") { (view: NavigationItemSearchView, name: String?) in
        view.appearance.cancelImageName = name
      }
    }
  }
}
