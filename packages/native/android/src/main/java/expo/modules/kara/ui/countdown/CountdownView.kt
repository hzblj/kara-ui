package expo.modules.kara.ui.countdown

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Typeface
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.SizeTransform
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.width
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.PlatformTextStyle
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextLayoutResult
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.sp
import com.facebook.react.common.assets.ReactFontManager
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ComposableScope
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.ExpoComposeView
import expo.modules.ui.composeOrNull
import kotlinx.coroutines.delay
import kotlin.math.ceil
import kotlin.math.roundToInt
import androidx.compose.ui.graphics.Color as ComposeColor

private const val MILLIS_PER_SECOND = 1_000L
private const val SECONDS_PER_MINUTE = 60L
private const val SECONDS_PER_HOUR = 3_600L
private const val SECONDS_PER_DAY = 86_400L
private const val DIVIDER = "\u00A0/\u00A0"

data class CountdownProps(
  val endsAt: MutableState<Double> = mutableStateOf(0.0),
  val fontFamily: MutableState<String?> = mutableStateOf(null),
  val fontWeight: MutableState<String> = mutableStateOf("regular"),
  val fontSize: MutableState<Float> = mutableStateOf(12f),
  val color: MutableState<Color?> = mutableStateOf(null),
  val units: MutableState<List<String>> = mutableStateOf(listOf("d", "h", "m", "s")),
  val dividerOpacity: MutableState<Float> = mutableStateOf(0.35f),
  val letterSpacing: MutableState<Float> = mutableStateOf(0f),
  val lineHeight: MutableState<Float> = mutableStateOf(0f)
) : ComposeProps

private data class CountdownTime(val days: Long, val hours: Long, val minutes: Long, val seconds: Long) {
  val hasHours: Boolean
    get() = days > 0 || hours > 0

  companion object {
    fun remaining(endsAt: Long, now: Long): CountdownTime {
      val total = maxOf(0L, Math.round((endsAt - now) / MILLIS_PER_SECOND.toDouble()))
      return CountdownTime(
        days = total / SECONDS_PER_DAY,
        hours = total % SECONDS_PER_DAY / SECONDS_PER_HOUR,
        minutes = total % SECONDS_PER_HOUR / SECONDS_PER_MINUTE,
        seconds = total % SECONDS_PER_MINUTE
      )
    }
  }
}

/**
 * Counts down to `endsAt` (epoch ms), ticking on the whole seconds before the end via `produceState` + `delay`, and
 * slides a changed digit in from above with `AnimatedContent`.
 *
 * The whole countdown is set as one `Text` — an `AnnotatedString` with transparent digits and dimmed dividers — and
 * each animated digit is laid over its glyph box from `TextLayoutResult.getBoundingBox`. Built from separate `Text`s
 * per digit, unit and divider it lost the kerning between them and rounded each to whole pixels, came out about 4 %
 * wider than the one-run text it draws over, and got clipped by the host.
 */
@SuppressLint("ViewConstructor")
class CountdownView(context: Context, appContext: AppContext) :
  ExpoComposeView<CountdownProps>(context, appContext) {

  override val props = CountdownProps()

  @Composable
  override fun ComposableScope.Content() {
    val endsAt by props.endsAt
    val fontFamily by props.fontFamily
    val fontWeight by props.fontWeight
    val fontSize by props.fontSize
    val color by props.color
    val units by props.units
    val dividerOpacity by props.dividerOpacity
    val letterSpacing by props.letterSpacing
    val lineHeight by props.lineHeight

    val endsAtMillis = endsAt.toLong()
    val time by produceState(CountdownTime.remaining(endsAtMillis, System.currentTimeMillis()), endsAtMillis) {
      while (true) {
        val now = System.currentTimeMillis()
        value = CountdownTime.remaining(endsAtMillis, now)
        if (endsAtMillis <= now) {
          break
        }
        val untilNextTick = Math.floorMod(endsAtMillis - now, MILLIS_PER_SECOND).takeIf { it > 0 } ?: MILLIS_PER_SECOND
        delay(untilNextTick)
      }
    }

    val assets = LocalContext.current.assets
    val typeface = remember(fontFamily) {
      fontFamily?.let { ReactFontManager.getInstance().getTypeface(it, Typeface.NORMAL, assets) }
    }
    val contentColor = color.composeOrNull ?: LocalContentColor.current
    val textStyle = TextStyle(
      fontFamily = typeface?.let { FontFamily(it) } ?: FontFamily.Default,
      // A custom face carries its own weight; only the system face takes one.
      fontWeight = if (typeface == null) fontWeight.toFontWeight() else null,
      fontSize = fontSize.sp,
      color = contentColor,
      fontFeatureSettings = "tnum",
      letterSpacing = letterSpacing.sp,
      platformStyle = PlatformTextStyle(includeFontPadding = false)
    )
    val countdownText = time.toCountdownText(units, contentColor.copy(alpha = contentColor.alpha * dividerOpacity))
    var layout by remember { mutableStateOf<TextLayoutResult?>(null) }
    val density = LocalDensity.current
    val halfLeading = rememberHalfLeading(typeface, fontSize, lineHeight)

    Box(
      modifier = Modifier
        .fillMaxSize()
        .offset { IntOffset(0, halfLeading) }
        .clearAndSetSemantics { contentDescription = time.describe(units) }
    ) {
      Text(
        countdownText.text,
        style = textStyle,
        softWrap = false,
        maxLines = 1,
        overflow = TextOverflow.Visible,
        onTextLayout = { layout = it }
      )
      layout?.let { textLayout ->
        countdownText.digits.forEachIndexed { position, (index, digit) ->
          if (index >= textLayout.layoutInput.text.length) {
            return@forEachIndexed
          }
          val box = textLayout.getBoundingBox(index)
          key(position) {
            Digit(
              digit,
              textStyle,
              Modifier
                .offset { IntOffset(box.left.roundToInt(), 0) }
                .width(with(density) { box.width.toDp() })
            )
          }
        }
      }
    }
  }
}

