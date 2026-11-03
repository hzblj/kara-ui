package expo.modules.kara.ui.navigationitemsearch

import android.annotation.SuppressLint
import android.content.Context
import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.drawable.Drawable
import android.graphics.drawable.RippleDrawable
import android.os.SystemClock
import android.text.Editable
import android.text.TextWatcher
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.view.ViewParent
import android.view.ViewTreeObserver
import android.widget.EditText
import android.widget.ImageView
import android.widget.LinearLayout
import androidx.appcompat.widget.SearchView
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.material.ripple.RippleAlpha
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.LocalRippleConfiguration
import androidx.compose.material3.RippleConfiguration
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.unit.dp
import expo.modules.kara.ui.icon.resourceId
import expo.modules.kara.ui.searchfield.DrawableIcon
import expo.modules.kara.ui.searchfield.ICON_SCALE
import expo.modules.kara.ui.searchfield.SearchVoiceSizes
import expo.modules.kara.ui.searchfield.VoiceMeter
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.sharedobjects.SharedObject
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView
import expo.modules.ui.composeOrNull
import androidx.compose.ui.graphics.Color as ComposeColor

/**
 * Dresses react-native-screens' toolbar search (an appcompat `SearchView`, the Android side of a header's
 * `integratedButton` search), the way `NavigationItemSearchView` dresses the navigation item's search bar on iOS. A
 * zero-size view in the screen's tree that finds the `SearchView` in its own screen's `AppBarLayout`: the `Screen`
 * ancestor's siblings in the fragment's coordinator layout, never another screen of the stack. react-native-screens
 * creates it after the screen mounts and replaces it now and then, so the first attach is retried for about 5 s and a
 * global layout re-attaches when the old one went.
 *
 * With `voiceEnabled` it puts a `ComposeView` into the field's `search_plate`, before the X: the microphone while the
 * field is empty, the waveform and the tonal stop button while listening. The X (clear, or close when empty) moves out
 * of the plate to right after it, so it keeps its place in the toolbar's corner, the plate's underline ends before it,
 * and nothing jumps when the voice starts. The X gets the ripple of Material's icon buttons (a 20 dp circle in
 * `rippleColor`) instead of appcompat's borderless one, which spread over the toolbar's corner, and `clearIconName` as
 * its glyph. Detaching puts everything back, the X into the plate only once it has really left its new parent: a
 * screen leaving with its disappear animation keeps the removed X as a disappearing child, and adding it back while it
 * still had that parent crashed.
 */
