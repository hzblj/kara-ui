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
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ComposableScope
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.ExpoComposeView
import expo.modules.ui.composeOrNull

data class DrawableIconProps(
  val resourceName: MutableState<String?> = mutableStateOf(null),
  val iconColor: MutableState<Color?> = mutableStateOf(null),
  val iconSize: MutableState<Float?> = mutableStateOf(null),
  val accessibilityLabel: MutableState<String?> = mutableStateOf(null)
) : ComposeProps

/**
 * An icon inside a Compose host: Material's `Icon` over a vector drawable resource. With no colour it takes the
 * surrounding `LocalContentColor`, so an icon inside a button, FAB or toolbar follows the control's content colour the
 * way a Material icon does.
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

    Icon(
      painter = painterResource(id),
      contentDescription = accessibilityLabel,
      tint = iconColor.composeOrNull ?: LocalContentColor.current,
      modifier = iconSize?.let { Modifier.size(it.dp) } ?: Modifier
    )
  }
}
