import ExpoModulesCore

public class KaraUIModule: Module {
  public func definition() -> ModuleDefinition {
    Name("KaraUI")

    // The scroll edge effect and Liquid Glass arrived together in iOS 26, so one check answers both.
    Function("isScrollEdgeEffectAvailable") { () -> Bool in
      if #available(iOS 26.0, *) {
        return true
      }
      return false
    }

    // Synchronous: a transition asks while it builds its style, once per name and appearance (cached in JS).
    Function("resolveSystemColor") { (names: [String], dark: Bool) -> String? in
      SystemColors.hex(names, dark: dark)
    }

    OnCreate {
      OpacityVisibilitySync.install()
      CounterBadgeModifier.register()
      ScaledFontModifier.register()
      UnderlineModifier.register()
    }

    BlurView.definition()
    ContextMenuView.definition()
    ContextMenuPreviewView.definition()
    ContextMenuExclusionView.definition()
    GlassView.definition()
    IconView.definition()
    NavigationBarView.definition()
    ScrollEdgeContainerView.definition()
    ScrollViewZPositionView.definition()
    SegmentedControlView.definition()
    TooltipView.definition()
  }
}
