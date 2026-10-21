@file:OptIn(ExperimentalMaterial3Api::class)

package expo.modules.kara.ui.tooltip

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import android.graphics.Rect
import android.view.View
import android.view.ViewTreeObserver
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.LocalMinimumInteractiveComponentSize
import androidx.compose.material3.Surface
import androidx.compose.material3.TooltipBox
import androidx.compose.material3.TooltipDefaults
import androidx.compose.material3.rememberTooltipState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.layout.LayoutCoordinates
import androidx.compose.ui.layout.boundsInWindow
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntRect
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.PopupPositionProvider
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ComposableScope
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.ExpoComposeView
import expo.modules.ui.UIComposableScope
import expo.modules.ui.composeOrNull
import expo.modules.ui.findChildSlotView
import expo.modules.ui.isSlotView
import expo.modules.ui.renderSlot
import java.io.Serializable
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.filter

private val AnchorSpacing = 6.dp
private val WindowMargin = 16.dp
private val ContainerElevation = 3.dp
private val ContentTopPadding = 12.dp
private val ContentBottomPadding = 8.dp
private val ContentHorizontalPadding = 16.dp
private val TextSpacing = 4.dp
private val ActionInset = 4.dp

data class TooltipBoxProps(
  val isPresented: MutableState<Boolean> = mutableStateOf(false),
  val containerColor: MutableState<Color?> = mutableStateOf(null),
  val actionsAlignment: MutableState<String> = mutableStateOf("end"),
  val maxWidth: MutableState<Float?> = mutableStateOf(null),
  val boundaryInsetTop: MutableState<Float> = mutableStateOf(0f),
  val boundaryInsetBottom: MutableState<Float> = mutableStateOf(0f)
) : ComposeProps

open class TooltipDismissRequestEvent(
  @Field open val reason: String = ""
) : Record, Serializable

/**
 * Material 3 `TooltipBox` with the rich tooltip's container — `Surface` with `richTooltipContainerShape`, its colours,
 * 3 dp elevation — but its own content layout: the `RichTooltip` composable puts the action at the start and fixes its
 * paddings, where the M3 kit has the action at the end, 12/4/4/8 dp around the texts and a 40 dp action row. The
 * `action` slot takes any Compose buttons; the view only aligns them and switches
 * `LocalMinimumInteractiveComponentSize` off, because the 48 dp touch target added 4 dp above and below the row.
 *
 * Controlled, like the iOS tooltip: it never hides itself. Passing `onDismissRequest` stops Material from dismissing
 * on its own, and it reports `outside` or `anchorHidden` instead. The popup is not focusable, so any touch outside —
 * the start of a scroll included — requests the dismissal; that is Material's behaviour and differs from iOS, where a
 * scroll keeps the tooltip. `@expo/ui`'s own `TooltipBox` could not be used as is: its rich position provider puts the
 * tooltip above the anchor, and it hides on an outside touch without telling JS.
 */
