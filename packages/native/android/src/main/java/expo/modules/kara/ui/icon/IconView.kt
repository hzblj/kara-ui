package expo.modules.kara.ui.icon

import android.annotation.SuppressLint
import android.content.Context
import android.content.res.ColorStateList
import android.graphics.Color
import android.widget.ImageView
import androidx.core.widget.ImageViewCompat
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

/**
 * An icon outside any Compose host — the React Native tier. Draws a vector drawable resource by name, tinted: the app's
 * own icons the config plugin generated (`kara_icon_*`) or the glyphs kara's components use (`kara_glyph_*`). React
 * Native's own `Image` cannot do this — Fresco decodes bitmaps, not vector XML.
 */
@SuppressLint("ViewConstructor", "DiscouragedApi")
class IconView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  override val shouldUseAndroidLayout = true

  private val imageView = ImageView(context).apply {
    scaleType = ImageView.ScaleType.FIT_CENTER
    importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_NO
    layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
  }

  init {
    addView(imageView)
  }

  fun setResourceName(name: String?) {
    val id = resourceId(context, name)

    if (id == 0) {
      imageView.setImageDrawable(null)
      return
    }

    imageView.setImageResource(id)
  }

  fun setIconColor(color: Color?) {
    ImageViewCompat.setImageTintList(imageView, color?.let { ColorStateList.valueOf(it.toArgb()) })
  }
}

/** A drawable by name — the app's resources first, where both kara's glyphs and the plugin's icons are merged. */
@SuppressLint("DiscouragedApi")
internal fun resourceId(context: Context, name: String?): Int =
  name?.let { context.resources.getIdentifier(it, "drawable", context.packageName) } ?: 0
