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

    OnCreate {
      CounterBadgeModifier.register()
      ScaledFontModifier.register()
      UnderlineModifier.register()
    }

    ContextMenuView.definition()
    ContextMenuPreviewView.definition()
    ContextMenuExclusionView.definition()
    CountdownView.definition()
    GlassView.definition()
    NavigationBarView.definition()
    ScrollEdgeContainerView.definition()
    TooltipView.definition()
  }
}
