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

    // Synchronous and fire-and-forget: the call returns at once and the feedback plays on the next main-queue turn,
    // with no promise for JS to settle.
    Function("playHaptic") { (haptic: Haptic, intensity: Double?) in
      DispatchQueue.main.async {
        Haptics.play(haptic, intensity: intensity)
      }
    }

    Function("prepareHaptic") { (haptic: Haptic) in
      DispatchQueue.main.async {
        Haptics.prepare(haptic)
      }
    }

    OnCreate {
      OpacityVisibilitySync.install()
      CounterBadgeModifier.register()
      ScaledFontModifier.register()
      UnderlineModifier.register()
    }

    ContextMenuView.definition()
    ContextMenuPreviewView.definition()
    ContextMenuExclusionView.definition()
    GlassView.definition()
    IconView.definition()
    NavigationBarView.definition()
    ScrollEdgeContainerView.definition()
    TooltipView.definition()
    ZoomTransitionSourceView.definition()
    ZoomTransitionTargetView.definition()
    ZoomTransitionEnablerView.definition()
  }
}
