package expo.modules.kara.ui.modifiers

import android.graphics.Color
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.unit.dp
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.records.recordFromMap
import expo.modules.ui.ModifierRegistry
import expo.modules.ui.composeOrNull

internal const val UNDERLINE_MODIFIER = "underline"

data class UnderlineParams(
  @Field val color: Color? = null,
  @Field val thickness: Float = 1f
) : Record

/**
 * Draws a line along the bottom edge of the modified view — on a text with a fixed line height, the bottom of the line
 * box, where a design system puts a link's underline. `TextDecoration.Underline` sits right under the baseline.
 */
internal fun registerUnderlineModifier() {
  ModifierRegistry.register(UNDERLINE_MODIFIER) { map, _, _, _ ->
    val params = recordFromMap<UnderlineParams>(map)
    val color = params.color.composeOrNull ?: return@register Modifier
    val thickness = params.thickness.dp

    Modifier.drawBehind {
      val stroke = thickness.toPx()
      drawRect(color = color, topLeft = Offset(0f, size.height - stroke), size = Size(size.width, stroke))
    }
  }
}
