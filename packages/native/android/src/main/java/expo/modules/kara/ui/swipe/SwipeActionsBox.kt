package expo.modules.kara.ui.swipe

import android.annotation.SuppressLint
import android.content.Context
import androidx.compose.foundation.gestures.AnchoredDraggableDefaults
import androidx.compose.foundation.gestures.AnchoredDraggableState
import androidx.compose.foundation.gestures.DraggableAnchors
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.gestures.anchoredDraggable
import androidx.compose.foundation.gestures.animateTo
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.interaction.DragInteraction
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.graphics.drawscope.clipRect
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ComposableScope
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.ExpoComposeView
import expo.modules.ui.UIComposableScope
import expo.modules.ui.findChildSlotView
import expo.modules.ui.isSlotView
import expo.modules.ui.renderSlot
import java.io.Serializable
import kotlin.math.abs
import kotlin.math.roundToInt
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.drop
import kotlinx.coroutines.launch

/** Past half the actions' width a released row opens; short of it, it closes. A fling decides on its own. */
private const val OPEN_THRESHOLD = 0.5f

enum class SwipeActionsValue(val edge: String) {
  Closed("none"),
  Leading("leading"),
  Trailing("trailing")
}

data class SwipeActionsBoxProps(
  /** `leading`, `trailing`, or anything else for closed. Controlled — a drag reports through `onOpenChange`. */
  val openEdge: MutableState<String?> = mutableStateOf(null),
  /** Between the actions and the row's edge as it slides away, in dp. */
  val actionsSpacing: MutableState<Float> = mutableStateOf(0f),
  /** Between the actions and the box's own edge, in dp. */
  val actionsInset: MutableState<Float> = mutableStateOf(0f)
) : ComposeProps

open class SwipeActionsOpenChangeEvent(
  @Field open val edge: String = "none"
) : Record, Serializable

/**
 * A row that slides sideways to uncover the actions behind it — the `leading` and `trailing` slots, each measured and
 * anchored at its own width. Compose has no swipe actions of its own; this is `AnchoredDraggableState` with the same
 * three rests iOS has (closed, leading open, trailing open). The actions show only in the strip the row has vacated, so
 * a half-open row never draws them under its own content, and fade in as it goes. While open, a tap on the row closes
 * it instead of reaching the row.
 */
