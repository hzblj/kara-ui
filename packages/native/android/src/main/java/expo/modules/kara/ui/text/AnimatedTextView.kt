package expo.modules.kara.ui.text

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.AnimationSpec
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.snap
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.sp
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.views.ComposableScope
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.ExpoComposeView
import expo.modules.ui.ModifierList
import expo.modules.ui.ModifierRegistry
import expo.modules.ui.TextFontWeight
import expo.modules.ui.composeOrNull
import expo.modules.ui.resolveFontFamily
import java.io.Serializable

/** A run of the text in a colour of its own; without one it takes the text's. */
class AnimatedTextSpanRecord(
  @Field val text: String = "",
  @Field val color: Color? = null
) : Record, Serializable

/**
 * How a colour moves to its next value: `spring` (kara's spring tokens and `smoothOut`, a no-bounce spring over its
 * duration) or `tween` along a cubic bézier.
 */
class TextAnimationRecord(
  @Field val type: String = "spring",
  @Field val dampingRatio: Float = 1f,
  @Field val stiffness: Float = 632f,
  @Field val durationMillis: Int = 250,
  @Field val delayMillis: Int = 0,
  @Field val easing: List<Float>? = null
) : Record, Serializable

data class AnimatedTextProps(
  val spans: MutableState<List<AnimatedTextSpanRecord>> = mutableStateOf(emptyList()),
  val textColor: MutableState<Color?> = mutableStateOf(null),
  val fontFamily: MutableState<String?> = mutableStateOf(null),
  val fontFeatureSettings: MutableState<String?> = mutableStateOf(null),
  val fontSize: MutableState<Float?> = mutableStateOf(null),
  val fontWeight: MutableState<TextFontWeight?> = mutableStateOf(null),
  val lineHeight: MutableState<Float?> = mutableStateOf(null),
  val textAlign: MutableState<String?> = mutableStateOf(null),
  val textDecoration: MutableState<String?> = mutableStateOf(null),
  val maxLines: MutableState<Int?> = mutableStateOf(null),
  val animation: MutableState<TextAnimationRecord?> = mutableStateOf(null),
  val modifiers: MutableState<ModifierList> = mutableStateOf(emptyList())
) : ComposeProps

/**
 * Compose `Text` over runs of colour that move to their next colour on a spring or a curve instead of switching: what
 * `Text` with `animate` and spans draws on Android, where `@expo/ui`'s text takes spans but animates none of them. Each
 * run keeps its own animation by position, so a run that changes colour eases there while the rest stay put.
 *
 * It is also what `Text` draws with `monospacedDigit` (`fontFeatureSettings` `tnum`), which `@expo/ui`'s text cannot
 * set. Without an `animation` a colour switches, as it does there.
 */
@SuppressLint("ViewConstructor")
class AnimatedTextView(context: Context, appContext: AppContext) :
  ExpoComposeView<AnimatedTextProps>(context, appContext) {

  override val props = AnimatedTextProps()

  @Composable
  override fun ComposableScope.Content() {
    val spans by props.spans
    val textColor by props.textColor
    val fontFamily by props.fontFamily
    val fontFeatureSettings by props.fontFeatureSettings
    val fontSize by props.fontSize
    val fontWeight by props.fontWeight
    val lineHeight by props.lineHeight
    val textAlign by props.textAlign
    val textDecoration by props.textDecoration
    val maxLines by props.maxLines
    val animation by props.animation
    val modifiers by props.modifiers

    val spec = remember(animation) { animationSpec(animation) }
    val base = textColor.composeOrNull ?: LocalContentColor.current
    val colors = spans.mapIndexed { index, span ->
      key(index) {
        animateColorAsState(span.color.composeOrNull ?: base, spec, label = "span").value
      }
    }

    Text(
      text = buildAnnotatedString {
        spans.forEachIndexed { index, span ->
          withStyle(SpanStyle(color = colors[index])) { append(span.text) }
        }
      },
      modifier = ModifierRegistry.applyModifiers(modifiers, appContext, this, globalEventDispatcher),
      maxLines = maxLines ?: Int.MAX_VALUE,
      overflow = TextOverflow.Ellipsis,
      style = TextStyle(
        color = base,
        fontFamily = resolveFontFamily(fontFamily, context),
        fontFeatureSettings = fontFeatureSettings,
        fontSize = fontSize?.sp ?: TextUnit.Unspecified,
        fontWeight = fontWeight?.toComposeFontWeight(),
        lineHeight = lineHeight?.sp ?: TextUnit.Unspecified,
        textAlign = when (textAlign) {
          "center" -> TextAlign.Center
          "right" -> TextAlign.Right
          "left" -> TextAlign.Left
          else -> TextAlign.Unspecified
        },
        textDecoration = when (textDecoration) {
          "underline" -> TextDecoration.Underline
          "lineThrough" -> TextDecoration.LineThrough
          else -> null
        }
      )
    )
  }
}

private fun animationSpec(animation: TextAnimationRecord?): AnimationSpec<androidx.compose.ui.graphics.Color> {
  if (animation == null) {
    return snap()
  }
  if (animation.type == "spring") {
    return spring(dampingRatio = animation.dampingRatio, stiffness = animation.stiffness)
  }
  val easing = animation.easing?.takeIf { it.size == 4 }?.let { CubicBezierEasing(it[0], it[1], it[2], it[3]) }
  return if (easing != null) {
    tween(durationMillis = animation.durationMillis, delayMillis = animation.delayMillis, easing = easing)
  } else {
    tween(durationMillis = animation.durationMillis, delayMillis = animation.delayMillis)
  }
}