@SuppressLint("ViewConstructor")
class TooltipBoxView(context: Context, appContext: AppContext) :
  ExpoComposeView<TooltipBoxProps>(context, appContext) {

  override val props = TooltipBoxProps()
  internal val onShown by EventDispatcher<Unit>()
  internal val onDismissRequest by EventDispatcher<TooltipDismissRequestEvent>()

  private var hasRequestedDismiss = false

  private fun requestDismiss(reason: String) {
    if (!props.isPresented.value || hasRequestedDismiss) {
      return
    }
    hasRequestedDismiss = true
    onDismissRequest(TooltipDismissRequestEvent(reason))
  }

  @Composable
  override fun ComposableScope.Content() {
    val isPresented by props.isPresented
    val containerColor by props.containerColor
    val actionsAlignment by props.actionsAlignment
    val maxWidth by props.maxWidth
    val insetTop by props.boundaryInsetTop
    val insetBottom by props.boundaryInsetBottom

    val density = LocalDensity.current
    val hostView = LocalView.current
    val tooltipState = rememberTooltipState(isPersistent = true)
    val anchor = remember { AnchorTracker() }

    val titleSlot = findChildSlotView(this@TooltipBoxView, "title")
    val textSlot = findChildSlotView(this@TooltipBoxView, "text")
    val actionSlot = findChildSlotView(this@TooltipBoxView, "action")

    val positionProvider = remember(density) {
      BelowEndPositionProvider(
        spacing = with(density) { AnchorSpacing.roundToPx() },
        margin = with(density) { WindowMargin.roundToPx() }
      )
    }

    LaunchedEffect(isPresented) {
      if (isPresented) {
        hasRequestedDismiss = false
        tooltipState.show()
      }
    }

    LaunchedEffect(tooltipState) {
      snapshotFlow { tooltipState.transition.currentState && tooltipState.transition.isIdle }
        .distinctUntilChanged()
        .filter { it }
        .collect { onShown(Unit) }
    }

    DisposableEffect(isPresented, hostView, insetTop, insetBottom) {
      if (!isPresented) {
        return@DisposableEffect onDispose {}
      }

      val check = {
        if (tooltipState.isVisible && !anchor.isVisible(hostView, density.density * insetTop, density.density * insetBottom)) {
          requestDismiss("anchorHidden")
        }
      }
      val scrollListener = ViewTreeObserver.OnScrollChangedListener { check() }
      val layoutListener = ViewTreeObserver.OnGlobalLayoutListener { check() }
      hostView.viewTreeObserver.addOnScrollChangedListener(scrollListener)
      hostView.viewTreeObserver.addOnGlobalLayoutListener(layoutListener)

      onDispose {
        hostView.viewTreeObserver.removeOnScrollChangedListener(scrollListener)
        hostView.viewTreeObserver.removeOnGlobalLayoutListener(layoutListener)
      }
    }

    TooltipBox(
      positionProvider = positionProvider,
      tooltip = {
        Surface(
          modifier = Modifier.widthIn(max = maxWidth?.dp ?: TooltipDefaults.richTooltipMaxWidth),
          shape = TooltipDefaults.richTooltipContainerShape,
          color = containerColor.composeOrNull ?: TooltipDefaults.richTooltipColors().containerColor,
          shadowElevation = ContainerElevation
        ) {
          Column(modifier = Modifier.padding(top = ContentTopPadding, bottom = ContentBottomPadding)) {
            Column(
              modifier = Modifier.padding(horizontal = ContentHorizontalPadding),
              verticalArrangement = Arrangement.spacedBy(TextSpacing)
            ) {
              titleSlot?.renderSlot()
              textSlot?.renderSlot()
            }
            actionSlot?.let { slot ->
              Box(
                modifier = Modifier
                  .fillMaxWidth()
                  .padding(top = TextSpacing, start = ActionInset, end = ActionInset),
                contentAlignment = if (actionsAlignment == "start") Alignment.CenterStart else Alignment.CenterEnd
              ) {
                CompositionLocalProvider(LocalMinimumInteractiveComponentSize provides Dp.Unspecified) {
                  slot.renderSlot()
                }
              }
            }
          }
        }
      },
      state = tooltipState,
      onDismissRequest = { requestDismiss("outside") },
      focusable = false,
      enableUserInput = false,
      hasAction = actionSlot != null
    ) {
      Box(modifier = Modifier.onGloballyPositioned { anchor.coordinates = it }) {
        Children(UIComposableScope(), filter = { !isSlotView(it) })
      }
    }
  }
}

private class AnchorTracker {
  var coordinates: LayoutCoordinates? = null

  private val visibleRect = Rect()

  fun isVisible(hostView: View, insetTop: Float, insetBottom: Float): Boolean {
    val coordinates = coordinates?.takeIf { it.isAttached } ?: return false
    if (!hostView.getGlobalVisibleRect(visibleRect)) {
      return false
    }
    val windowHeight = hostView.rootView.height
    val top = maxOf(visibleRect.top.toFloat(), insetTop)
    val bottom = minOf(visibleRect.bottom.toFloat(), windowHeight - insetBottom)
    val bounds = coordinates.boundsInWindow()
    val center: Offset = bounds.center
    return center.y in top..bottom && center.x >= visibleRect.left && center.x <= visibleRect.right
  }
}

private class BelowEndPositionProvider(
  private val spacing: Int,
  private val margin: Int
) : PopupPositionProvider {
  override fun calculatePosition(
    anchorBounds: IntRect,
    windowSize: IntSize,
    layoutDirection: LayoutDirection,
    popupContentSize: IntSize
  ): IntOffset {
    val preferredX = if (layoutDirection == LayoutDirection.Ltr) {
      anchorBounds.right - popupContentSize.width
    } else {
      anchorBounds.left
    }
    val maxX = maxOf(windowSize.width - margin - popupContentSize.width, margin)
    return IntOffset(preferredX.coerceIn(margin, maxX), anchorBounds.bottom + spacing)
  }
}
