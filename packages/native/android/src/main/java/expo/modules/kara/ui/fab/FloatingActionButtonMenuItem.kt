package expo.modules.kara.ui.fab

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.FloatingActionButtonMenuItem
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ComposableScope
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.ExpoComposeView
import expo.modules.ui.composeOrNull
import expo.modules.ui.findChildSlotView
import expo.modules.ui.renderSlot
import java.io.Serializable

data class FloatingActionButtonMenuItemProps(
  val containerColor: MutableState<Color?> = mutableStateOf(null),
  val contentColor: MutableState<Color?> = mutableStateOf(null)
) : ComposeProps

open class ItemPressedEvent() : Record, Serializable

@SuppressLint("ViewConstructor")
class FloatingActionButtonMenuItemView(context: Context, appContext: AppContext) :
  ExpoComposeView<FloatingActionButtonMenuItemProps>(context, appContext) {

  override val props = FloatingActionButtonMenuItemProps()
  internal val onItemPressed by EventDispatcher<ItemPressedEvent>()

  @OptIn(ExperimentalMaterial3ExpressiveApi::class)
  @Composable
  override fun ComposableScope.Content() {
    val menuScope = LocalFabMenuScope.current ?: return
    val containerColor by props.containerColor
    val contentColor by props.contentColor

    val iconSlot = findChildSlotView(this@FloatingActionButtonMenuItemView, "icon")
    val textSlot = findChildSlotView(this@FloatingActionButtonMenuItemView, "text")
    val iconContent: @Composable () -> Unit = remember(iconSlot) {
      iconSlot?.let { { it.renderSlot() } } ?: {}
    }
    val textContent: @Composable () -> Unit = remember(textSlot) {
      textSlot?.let { { it.renderSlot() } } ?: {}
    }

    val onClick: () -> Unit = remember { { onItemPressed(ItemPressedEvent()) } }
    val composedContainer = containerColor.composeOrNull
    val composedContent = contentColor.composeOrNull

    with(menuScope) {
      when {
        composedContainer != null && composedContent != null -> FloatingActionButtonMenuItem(
          onClick = onClick,
          text = textContent,
          icon = iconContent,
          containerColor = composedContainer,
          contentColor = composedContent
        )
        composedContainer != null -> FloatingActionButtonMenuItem(
          onClick = onClick,
          text = textContent,
          icon = iconContent,
          containerColor = composedContainer
        )
        composedContent != null -> FloatingActionButtonMenuItem(
          onClick = onClick,
          text = textContent,
          icon = iconContent,
          contentColor = composedContent
        )
        else -> FloatingActionButtonMenuItem(
          onClick = onClick,
          text = textContent,
          icon = iconContent
        )
      }
    }
  }
}
