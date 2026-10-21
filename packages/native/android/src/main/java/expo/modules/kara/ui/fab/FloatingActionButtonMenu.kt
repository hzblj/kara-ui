package expo.modules.kara.ui.fab

import android.annotation.SuppressLint
import android.content.Context
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.FloatingActionButtonMenu
import androidx.compose.material3.FloatingActionButtonMenuScope
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.ProvidableCompositionLocal
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.core.view.size
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.types.Enumerable
import expo.modules.kotlin.views.ComposableScope
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.ExpoComposeView
import expo.modules.ui.findChildSlotView
import expo.modules.ui.isSlotView
import expo.modules.ui.renderSlot

enum class FabMenuHorizontalAlignment(val value: String) : Enumerable {
  START("start"),
  CENTER("center"),
  END("end");

  fun toComposeAlignment(): Alignment.Horizontal = when (this) {
    START -> Alignment.Start
    CENTER -> Alignment.CenterHorizontally
    END -> Alignment.End
  }

  fun toBottomAlignment(): Alignment = when (this) {
    START -> Alignment.BottomStart
    CENTER -> Alignment.BottomCenter
    END -> Alignment.BottomEnd
  }
}

data class FloatingActionButtonMenuProps(
  val expanded: MutableState<Boolean> = mutableStateOf(false),
  val horizontalAlignment: MutableState<FabMenuHorizontalAlignment> =
    mutableStateOf(FabMenuHorizontalAlignment.END)
) : ComposeProps

@SuppressLint("ViewConstructor")
class FloatingActionButtonMenuView(context: Context, appContext: AppContext) :
  ExpoComposeView<FloatingActionButtonMenuProps>(context, appContext) {

  override val props = FloatingActionButtonMenuProps()

  @OptIn(ExperimentalMaterial3ExpressiveApi::class)
  @Composable
  override fun ComposableScope.Content() {
    val expanded by props.expanded
    val horizontalAlignment by props.horizontalAlignment

    val buttonSlot = findChildSlotView(this@FloatingActionButtonMenuView, "button")
    val buttonContent: @Composable () -> Unit = remember(buttonSlot) {
      buttonSlot?.let { { it.renderSlot() } } ?: {}
    }

    FloatingActionButtonMenu(
      expanded = expanded,
      button = buttonContent,
      horizontalAlignment = horizontalAlignment.toComposeAlignment(),
      modifier = Modifier
        .fillMaxSize()
        .wrapContentSize(align = horizontalAlignment.toBottomAlignment())
    ) {
      val menuScope: FloatingActionButtonMenuScope = this
      CompositionLocalProvider(LocalFabMenuScope provides menuScope) {
        val scope = ComposableScope()
        for (index in 0 until this@FloatingActionButtonMenuView.size) {
          val child = this@FloatingActionButtonMenuView.getChildAt(index) as? ExpoComposeView<*> ?: continue
          if (isSlotView(child)) continue
          key(child) {
            with(scope) {
              with(child) {
                Content()
              }
            }
          }
        }
      }
    }
  }
}

@OptIn(ExperimentalMaterial3ExpressiveApi::class)
val LocalFabMenuScope: ProvidableCompositionLocal<FloatingActionButtonMenuScope?> =
  compositionLocalOf { null }