@SuppressLint("ViewConstructor")
class SwipeActionsBoxView(context: Context, appContext: AppContext) :
  ExpoComposeView<SwipeActionsBoxProps>(context, appContext) {

  override val props = SwipeActionsBoxProps()
  internal val onOpenChange by EventDispatcher<SwipeActionsOpenChangeEvent>()

  @Composable
  override fun ComposableScope.Content() {
    val openEdge by props.openEdge
    val actionsSpacing by props.actionsSpacing
    val actionsInset by props.actionsInset

    val density = LocalDensity.current
    val hostView = LocalView.current
    val scope = rememberCoroutineScope()
    val state = remember { AnchoredDraggableState(SwipeActionsValue.Closed) }
    val interactionSource = remember { MutableInteractionSource() }
    var leadingWidth by remember { mutableIntStateOf(0) }
    var trailingWidth by remember { mutableIntStateOf(0) }
    val leadingSlot = findChildSlotView(this@SwipeActionsBoxView, "leading")
    val trailingSlot = findChildSlotView(this@SwipeActionsBoxView, "trailing")
    // Open, the row stops `actionsSpacing` short of the actions, which sit `actionsInset` from the box's edge.
    val inset = with(density) { actionsInset.dp.toPx() }
    val clearance = inset + with(density) { actionsSpacing.dp.toPx() }
    val leadingOffset = if (leadingSlot != null && leadingWidth > 0) leadingWidth + clearance else 0f
    val trailingOffset = if (trailingSlot != null && trailingWidth > 0) -(trailingWidth + clearance) else 0f
    val target = SwipeActionsValue.entries.firstOrNull { it.edge == openEdge } ?: SwipeActionsValue.Closed

    LaunchedEffect(leadingOffset, trailingOffset, target) {
      state.updateAnchors(
        DraggableAnchors {
          SwipeActionsValue.Closed at 0f
          if (leadingOffset > 0f) {
            SwipeActionsValue.Leading at leadingOffset
          }
          if (trailingOffset < 0f) {
            SwipeActionsValue.Trailing at trailingOffset
          }
        }
      )
      val settleAt = if (state.anchors.hasPositionFor(target)) target else SwipeActionsValue.Closed
      if (state.settledValue != settleAt) {
        state.animateTo(settleAt)
      }
    }

    LaunchedEffect(state) {
      snapshotFlow { state.settledValue }
        .distinctUntilChanged()
        .drop(1)
        .collect { onOpenChange(SwipeActionsOpenChangeEvent(it.edge)) }
    }

    // Once the drag is ours, the scroll view the list sits in must not take it back.
    LaunchedEffect(interactionSource) {
      interactionSource.interactions.collect { interaction ->
        if (interaction is DragInteraction.Start) {
          hostView.parent?.requestDisallowInterceptTouchEvent(true)
        }
      }
    }

    // Clipped: the row slides off its own bounds, not over the list's padding beside it.
    Box(
      modifier = Modifier.fillMaxWidth().clipToBounds().anchoredDraggable(
        state = state,
        orientation = Orientation.Horizontal,
        enabled = leadingOffset > 0f || trailingOffset < 0f,
        interactionSource = interactionSource,
        flingBehavior = AnchoredDraggableDefaults.flingBehavior(
          state = state,
          positionalThreshold = { distance -> distance * OPEN_THRESHOLD }
        )
      )
    ) {
      leadingSlot?.let { slot ->
        Box(
          modifier = Modifier
            .align(Alignment.CenterStart)
            .padding(start = actionsInset.dp)
            .onSizeChanged { leadingWidth = it.width }
            .revealed(state, leadingOffset, inset, fromStart = true)
        ) {
          slot.renderSlot()
        }
      }
      trailingSlot?.let { slot ->
        Box(
          modifier = Modifier
            .align(Alignment.CenterEnd)
            .padding(end = actionsInset.dp)
            .onSizeChanged { trailingWidth = it.width }
            .revealed(state, trailingOffset, inset, fromStart = false)
        ) {
          slot.renderSlot()
        }
      }
      Box(modifier = Modifier.offset { IntOffset(state.currentOffset().roundToInt(), 0) }) {
        Children(UIComposableScope(), filter = { !isSlotView(it) })
        // Read in composition, so only the settled value: the offset changes every frame of a drag.
        if (state.settledValue != SwipeActionsValue.Closed) {
          Box(
            modifier = Modifier
              .matchParentSize()
              .pointerInput(Unit) {
                detectTapGestures { scope.launch { state.animateTo(SwipeActionsValue.Closed) } }
              }
          )
        }
      }
    }
  }
}

private fun AnchoredDraggableState<SwipeActionsValue>.currentOffset(): Float = offset.takeUnless { it.isNaN() } ?: 0f

/**
 * Draws one edge's actions only inside the strip the row has slid off — measured from the box's edge, `inset` outside
 * the actions themselves — and fades them in on the way.
 */
private fun Modifier.revealed(
  state: AnchoredDraggableState<SwipeActionsValue>,
  openOffset: Float,
  inset: Float,
  fromStart: Boolean
): Modifier =
  graphicsLayer {
    alpha = revealFraction(state.currentOffset(), openOffset)
  }.drawWithContent {
    val vacated = revealFraction(state.currentOffset(), openOffset) * abs(openOffset)
    if (fromStart) {
      clipRect(right = vacated - inset) { this@drawWithContent.drawContent() }
    } else {
      clipRect(left = size.width + inset - vacated) { this@drawWithContent.drawContent() }
    }
  }

private fun revealFraction(offset: Float, openOffset: Float): Float =
  if (openOffset != 0f) (offset / openOffset).coerceIn(0f, 1f) else 0f
