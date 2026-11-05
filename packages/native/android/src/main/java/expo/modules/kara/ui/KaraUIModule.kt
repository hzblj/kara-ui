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
import expo.modules.kara.ui.navigationitemsearch.NavigationItemSearchView
import expo.modules.kara.ui.ripple.RippleConfigurationView
import expo.modules.kara.ui.searchfield.SearchFieldView
import expo.modules.kara.ui.searchfield.SearchVoiceSizes
import expo.modules.kara.ui.swipe.SwipeActionsBoxView
import expo.modules.kara.ui.text.AnimatedTextView
import expo.modules.kara.ui.tooltip.TooltipBoxView
import expo.modules.kara.ui.topappbar.TopAppBarView
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.sharedobjects.SharedObject
import expo.modules.kotlin.types.ColorCompat

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
      Prop("intensity") { view: BackdropBlurView, intensity: Float? ->
        view.intensity = (intensity ?: 1f).coerceIn(0f, 1f)
      }
      Prop("glassTint") { view: BackdropBlurView, color: Color? ->
        view.tint = color?.let { ColorCompat.toArgb(it) } ?: Color.TRANSPARENT
      }
      Prop("fallbackTint") { view: BackdropBlurView, color: Color? ->
        view.fallbackTint = color?.let { ColorCompat.toArgb(it) } ?: Color.TRANSPARENT
      }
      Prop("hairlineColor") { view: BackdropBlurView, color: Color? ->
        view.borderColor = color?.let { ColorCompat.toArgb(it) } ?: Color.TRANSPARENT
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

    View(NavigationItemSearchView::class) {
      Events("onVoiceAction")

      Prop("clearIconName") { view: NavigationItemSearchView, name: String? ->
        view.clearIconName = name
        view.applyCloseAppearance()
      }
      Prop("iconColor") { view: NavigationItemSearchView, color: Color? ->
        view.iconColor.value = color
      }
      Prop("microphoneIconName") { view: NavigationItemSearchView, name: String? ->
        view.microphoneIconName.value = name
      }
      Prop("microphoneLabel") { view: NavigationItemSearchView, label: String? ->
        view.microphoneLabel.value = label
      }
      Prop("rippleColor") { view: NavigationItemSearchView, color: Color? ->
        view.rippleColor.value = color
        view.applyCloseAppearance()
      }
      Prop("stopContainerColor") { view: NavigationItemSearchView, color: Color? ->
        view.stopContainerColor.value = color
      }
      Prop("stopIconName") { view: NavigationItemSearchView, name: String? ->
        view.stopIconName.value = name
      }
      Prop("stopLabel") { view: NavigationItemSearchView, label: String? ->
        view.stopLabel.value = label
      }
      Prop("voiceEnabled") { view: NavigationItemSearchView, enabled: Boolean? ->
        val value = enabled ?: false
        if (view.voiceEnabled.value != value) {
          view.voiceEnabled.value = value
          view.refreshAttachment()
        }
      }
      Prop("voiceListening") { view: NavigationItemSearchView, listening: Boolean? ->
        view.listening.value = listening ?: false
      }
      Prop("voiceMeter") { view: NavigationItemSearchView, meter: SharedObject? ->
        view.meter.value = meter
      }
      Prop("voiceSizes") { view: NavigationItemSearchView, sizes: SearchVoiceSizes? ->
        view.sizes.value = sizes
      }
    }

    View(RippleConfigurationView::class)

    View(SearchFieldView::class) {
      Events("onQueryChange", "onSearchFocusChange", "onSearchSubmit")

      AsyncFunction("clearQuery") { view: SearchFieldView ->
        view.clearQuery()
      }.runOnQueue(Queues.MAIN)

      AsyncFunction("setQuery") { view: SearchFieldView, text: String ->
        view.setQuery(text)
      }.runOnQueue(Queues.MAIN)

      AsyncFunction("focusField") { view: SearchFieldView ->
        view.focusField()
      }.runOnQueue(Queues.MAIN)

      AsyncFunction("blurField") { view: SearchFieldView ->
        view.blurField()
      }.runOnQueue(Queues.MAIN)
    }

    View(SwipeActionsBoxView::class) {
      Events("onOpenChange")
    }

    View(TopAppBarView::class) {
      Events("onItemPress")
    }
  }
}
