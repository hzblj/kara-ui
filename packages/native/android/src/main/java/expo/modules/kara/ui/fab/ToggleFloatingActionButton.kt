package expo.modules.kara.ui.fab

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import androidx.compose.foundation.layout.Box
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.ToggleFloatingActionButton
import androidx.compose.material3.ToggleFloatingActionButtonDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ComposableScope
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.ExpoComposeView
import expo.modules.ui.compose
import expo.modules.ui.findChildSlotView
import expo.modules.ui.renderSlot
import java.io.Serializable

data class ToggleFloatingActionButtonProps(
  val checked: MutableState<Boolean> = mutableStateOf(false),
  val containerColor: MutableState<Color?> = mutableStateOf(null)
) : ComposeProps

open class CheckedChangeEvent(
  @Field open val value: Boolean = false
) : Record, Serializable

@SuppressLint("ViewConstructor")
class ToggleFloatingActionButtonView(context: Context, appContext: AppContext) :
  ExpoComposeView<ToggleFloatingActionButtonProps>(context, appContext) {

  override val props = ToggleFloatingActionButtonProps()
  internal val onCheckedChange by EventDispatcher<CheckedChangeEvent>()

  @OptIn(ExperimentalMaterial3ExpressiveApi::class)
  @Composable
  override fun ComposableScope.Content() {
    val checked by props.checked
    val container by props.containerColor

    val iconSlot = findChildSlotView(this@ToggleFloatingActionButtonView, "icon")
    val iconContent: @Composable () -> Unit = remember(iconSlot) {
      iconSlot?.let { { it.renderSlot() } } ?: {}
    }

    val defaultContainerColor = ToggleFloatingActionButtonDefaults.containerColor()
    val containerColorProvider: (Float) -> androidx.compose.ui.graphics.Color = remember(container) {
      if (container != null) {
        val resolved = container.compose
        { _: Float -> resolved }
      } else {
        defaultContainerColor
      }
    }

    val handleCheckedChange: (Boolean) -> Unit = remember {
      { newChecked -> onCheckedChange(CheckedChangeEvent(newChecked)) }
    }

    ToggleFloatingActionButton(
      checked = checked,
      onCheckedChange = handleCheckedChange,
      containerColor = containerColorProvider
    ) {
      Box(
        modifier = Modifier.graphicsLayer {
          rotationZ = checkedProgress * 45f
        }
      ) {
        iconContent()
      }
    }
  }
}
