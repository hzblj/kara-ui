@file:OptIn(ExperimentalMaterial3Api::class)

package expo.modules.kara.ui.colorpicker

import android.annotation.SuppressLint
import android.content.Context
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.gestures.drag
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.clipPath
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import expo.modules.kara.ui.R
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ComposableScope
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.ExpoComposeView
import java.io.Serializable
import kotlin.math.roundToInt
import kotlinx.coroutines.launch

data class ColorWellProps(
  /** `#RRGGBB` or `#RRGGBBAA`. Read when the sheet opens; while it is open, the sheet's own colour leads. */
  val value: MutableState<String?> = mutableStateOf(null),
  /** Adds the opacity slider, and the alpha to the reported hex. */
  val supportsOpacity: MutableState<Boolean> = mutableStateOf(false),
  /** The sheet's title and the well's accessibility label: the label beside the well. */
  val title: MutableState<String?> = mutableStateOf(null),
  /** Off, the well dims and does not open the sheet. */
  val enabled: MutableState<Boolean> = mutableStateOf(true)
) : ComposeProps

open class ColorWellChangeEvent(
  @Field open val value: String = ""
) : Record, Serializable

/** Hue in degrees, the rest from 0 to 1: the picker's own model, so a grey keeps its hue while it is dragged. */
private data class Hsva(val hue: Float, val saturation: Float, val value: Float, val alpha: Float) {
  val color: Color get() = Color.hsv(hue.coerceIn(0f, 360f), saturation, value, alpha)
}

private fun Color.toHsva(): Hsva {
  val hsv = FloatArray(3)
  android.graphics.Color.colorToHSV(toArgb(), hsv)

  return Hsva(hsv[0], hsv[1], hsv[2], alpha)
}

/** `#RRGGBB` or `#RRGGBBAA`, the shape the iOS picker reports too. */
private fun parseHex(hex: String?): Color? {
  val raw = hex?.removePrefix("#") ?: return null

  return runCatching {
    when (raw.length) {
      6 -> Color(android.graphics.Color.parseColor("#$raw"))
      8 -> Color(android.graphics.Color.parseColor("#${raw.substring(6)}${raw.substring(0, 6)}"))
      else -> null
    }
  }.getOrNull()
}

private fun hexOf(color: Color, withAlpha: Boolean): String {
  val argb = color.toArgb()
  val rgb = "#%06X".format(argb and 0xFFFFFF)

  return if (withAlpha) rgb + "%02X".format((argb ushr 24) and 0xFF) else rgb
}

private val RAINBOW = listOf(
  Color(0xFFFF3B30), Color(0xFFFFCC00), Color(0xFF34C759), Color(0xFF00C7BE),
  Color(0xFF007AFF), Color(0xFFAF52DE), Color(0xFFFF2D55), Color(0xFFFF3B30)
)

/** The columns' hues, as iOS's grid runs them: from cyan-blue through the purples and reds to the greens. */
private val GRID_HUES = listOf(200f, 215f, 250f, 280f, 315f, 345f, 5f, 25f, 40f, 50f, 65f, 95f)

/** Nine rows under the greys: four darker than the pure hue, the pure hue, four paler. */
private val GRID_ROWS = listOf(
  0.32f to 1f, 0.48f to 1f, 0.64f to 1f, 0.8f to 1f, 1f to 1f, 1f to 0.75f, 1f to 0.55f, 1f to 0.38f, 1f to 0.22f
)

private const val GRID_COLUMNS = 12

/** The palette, row by row: twelve greys from white to black, then a hue per column at each row's shade. */
private val GRID: List<List<Color>> = buildList {
  add(List(GRID_COLUMNS) { index -> Color.hsv(0f, 0f, 1f - index / (GRID_COLUMNS - 1f)) })
  GRID_ROWS.forEach { (value, saturation) -> add(GRID_HUES.map { hue -> Color.hsv(hue, saturation, value) }) }
}

private val TABS = listOf("Grid", "Spectrum", "Sliders")

