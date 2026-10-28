import ExpoModulesCore

extension NavigationItemSubtitleView {
  static func definition() -> ViewDefinition<NavigationItemSubtitleView> {
    View(NavigationItemSubtitleView.self) {
      Prop("disableForceFlatten") { (_: NavigationItemSubtitleView, _: Bool) in }
      Prop("subtitle") { (view: NavigationItemSubtitleView, subtitle: String) in
        view.subtitle = subtitle
      }
      Prop("subtitleHidden") { (view: NavigationItemSubtitleView, isHidden: Bool?) in
        view.subtitleHidden = isHidden ?? false
      }
      Prop("fontFamily") { (view: NavigationItemSubtitleView, family: String?) in
        view.fontFamily = family
      }
      Prop("fontSize") { (view: NavigationItemSubtitleView, size: Double?) in
        view.fontSize = CGFloat(size ?? Double(UIFont.smallSystemFontSize))
      }
      Prop("letterSpacing") { (view: NavigationItemSubtitleView, spacing: Double?) in
        view.letterSpacing = CGFloat(spacing ?? 0)
      }
      Prop("color") { (view: NavigationItemSubtitleView, color: UIColor?) in
        view.color = color ?? .secondaryLabel
      }
    }
  }
}
