import ExpoModulesCore

extension SegmentedControlView {
  static func definition() -> ViewDefinition<SegmentedControlView> {
    View(SegmentedControlView.self) {
      Events("onValueChange")

      Prop("options") { (view: SegmentedControlView, options: [SegmentedControlRecord]) in
        view.setOptions(options)
      }
      Prop("selectedValue") { (view: SegmentedControlView, value: String) in
        view.setSelectedValue(value)
      }
      Prop("disabled") { (view: SegmentedControlView, disabled: Bool?) in
        view.setDisabled(disabled ?? false)
      }
      Prop("activePillColor") { (view: SegmentedControlView, color: UIColor) in
        view.setActivePillColor(color)
      }
      Prop("activeTextColor") { (view: SegmentedControlView, color: UIColor) in
        view.setActiveTextColor(color)
      }
      Prop("inactiveTextColor") { (view: SegmentedControlView, color: UIColor) in
        view.setInactiveTextColor(color)
      }
      Prop("trackColor") { (view: SegmentedControlView, color: UIColor?) in
        view.setTrackColor(color)
      }
      Prop("fontFamily") { (view: SegmentedControlView, family: String?) in
        view.setFontFamily(family)
      }
      Prop("fontSize") { (view: SegmentedControlView, size: Double) in
        view.setFontSize(size)
      }
      Prop("cornerRadius") { (view: SegmentedControlView, radius: Double?) in
        view.setCornerRadius(radius)
      }
      Prop("pillCornerRadius") { (view: SegmentedControlView, radius: Double?) in
        view.setPillCornerRadius(radius)
      }
    }
  }
}