/** Light and dark squares behind a colour that can be see-through, as both platforms' pickers draw it. */
private fun DrawScope.checkerboard(square: Float) {
  drawRect(Color.White)
  var y = 0f
  var row = 0
  while (y < size.height) {
    var x = if (row % 2 == 0) 0f else square
    while (x < size.width) {
      drawRect(Color(0xFFD5D5D9), topLeft = Offset(x, y), size = Size(square, square))
      x += square * 2
    }
    y += square
    row += 1
  }
}

/** A gesture that reports every position from the first touch to the release, clamped to the area. */
private fun Modifier.track(onPosition: (Offset, Size) -> Unit) = pointerInput(Unit) {
  awaitEachGesture {
    val down = awaitFirstDown()
    val area = Size(size.width.toFloat(), size.height.toFloat())
    onPosition(down.position, area)
    drag(down.id) { change ->
      change.consume()
      onPosition(change.position, area)
    }
  }
}

/** The colour well: a rainbow ring around the colour, the way iOS draws `ColorPicker`'s. */
@Composable
private fun Well(color: Color, description: String, enabled: Boolean, onClick: () -> Unit) {
  Box(
    Modifier
      .size(30.dp)
      .alpha(if (enabled) 1f else 0.38f)
      .clip(CircleShape)
      .clickable(enabled = enabled, role = Role.Button, onClickLabel = description, onClick = onClick)
      .semantics { contentDescription = description }
      .drawBehind {
        val ring = 2.5.dp.toPx()
        val gap = 2.dp.toPx()
        val radius = size.minDimension / 2
        drawCircle(Brush.sweepGradient(RAINBOW), radius = radius - ring / 2, style = Stroke(ring))
        val inner = radius - ring - gap
        clipPath(Path().apply { addOval(androidx.compose.ui.geometry.Rect(center, inner)) }) {
          checkerboard(4.dp.toPx())
          drawRect(color)
        }
      }
  )
}

@Composable
private fun PaletteGrid(selected: Color, onPick: (Color) -> Unit) {
  val selectedHex = hexOf(selected.copy(alpha = 1f), withAlpha = false)

  Column(Modifier.fillMaxSize().clip(RoundedCornerShape(10.dp))) {
    GRID.forEach { row ->
      Row(Modifier.fillMaxWidth().weight(1f)) {
        row.forEach { cell ->
          val isSelected = hexOf(cell, withAlpha = false) == selectedHex
          Box(
            Modifier
              .weight(1f)
              .fillMaxSize()
              .background(cell)
              .then(if (isSelected) Modifier.border(3.dp, Color.White, RoundedCornerShape(4.dp)) else Modifier)
              .clickable { onPick(cell) }
          )
        }
      }
    }
  }
}

/** iOS's spectrum: the hues from top to bottom, the pale tints to the left of the pure hue and the shades to its right. */
@Composable
private fun Spectrum(hsva: Hsva, onChange: (Hsva) -> Unit) {
  val hues = remember { Brush.verticalGradient((0..6).map { Color.hsv(it * 60f % 360f, 1f, 1f) }) }
  val shading = remember {
    Brush.horizontalGradient(0f to Color.White, 0.5f to Color.White.copy(alpha = 0f), 0.5f to Color.Black.copy(alpha = 0f), 1f to Color.Black)
  }
  // Where the colour sits: the left half is saturation rising at full brightness, the right brightness falling.
  val x = if (hsva.value >= 1f) hsva.saturation / 2f else 0.5f + (1f - hsva.value) / 2f

  BoxWithConstraints(
    Modifier
      .fillMaxSize()
      .clip(RoundedCornerShape(10.dp))
      .drawBehind {
        drawRect(hues)
        drawRect(shading)
      }
      .track { position, area ->
        val fx = (position.x / area.width).coerceIn(0f, 1f)
        val fy = (position.y / area.height).coerceIn(0f, 1f)
        val saturation = if (fx <= 0.5f) fx * 2f else 1f
        val value = if (fx <= 0.5f) 1f else 1f - (fx - 0.5f) * 2f
        onChange(hsva.copy(hue = fy * 360f, saturation = saturation, value = value))
      }
  ) {
    val density = LocalDensity.current
    val thumb = 26.dp
    val left = with(density) { (constraints.maxWidth * x).toDp() - thumb / 2 }
    val top = with(density) { (constraints.maxHeight * (hsva.hue / 360f)).toDp() - thumb / 2 }
    Box(
      Modifier
        .offset(left, top)
        .size(thumb)
        .shadow(3.dp, CircleShape)
        .background(Color.White, CircleShape)
        .padding(3.dp)
        .background(hsva.color.copy(alpha = 1f), CircleShape)
    )
  }
}

