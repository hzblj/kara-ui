package expo.modules.kara.ui

import android.graphics.Color
import expo.modules.kara.ui.fab.FloatingActionButtonMenuItemView
import expo.modules.kara.ui.fab.FloatingActionButtonMenuView
import expo.modules.kara.ui.fab.ToggleFloatingActionButtonView
import expo.modules.kara.ui.blur.BackdropBlurView
import expo.modules.kara.ui.colorpicker.ColorWellView
import expo.modules.kara.ui.icon.DrawableIconView
import expo.modules.kara.ui.images.NativeImageView
import expo.modules.kara.ui.modifiers.ModifierRegistration
import expo.modules.kara.ui.ripple.RippleConfigurationView
import expo.modules.kara.ui.swipe.SwipeActionsBoxView
import expo.modules.kara.ui.text.AnimatedTextView
import expo.modules.kara.ui.tooltip.TooltipBoxView
import expo.modules.kara.ui.topappbar.TopAppBarView
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class KaraUIModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("KaraUI")

    // Runs once per runtime, and runtimes can overlap: the modifiers register once per process, thread-safely, and
    // nothing is undone in `OnDestroy`, which would take them from another live runtime (see `ModifierRegistration`).
    OnCreate {
      ModifierRegistration.install()
    }

    // Each compose view is its own ExpoComposeView subclass — not a `ComposeFunctionHolder`.
    // The functional `ExpoUIView("Name") { props -> ... }` registration uses
    // `viewType = ComposeFunctionHolder::class.java` for every view, which collides with
    // @expo/ui's compose views inside `ModuleRegistry.getModuleHolder(viewClass)` and silently
    // drops our events. Class-based registration gives every view a unique `viewType`.

    View(DrawableIconView::class)

    View(NativeImageView::class)

    View(AnimatedTextView::class)

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

    View(BackdropBlurView::class) {
      Prop("cornerRadius") { view: BackdropBlurView, radius: Float ->
        view.cornerRadius = radius * view.resources.displayMetrics.density
      }
      Prop("glassTint") { view: BackdropBlurView, color: Color? ->
        view.tint = color?.toArgb() ?: Color.TRANSPARENT
      }
      Prop("fallbackTint") { view: BackdropBlurView, color: Color? ->
        view.fallbackTint = color?.toArgb() ?: Color.TRANSPARENT
      }
      Prop("hairlineColor") { view: BackdropBlurView, color: Color? ->
        view.borderColor = color?.toArgb() ?: Color.TRANSPARENT
      }
      Prop("hairlineWidth") { view: BackdropBlurView, width: Float ->
        view.borderWidth = width * view.resources.displayMetrics.density
      }
      Prop("blurRadius") { view: BackdropBlurView, radius: Float ->
        view.blurRadius = radius * view.resources.displayMetrics.density
      }
      Prop("saturation") { view: BackdropBlurView, saturation: Float? ->
        view.saturation = saturation ?: 1f
      }
    }

    View(ColorWellView::class) {
      Events("onValueChange")
    }

    View(RippleConfigurationView::class)

    View(SwipeActionsBoxView::class) {
      Events("onOpenChange")
    }

    View(TopAppBarView::class) {
      Events("onItemPress")
    }
  }
}