/**
 * React Native's `CustomLineHeightSpan` result for the same text: the half-leading
 * `ceil((lineHeight − (descent − ascent)) / 2)` taken off the ascent. Compose's `LineHeightStyle.Alignment.Center`
 * keeps the whole ascent when the line is shorter than the font, which sat the digits several pixels below the React
 * Native text this draws over — so the text is set at its natural height and offset by this instead. Compose scales
 * `sp` by the font scale itself.
 */
@Composable
private fun rememberHalfLeading(typeface: Typeface?, fontSize: Float, lineHeight: Float): Int {
  val density = LocalDensity.current
  return remember(typeface, fontSize, lineHeight, density) {
    if (lineHeight <= 0f) {
      return@remember 0
    }
    val metrics = Paint().apply {
      this.typeface = typeface
      textSize = with(density) { fontSize.sp.toPx() }
    }.fontMetricsInt
    val lineHeightPx = ceil(with(density) { lineHeight.sp.toPx() }).toInt()
    val leading = lineHeightPx - (metrics.descent - metrics.ascent)
    ceil(leading / 2.0f).toInt()
  }
}

private fun String.toFontWeight(): FontWeight = when (this) {
  "medium" -> FontWeight.Medium
  "semibold" -> FontWeight.SemiBold
  "bold" -> FontWeight.Bold
  else -> FontWeight.Normal
}

private data class CountdownText(val text: AnnotatedString, val digits: List<Pair<Int, Char>>)

private fun CountdownTime.toCountdownText(units: List<String>, dividerColor: ComposeColor): CountdownText {
  val digits = mutableListOf<Pair<Int, Char>>()
  val text = buildAnnotatedString {
    fun segment(value: Long, minimumDigits: Int, unit: String) {
      value.toString().padStart(minimumDigits, '0').forEach { digit ->
        digits.add(length to digit)
        withStyle(SpanStyle(color = ComposeColor.Transparent)) { append(digit) }
      }
      append(unit)
    }

    fun divider() {
      withStyle(SpanStyle(color = dividerColor)) { append(DIVIDER) }
    }

    if (days > 0) {
      segment(days, 1, units.getOrElse(0) { "" })
      divider()
    }
    if (hasHours) {
      segment(hours, 2, units.getOrElse(1) { "" })
      divider()
    }
    segment(minutes, 2, units.getOrElse(2) { "" })
    divider()
    segment(seconds, 2, units.getOrElse(3) { "" })
  }
  return CountdownText(text, digits)
}

@Composable
private fun Digit(digit: Char, style: TextStyle, modifier: Modifier) {
  AnimatedContent(
    targetState = digit,
    transitionSpec = {
      val motion = spring<IntOffset>(stiffness = Spring.StiffnessMediumLow)
      (slideInVertically(motion) { height -> -height } + fadeIn()) togetherWith
        (slideOutVertically(motion) { height -> height } + fadeOut()) using SizeTransform(clip = true)
    },
    modifier = modifier,
    label = "countdownDigit"
  ) { value ->
    Text(
      value.toString(),
      style = style,
      textAlign = TextAlign.Center,
      softWrap = false,
      maxLines = 1,
      overflow = TextOverflow.Visible
    )
  }
}

private fun CountdownTime.describe(units: List<String>): String {
  val parts = mutableListOf<String>()
  if (days > 0) {
    parts.add("$days${units.getOrElse(0) { "" }}")
  }
  if (hasHours) {
    parts.add("$hours${units.getOrElse(1) { "" }}")
  }
  parts.add("$minutes${units.getOrElse(2) { "" }}")
  parts.add("$seconds${units.getOrElse(3) { "" }}")
  return parts.joinToString(" ")
}
