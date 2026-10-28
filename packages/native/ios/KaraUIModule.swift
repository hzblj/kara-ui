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

    // Whether UIKit takes the status bar style from each screen's view controller (the key's default) or from the app.
    Function("isViewControllerBasedStatusBarAppearance") { () -> Bool in
      Bundle.main.object(forInfoDictionaryKey: "UIViewControllerBasedStatusBarAppearance") as? Bool ?? true
    }

    // Synchronous: a transition asks while it builds its style, once per name and appearance (cached in JS).
    Function("resolveSystemColor") { (names: [String], dark: Bool) -> String? in
      SystemColors.hex(names, dark: dark)
    }

    // Runs once per runtime, and runtimes can start concurrently: both install once per process, thread-safely, and
    // nothing is undone in `OnDestroy` (see `ModifierRegistration`).
    OnCreate {
      OpacityVisibilitySync.install()
      ModifierRegistration.install()
    }

    BlurView.definition()
    ContextMenuView.definition()
    ContextMenuPreviewView.definition()
    ContextMenuExclusionView.definition()
    GlassView.definition()
    IconView.definition()
    LargeTitleFadeView.definition()
    NavigationBarView.definition()
    NavigationItemSearchView.definition()
    NavigationItemSubtitleView.definition()
    ScrollEdgeContainerView.definition()
    SegmentedControlView.definition()
    SheetGrabberView.definition()
    TooltipView.definition()
  }
}
