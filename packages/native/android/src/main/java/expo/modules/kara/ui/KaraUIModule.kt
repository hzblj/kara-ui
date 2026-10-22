package expo.modules.kara.ui

import android.graphics.Color
import expo.modules.kara.ui.fab.FloatingActionButtonMenuItemView
import expo.modules.kara.ui.fab.FloatingActionButtonMenuView
import expo.modules.kara.ui.fab.ToggleFloatingActionButtonView
import expo.modules.kara.ui.icon.DrawableIconView
import expo.modules.kara.ui.icon.IconView
import expo.modules.kara.ui.modifiers.UNDERLINE_MODIFIER
import expo.modules.kara.ui.modifiers.registerUnderlineModifier
import expo.modules.kara.ui.ripple.RippleConfigurationView
import expo.modules.kara.ui.tooltip.TooltipBoxView
import expo.modules.kara.ui.topappbar.TopAppBarView
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.ui.ModifierRegistry

class KaraUIModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("KaraUI")

    OnCreate {
      registerUnderlineModifier()
    }

    OnDestroy {
      ModifierRegistry.unregister(UNDERLINE_MODIFIER)
    }

    // Each compose view is its own ExpoComposeView subclass — not a `ComposeFunctionHolder`.
    // The functional `ExpoUIView("Name") { props -> ... }` registration uses
    // `viewType = ComposeFunctionHolder::class.java` for every view, which collides with
    // @expo/ui's compose views inside `ModuleRegistry.getModuleHolder(viewClass)` and silently
    // drops our events. Class-based registration gives every view a unique `viewType`.

    View(DrawableIconView::class)

    View(IconView::class) {
      Prop("resourceName") { view: IconView, name: String? ->
        view.setResourceName(name)
      }
      Prop("iconColor") { view: IconView, color: Color? ->
        view.setIconColor(color)
      }
    }

    View(FloatingActionButtonMenuView::class)

    View(FloatingActionButtonMenuItemView::class) {
      Events("onItemPressed")
    }

    View(ToggleFloatingActionButtonView::class) {
      Events("onCheckedChange")
    }

    View(TooltipBoxView::class) {
      Events("onShown", "onDismissRequest")
    }

    View(RippleConfigurationView::class)

    View(TopAppBarView::class) {
      Events("onItemPress")
    }
  }
}
