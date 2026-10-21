package expo.modules.kara.ui.ripple

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import androidx.compose.material.ripple.RippleAlpha
import androidx.compose.material3.LocalRippleConfiguration
import androidx.compose.material3.RippleConfiguration
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ComposableScope
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.ExpoComposeView
import expo.modules.ui.composeOrNull

data class RippleConfigurationProps(
  val color: MutableState<Color?> = mutableStateOf(null)
) : ComposeProps

/**
 * Provides `LocalRippleConfiguration` to its Compose children, so every Material ripple takes one colour instead of
 * the content colour. Material replaces a ripple colour's own alpha with `RippleAlpha`, so the colour is split: the
 * opaque colour, plus its alpha as every state's alpha. No colour leaves Material's default — passing a `null`
 * configuration would switch ripples off.
 */
@SuppressLint("ViewConstructor")
class RippleConfigurationView(context: Context, appContext: AppContext) :
  ExpoComposeView<RippleConfigurationProps>(context, appContext) {

  override val props = RippleConfigurationProps()

  @Composable
  override fun ComposableScope.Content() {
    val color by props.color
    val configuration = remember(color) { color.composeOrNull?.toRippleConfiguration() }

    if (configuration == null) {
      Children(this)
      return
    }

    CompositionLocalProvider(LocalRippleConfiguration provides configuration) {
      Children(this)
    }
  }
}

private fun androidx.compose.ui.graphics.Color.toRippleConfiguration(): RippleConfiguration {
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