@SuppressLint("ViewConstructor")
class NavigationItemSearchView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  internal val onVoiceAction by EventDispatcher<Map<String, String>>()

  internal val voiceEnabled = mutableStateOf(false)
  internal val listening = mutableStateOf(false)
  internal val meter = mutableStateOf<SharedObject?>(null)
  internal val microphoneIconName = mutableStateOf<String?>(null)
  internal val stopIconName = mutableStateOf<String?>(null)
  internal val microphoneLabel = mutableStateOf<String?>(null)
  internal val stopLabel = mutableStateOf<String?>(null)
  internal val iconColor = mutableStateOf<Color?>(null)
  internal val stopContainerColor = mutableStateOf<Color?>(null)
  internal val sizes = mutableStateOf<SearchVoiceSizes?>(null)
  internal val rippleColor = mutableStateOf<Color?>(null)
  internal var clearIconName: String? = null

  private val hasText = mutableStateOf(false)
  private var attachment: Attachment? = null
  private var attachDeadline = 0L
  private val retryAttach = Runnable { attachOrRetry() }
  private val layoutListener = ViewTreeObserver.OnGlobalLayoutListener { reattachIfStale() }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    attachDeadline = SystemClock.uptimeMillis() + ATTACH_TIMEOUT_MS
    viewTreeObserver.addOnGlobalLayoutListener(layoutListener)
    attachOrRetry()
  }

  override fun onDetachedFromWindow() {
    removeCallbacks(retryAttach)
    viewTreeObserver.removeOnGlobalLayoutListener(layoutListener)
    detach()
    super.onDetachedFromWindow()
  }

  /** Applies `rippleColor` and `clearIconName` to the moved X; called on attach and whenever either changes. */
  internal fun applyCloseAppearance() {
    val placement = attachment?.closePlacement ?: return
    val button = placement.button

    rippleColor.value?.let { color ->
      button.background = RippleDrawable(ColorStateList.valueOf(color.toArgb()), null, null).apply {
        radius = (CLOSE_RIPPLE_RADIUS_DP * resources.displayMetrics.density).toInt()
      }
    }

    val image = button as? ImageView ?: return
    val id = resourceId(context, clearIconName)
    if (id != 0) {
      image.setImageResource(id)
    } else {
      image.setImageDrawable(placement.drawable)
    }
  }

  private fun attachOrRetry() {
    if (attachment != null) {
      return
    }

    val searchView = findSearchView()
    if (searchView != null) {
      attach(searchView)
      return
    }

    if (SystemClock.uptimeMillis() < attachDeadline) {
      postDelayed(retryAttach, ATTACH_RETRY_MS)
    }
  }

  private fun reattachIfStale() {
    val current = attachment ?: return
    val accessoryInPlace = current.accessory == null || current.accessory.parent === current.plate
    if (current.searchView.isAttachedToWindow && accessoryInPlace) {
      return
    }

    detach()
    attachDeadline = SystemClock.uptimeMillis() + ATTACH_TIMEOUT_MS
    attachOrRetry()
  }

  private fun findSearchView(): SearchView? {
    var node: ViewParent? = parent
    while (node != null) {
      if (node.javaClass.name == SCREEN_CLASS_NAME) {
        val screen = node as View
        val container = screen.parent as? ViewGroup ?: return null
        for (index in 0 until container.childCount) {
          val child = container.getChildAt(index)
          if (child !== screen) {
            findSearchViewIn(child)?.let { return it }
          }
        }
        return null
      }
      node = node.parent
    }
    return null
  }

  private fun findSearchViewIn(view: View): SearchView? {
    if (view is SearchView) {
      return view
    }

    if (view !is ViewGroup) {
      return null
    }

    for (index in 0 until view.childCount) {
      findSearchViewIn(view.getChildAt(index))?.let { return it }
    }
    return null
  }

  private fun attach(searchView: SearchView) {
    val plate = searchView.findViewById<ViewGroup>(androidx.appcompat.R.id.search_plate) ?: return
    val closeButton = searchView.findViewById<View>(androidx.appcompat.R.id.search_close_btn)
    val textView = searchView.findViewById<EditText>(androidx.appcompat.R.id.search_src_text)

    val closePlacement = closeButton?.let { moveOutOfPlate(it, plate) }
    val accessory = if (voiceEnabled.value) {
      ComposeView(context).apply {
        setContent { Accessory(onStart = { startListening(textView) }, onStop = { stopListening() }) }
      }
    } else {
      null
    }
    accessory?.let {
      val index = closeButton?.takeIf { button -> button.parent === plate }?.let(plate::indexOfChild) ?: plate.childCount
      val params = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.WRAP_CONTENT,
        LinearLayout.LayoutParams.MATCH_PARENT
      ).apply { gravity = Gravity.CENTER_VERTICAL }
      plate.addView(it, index, params)
    }

    val watcher = object : TextWatcher {
      override fun beforeTextChanged(text: CharSequence?, start: Int, count: Int, after: Int) = Unit
      override fun onTextChanged(text: CharSequence?, start: Int, before: Int, count: Int) = Unit
      override fun afterTextChanged(text: Editable?) {
        hasText.value = !text.isNullOrEmpty()
      }
    }
    textView?.addTextChangedListener(watcher)
    hasText.value = !textView?.text.isNullOrEmpty()

    attachment = Attachment(searchView, plate, accessory, textView, watcher, closePlacement)
    applyCloseAppearance()
  }

  /** Re-attaches, so a change of `voiceEnabled` adds or removes the microphone. */
  internal fun refreshAttachment() {
    if (attachment == null) {
      return
    }

    detach()
    attachDeadline = SystemClock.uptimeMillis() + ATTACH_TIMEOUT_MS
    attachOrRetry()
  }

  private fun moveOutOfPlate(closeButton: View, plate: ViewGroup): ClosePlacement? {
    val frame = plate.parent as? ViewGroup ?: return null
    if (closeButton.parent !== plate) {
      return null
    }

    val index = plate.indexOfChild(closeButton)
    val params = closeButton.layoutParams
    val background = closeButton.background
    val drawable = (closeButton as? ImageView)?.drawable
    plate.removeView(closeButton)
    frame.addView(closeButton, frame.indexOfChild(plate) + 1, params)
    return ClosePlacement(closeButton, index, params, background, drawable)
  }

  private fun detach() {
    val current = attachment ?: return
    attachment = null
    current.textView?.removeTextChangedListener(current.watcher)
    current.accessory?.let { (it.parent as? ViewGroup)?.removeView(it) }
    current.closePlacement?.let { placement ->
      placement.button.background = placement.background
      (placement.button as? ImageView)?.setImageDrawable(placement.drawable)
      (placement.button.parent as? ViewGroup)?.removeView(placement.button)
      if (placement.button.parent == null) {
        current.plate.addView(placement.button, placement.index.coerceAtMost(current.plate.childCount), placement.params)
      }
    }
  }

  private fun startListening(textView: EditText?) {
    textView?.requestFocus()
    onVoiceAction(mapOf("action" to "start"))
  }

  private fun stopListening() {
    onVoiceAction(mapOf("action" to "stop"))
  }

  @Composable
  private fun Accessory(onStart: () -> Unit, onStop: () -> Unit) {
    val isListening by listening
    val text by hasText
    val voiceMeter by meter
    val micIcon by microphoneIconName
    val stopIcon by stopIconName
    val micLabel by microphoneLabel
    val stopText by stopLabel
    val icon by iconColor
    val stopContainer by stopContainerColor
    val voiceSizes by sizes
    val ripple by rippleColor

    val tint = icon.composeOrNull ?: LocalContentColor.current
    val rippleConfiguration = remember(ripple) { ripple.composeOrNull?.toRippleConfiguration() }

    val content: @Composable () -> Unit = {
      CompositionLocalProvider(LocalContentColor provides tint) {
        Row(verticalAlignment = Alignment.CenterVertically) {
          if (isListening) {
            VoiceMeter(voiceMeter, tint, voiceSizes?.waveform)
            val container = stopContainer.composeOrNull
            FilledTonalIconButton(
              onClick = onStop,
              colors = if (container == null) {
                IconButtonDefaults.filledTonalIconButtonColors()
              } else {
                IconButtonDefaults.filledTonalIconButtonColors(containerColor = container, contentColor = tint)
              },
              modifier = voiceSizes?.stopButtonSize?.let { Modifier.size(it.dp) } ?: Modifier
            ) {
              DrawableIcon(stopIcon, stopText)
            }
          } else {
            AnimatedVisibility(
              visible = !text,
              enter = fadeIn() + scaleIn(initialScale = ICON_SCALE),
              exit = fadeOut() + scaleOut(targetScale = ICON_SCALE)
            ) {
              IconButton(onClick = onStart) {
                DrawableIcon(micIcon, micLabel, voiceSizes?.microphoneIconSize)
              }
            }
          }
        }
      }
    }

    if (rippleConfiguration == null) {
      content()
      return
    }

    CompositionLocalProvider(LocalRippleConfiguration provides rippleConfiguration) {
      content()
    }
  }

  private class Attachment(
    val searchView: SearchView,
    val plate: ViewGroup,
    val accessory: ComposeView?,
    val textView: EditText?,
    val watcher: TextWatcher,
    val closePlacement: ClosePlacement?
  )

  private class ClosePlacement(
    val button: View,
    val index: Int,
    val params: ViewGroup.LayoutParams,
    val background: Drawable?,
    val drawable: Drawable?
  )
}

private fun ComposeColor.toRippleConfiguration(): RippleConfiguration {
  val opacity = alpha
  return RippleConfiguration(
    color = copy(alpha = 1f),
    rippleAlpha = RippleAlpha(
      draggedAlpha = opacity,
      focusedAlpha = opacity,
      hoveredAlpha = opacity,
      pressedAlpha = opacity
    )
  )
}

private const val SCREEN_CLASS_NAME = "com.swmansion.rnscreens.Screen"
private const val ATTACH_TIMEOUT_MS = 5_000L
private const val ATTACH_RETRY_MS = 100L
private const val CLOSE_RIPPLE_RADIUS_DP = 20f
