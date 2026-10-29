package expo.modules.kara.ui.icon

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import com.hzblj.exponativeicons.NativeIconEffectRecord
import com.hzblj.exponativeicons.NativeIconView
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ComposableScope
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.ExpoComposeView
import expo.modules.ui.composeOrNull

data class DrawableIconProps(
  val resourceName: MutableState<String?> = mutableStateOf(null),
  val iconColor: MutableState<Color?> = mutableStateOf(null),
  val iconSize: MutableState<Float?> = mutableStateOf(null),
  val accessibilityLabel: MutableState<String?> = mutableStateOf(null),
  val renderingMode: MutableState<String?> = mutableStateOf(null),
  val secondaryColor: MutableState<Color?> = mutableStateOf(null),
  val tertiaryColor: MutableState<Color?> = mutableStateOf(null),
  val variableValue: MutableState<Double?> = mutableStateOf(null),
  val gradient: MutableState<Boolean?> = mutableStateOf(null),
  val transition: MutableState<String?> = mutableStateOf(null),
  val effect: MutableState<NativeIconEffectRecord?> = mutableStateOf(null),
  val effectTrigger: MutableState<String?> = mutableStateOf(null),
  val effectActive: MutableState<Boolean?> = mutableStateOf(null)
) : ComposeProps {
  /** Whether anything asks for what only expo-native-icons' view draws: Material's `Icon` only tints a drawable. */
  val needsNativeIcon: Boolean
    get() = effect.value != null || transition.value != null || variableValue.value != null ||
      gradient.value == true || (renderingMode.value ?: "monochrome") != "monochrome"
}

/**
 * An icon inside a Compose host: Material's `Icon` over a vector drawable resource. With no colour it takes the
 * surrounding `LocalContentColor`, so an icon inside a button, FAB or toolbar follows the control's content colour the
 * way a Material icon does.
 *
 * An effect, a transition, a rendering mode, a variable value or a gradient need the drawable's paths as layers and a
 * frame loop, which `@hzblj/expo-native-icons`' `NativeIconView` has: then that view draws it, in an `AndroidView`,
 * with the same colour, so `Icon` and `RnIcon` play the same effects.
 */
@SuppressLint("ViewConstructor")
class DrawableIconView(context: Context, appContext: AppContext) :
  ExpoComposeView<DrawableIconProps>(context, appContext) {

  override val props = DrawableIconProps()

  @Composable
  override fun ComposableScope.Content() {
    val resourceName by props.resourceName
    val iconColor by props.iconColor
    val iconSize by props.iconSize
    val accessibilityLabel by props.accessibilityLabel
    val id = remember(resourceName) { resourceId(context, resourceName) }

    if (id == 0) {
      return
    }

    val tint = iconColor.composeOrNull ?: LocalContentColor.current
    val sizeModifier = Modifier.size((iconSize ?: DEFAULT_SIZE).dp)

    if (!props.needsNativeIcon) {
      Icon(
        painter = painterResource(id),
        contentDescription = accessibilityLabel,
        tint = tint,
        modifier = iconSize?.let { Modifier.size(it.dp) } ?: Modifier
      )
      return
    }

    val semantics = Modifier.semantics {
      accessibilityLabel?.let {
        contentDescription = it
        role = Role.Image
      }
    }
    val tintArgb = tint.toArgb()
    val renderingMode by props.renderingMode
    val secondaryColor by props.secondaryColor
    val tertiaryColor by props.tertiaryColor
    val variableValue by props.variableValue
    val gradient by props.gradient
    val transition by props.transition
    val effect by props.effect
    val effectTrigger by props.effectTrigger
    val effectActive by props.effectActive

    AndroidView(
      factory = { NativeIconView(it, appContext) },
      modifier = sizeModifier.then(semantics),
      update = { view ->
        view.resourceName = resourceName
        view.iconColor = Color.valueOf(tintArgb)
        view.renderingMode = renderingMode
        view.secondaryColor = secondaryColor
        view.tertiaryColor = tertiaryColor
        view.variableValue = variableValue
        view.gradient = gradient ?: false
        view.transition = transition
        view.effect = effect
        view.effectTrigger = effectTrigger
        view.effectActive = effectActive ?: true
        view.applyProps()
      }
    )
  }

  private companion object {
    const val DEFAULT_SIZE = 24f
  }
}

/** A drawable by name in the app's resources, where kara's glyphs and the plugin's icons are both merged. */
@SuppressLint("DiscouragedApi")
internal fun resourceId(context: Context, name: String?): Int =
  name?.let { context.resources.getIdentifier(it, "drawable", context.packageName) } ?: 0
