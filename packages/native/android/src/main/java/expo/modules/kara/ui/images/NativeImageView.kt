package expo.modules.kara.ui.images

import android.annotation.SuppressLint
import android.content.Context
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ComposableScope
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.ExpoComposeView
import expo.modules.ui.resolveFontFamily

private const val DEFAULT_HEIGHT = 20f

data class NativeImageProps(
  val source: MutableState<String?> = mutableStateOf(null),
  val imageHeight: MutableState<Float?> = mutableStateOf(null),
  val label: MutableState<String?> = mutableStateOf(null),
  val fontFamily: MutableState<String?> = mutableStateOf(null),
  val fontSize: MutableState<Float?> = mutableStateOf(null),
  val fontWeight: MutableState<String?> = mutableStateOf(null)
) : ComposeProps

/**
 * An image by URL or resource name, raster or SVG, drawn at a height in its own colours: a logo in a segmented button,
 * the way Footshop's platform-ui draws its carriers. It holds its height while it loads, and an image that cannot be
 * loaded falls back to its label, in the surrounding content colour, so the segment still says what it is.
 */
@SuppressLint("ViewConstructor")
class NativeImageView(context: Context, appContext: AppContext) :
  ExpoComposeView<NativeImageProps>(context, appContext) {

  override val props = NativeImageProps()

  @Composable
  override fun ComposableScope.Content() {
    val source by props.source
    val imageHeight by props.imageHeight
    val label by props.label
    val fontFamily by props.fontFamily
    val fontSize by props.fontSize
    val fontWeight by props.fontWeight

    val height = (imageHeight ?: DEFAULT_HEIGHT).dp
    val style = remember(fontFamily, fontSize, fontWeight) {
      TextStyle(
        fontFamily = resolveFontFamily(fontFamily, context),
        fontWeight = fontWeight?.toIntOrNull()?.let { FontWeight(it) } ?: FontWeight.Medium,
        fontSize = fontSize?.sp ?: TextUnit.Unspecified
      )
    }
    val url = source

    if (url == null) {
      label?.let { Text(it, style = style) }
      return
    }

    val heightPx = with(LocalDensity.current) { height.roundToPx() }
    val loaded by produceState<Result<ImageBitmap>?>(null, url, heightPx) {
      val bitmap = NativeImageLoader.loadBitmap(context, url, heightPx)
      value = bitmap?.let { Result.success(it.asImageBitmap()) } ?: Result.failure(IllegalStateException(url))
    }
    val bitmap = loaded?.getOrNull()

    when {
      loaded == null -> Spacer(Modifier.height(height))
      bitmap != null -> Image(bitmap = bitmap, contentDescription = label, modifier = Modifier.height(height))
      else -> Text(label.orEmpty(), style = style)
    }
  }
}