/** A thick, rounded track with a white thumb inside it, like iOS's picker sliders. */
@Composable
private fun GradientSlider(fraction: Float, brush: Brush, checkered: Boolean = false, onChange: (Float) -> Unit) {
  BoxWithConstraints(
    Modifier
      .fillMaxWidth()
      .height(30.dp)
      .clip(CircleShape)
      .drawBehind {
        if (checkered) {
          checkerboard(5.dp.toPx())
        }
        drawRect(brush)
      }
      .track { position, area -> onChange((position.x / area.width).coerceIn(0f, 1f)) }
  ) {
    val density = LocalDensity.current
    val thumb = 26.dp
    val inset = 2.dp
    val travel = with(density) { constraints.maxWidth.toDp() } - thumb - inset * 2
    Box(
      Modifier
        .offset { IntOffset(((inset + travel * fraction).toPx()).roundToInt(), inset.roundToPx()) }
        .size(thumb)
        .shadow(2.dp, CircleShape)
        .background(Color.White, CircleShape)
    )
  }
}

@Composable
private fun LabeledSlider(label: String, reading: String, slider: @Composable () -> Unit) {
  Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
    Row(Modifier.fillMaxWidth()) {
      Text(label.uppercase(), color = MaterialTheme.colorScheme.onSurfaceVariant, style = MaterialTheme.typography.labelMedium)
      Spacer(Modifier.weight(1f))
      Text(reading, color = MaterialTheme.colorScheme.onSurfaceVariant, style = MaterialTheme.typography.labelMedium)
    }
    slider()
  }
}

@Composable
private fun RgbSliders(hsva: Hsva, onChange: (Hsva) -> Unit) {
  val color = hsva.color
  val channels = listOf("Red" to color.red, "Green" to color.green, "Blue" to color.blue)

  Column(Modifier.fillMaxSize(), verticalArrangement = Arrangement.SpaceEvenly) {
    channels.forEachIndexed { index, (label, level) ->
      fun at(channel: Float) = when (index) {
        0 -> color.copy(red = channel)
        1 -> color.copy(green = channel)
        else -> color.copy(blue = channel)
      }
      LabeledSlider(label, "${(level * 255).roundToInt()}") {
        GradientSlider(level, Brush.horizontalGradient(listOf(at(0f).copy(alpha = 1f), at(1f).copy(alpha = 1f)))) {
          // A grey has no hue of its own: keep the one it had, so the spectrum's thumb stays put.
          onChange(at(it).toHsva().let { next -> if (next.saturation == 0f) next.copy(hue = hsva.hue) else next })
        }
      }
    }
  }
}

/**
 * The colour picker Compose does not ship, drawn the way iOS's is: a well with a rainbow ring, which opens a sheet with
 * the system picker's three ways to choose (a grid of swatches, a spectrum, RGB sliders), an opacity slider when asked
 * for, and the colour itself at the foot. Every change is reported as `onValueChange`, as the iOS picker does while it
 * is dragged.
 */
