package expo.modules.kara.ui

import android.graphics.Color
import expo.modules.kara.ui.fab.FloatingActionButtonMenuItemView
import expo.modules.kara.ui.fab.FloatingActionButtonMenuView
import expo.modules.kara.ui.fab.ToggleFloatingActionButtonView
import expo.modules.kara.ui.haptics.Haptic
import expo.modules.kara.ui.haptics.Haptics
import expo.modules.kara.ui.icon.DrawableIconView
import expo.modules.kara.ui.icon.IconView
import expo.modules.kara.ui.modifiers.UNDERLINE_MODIFIER
import expo.modules.kara.ui.modifiers.registerUnderlineModifier
import expo.modules.kara.ui.ripple.RippleConfigurationView
import expo.modules.kara.ui.tooltip.TooltipBoxView
import expo.modules.kara.ui.topappbar.TopAppBarView
import expo.modules.kara.ui.zoomtransition.ZoomTransitionEnablerView
import expo.modules.kara.ui.zoomtransition.ZoomTransitionRegistry
import expo.modules.kara.ui.zoomtransition.ZoomTransitionSourceView
import expo.modules.kara.ui.zoomtransition.ZoomTransitionTargetView
import expo.modules.kotlin.functions.Queues
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

    // Synchronous and fire-and-forget, like on iOS. `intensity` is iOS-only: a system haptic has no amplitude, and
    // the vibrator that has one is what this module never falls back to.
    Function("playHaptic") { haptic: Haptic, _: Double? ->
      Haptics.play(appContext, haptic)
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

    View(ZoomTransitionSourceView::class) {
      Prop("identifier") { view: ZoomTransitionSourceView, identifier: String? ->
        view.identifier = identifier
      }
      Prop("cornerRadius") { view: ZoomTransitionSourceView, radius: Float ->
        view.cornerRadius = radius * view.resources.displayMetrics.density
      }
    }

    View(ZoomTransitionTargetView::class) {
      Prop("identifier") { view: ZoomTransitionTargetView, identifier: String? ->
        view.identifier = identifier
      }
      Prop("cornerRadius") { view: ZoomTransitionTargetView, radius: Float ->
        view.cornerRadius = radius * view.resources.displayMetrics.density
      }
      Prop("isFittedToSourceAspectRatio") { view: ZoomTransitionTargetView, isFitted: Boolean ->
        view.isFittedToSourceAspectRatio = isFitted
      }
    }

    View(ZoomTransitionEnablerView::class) {
      Prop("sourceIdentifier") { view: ZoomTransitionEnablerView, identifier: String? ->
        view.sourceIdentifier = identifier
      }
      Prop("transformDuration") { view: ZoomTransitionEnablerView, duration: Int? ->
        view.options = view.options.copy(durationMs = (duration ?: 450).toLong())
      }
      Prop("easing") { view: ZoomTransitionEnablerView, easing: String? ->
        view.options = view.options.copy(easing = easing ?: "emphasized")
      }
      Prop("fadeMode") { view: ZoomTransitionEnablerView, fadeMode: String? ->
        view.options = view.options.copy(fadeMode = fadeMode ?: "cross")
      }
      Prop("pathMotion") { view: ZoomTransitionEnablerView, pathMotion: String? ->
        view.options = view.options.copy(pathMotion = pathMotion ?: "arc")
      }
      Prop("scrimColor") { view: ZoomTransitionEnablerView, color: Color? ->
        view.options = view.options.copy(scrimColor = color?.toArgb() ?: Color.TRANSPARENT)
      }
    }

    // The pop is native and starts before JavaScript hears of it, so the way back is started from `beforeRemove`.
    AsyncFunction("reverseZoomTransition") { identifier: String ->
      (ZoomTransitionRegistry.target(identifier) as? ZoomTransitionTargetView)?.reverse()
    }.runOnQueue(Queues.MAIN)
  }
}