@SuppressLint("ViewConstructor")
class ColorWellView(context: Context, appContext: AppContext) :
  ExpoComposeView<ColorWellProps>(context, appContext) {

  override val props = ColorWellProps()
  internal val onValueChange by EventDispatcher<ColorWellChangeEvent>()

  @Composable
  override fun ComposableScope.Content() {
    val value by props.value
    val supportsOpacity by props.supportsOpacity
    val title by props.title
    val enabled by props.enabled
    var isOpen by remember { mutableStateOf(false) }
    var hsva by remember { mutableStateOf(Hsva(0f, 0f, 1f, 1f)) }
    var tab by remember { mutableIntStateOf(0) }
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val scope = rememberCoroutineScope()
    val shown = if (isOpen) hsva.color else (parseHex(value) ?: Color.White)
    val label = title ?: "Colour"

    fun update(next: Hsva) {
      val clamped = if (supportsOpacity) next else next.copy(alpha = 1f)
      hsva = clamped
      onValueChange(ColorWellChangeEvent(hexOf(clamped.color, withAlpha = supportsOpacity)))
    }

    Well(shown, label, enabled) {
      hsva = (parseHex(value) ?: Color.White).toHsva()
      isOpen = true
    }

    if (isOpen) {
      Sheet(
        hsva = hsva,
        label = label,
        onClose = { scope.launch { sheetState.hide() }.invokeOnCompletion { isOpen = false } },
        onDismiss = { isOpen = false },
        sheetState = sheetState,
        supportsOpacity = supportsOpacity,
        tab = tab,
        onTab = { tab = it },
        update = ::update
      )
    }
  }
}

@Composable
private fun Sheet(
  hsva: Hsva,
  label: String,
  onClose: () -> Unit,
  onDismiss: () -> Unit,
  sheetState: androidx.compose.material3.SheetState,
  supportsOpacity: Boolean,
  tab: Int,
  onTab: (Int) -> Unit,
  update: (Hsva) -> Unit
) {
  ModalBottomSheet(onDismissRequest = onDismiss, sheetState = sheetState) {
    Column(
      Modifier.padding(start = 20.dp, end = 20.dp, bottom = 28.dp),
      verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
      Box(Modifier.fillMaxWidth()) {
        Text(
          label,
          modifier = Modifier.align(Alignment.Center),
          style = MaterialTheme.typography.titleMedium,
          textAlign = TextAlign.Center
        )
        IconButton(modifier = Modifier.align(Alignment.CenterEnd), onClick = onClose) {
          Icon(painterResource(R.drawable.kara_glyph_close), contentDescription = "Close")
        }
      }

      SingleChoiceSegmentedButtonRow(Modifier.fillMaxWidth()) {
        TABS.forEachIndexed { index, name ->
          SegmentedButton(
            onClick = { onTab(index) },
            selected = tab == index,
            shape = SegmentedButtonDefaults.itemShape(index, TABS.size)
          ) {
            Text(name)
          }
        }
      }

      // One size for all three, so the sheet does not change height between them.
      Box(Modifier.fillMaxWidth().aspectRatio(GRID_COLUMNS / GRID.size.toFloat())) {
        when (tab) {
          0 -> PaletteGrid(hsva.color) { update(it.toHsva().copy(alpha = hsva.alpha)) }
          1 -> Spectrum(hsva) { update(it) }
          else -> RgbSliders(hsva) { update(it) }
        }
      }

      if (supportsOpacity) {
        LabeledSlider("Opacity", "${(hsva.alpha * 100).roundToInt()} %") {
          val solid = hsva.color.copy(alpha = 1f)
          GradientSlider(hsva.alpha, Brush.horizontalGradient(listOf(solid.copy(alpha = 0f), solid)), checkered = true) {
            update(hsva.copy(alpha = it))
          }
        }
      }

      Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
        Box(
          Modifier
            .size(44.dp)
            .clip(RoundedCornerShape(12.dp))
            .drawBehind {
              checkerboard(5.dp.toPx())
              drawRect(hsva.color)
            }
        )
        Text(
          hexOf(hsva.color, withAlpha = supportsOpacity),
          color = MaterialTheme.colorScheme.onSurfaceVariant,
          style = MaterialTheme.typography.bodyLarge
        )
      }
    }
  }
}
