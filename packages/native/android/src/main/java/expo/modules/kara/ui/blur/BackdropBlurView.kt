package expo.modules.kara.ui.blur

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.ColorMatrix
import android.graphics.ColorMatrixColorFilter
import android.graphics.Outline
import android.graphics.Paint
import android.graphics.RectF
import android.graphics.RenderEffect
import android.graphics.RenderNode
import android.graphics.Shader
import android.os.Build
import android.view.View
import android.view.ViewGroup
import android.view.ViewOutlineProvider
import android.view.ViewTreeObserver
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

/**
 * What lies behind the view, blurred, under a tint and an optional hairline — the blurred surfaces Android 16's
 * Material 3 Expressive gives its own system UI. Behind kara's `GlassView` (frosted glass) and `BlurView` (iOS's
 * materials, in Android's terms) on this platform.
 *
 * Android 12+ (API 31): before every frame what lies behind the view is recorded into a `RenderNode` — the views'
 * own display lists, so it is cheap and keeps hardware bitmaps — offset to where this view sits, and drawn here
 * through a `RenderEffect` blur. Re-recording the node is enough for the next frame to show
 * it: the view's own display list holds the node, not a copy, so nothing is invalidated and no frame is asked for.
 * Older Android has no `RenderEffect`; there the tint is drawn near-opaque instead, so the content stays readable.
 *
 * The children are React Native's, laid out by it: `onLayout` is a no-op, as `ExpoView` is a `LinearLayout`. The shape
 * is the outline, so it clips the backdrop and the children alike.
 */
@SuppressLint("ViewConstructor")
class BackdropBlurView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private val backdrop: RenderNode? = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) RenderNode("KaraBackdropBlur") else null
  private val tintPaint = Paint(Paint.ANTI_ALIAS_FLAG)
  private val borderPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE }
  private val bounds = RectF()
  private val viewLocation = IntArray(2)
  private val rootLocation = IntArray(2)
  private var recording = false
  private var recorded = false

  /** In px. The outline, and so the clip. */
  var cornerRadius: Float = 0f
    set(value) {
      field = value
      invalidateOutline()
      invalidate()
    }

  /** Over the blur. Its alpha is how much of the tint covers the backdrop. */
  var tint: Int = Color.TRANSPARENT
    set(value) {
      field = value
      invalidate()
    }

  /** Instead of the tint where there is no blur, so what sits on the glass stays readable. */
  var fallbackTint: Int = Color.TRANSPARENT
    set(value) {
      field = value
      invalidate()
    }

  var borderColor: Int = Color.TRANSPARENT
    set(value) {
      field = value
      invalidate()
    }

  /** In px. */
  var borderWidth: Float = 0f
    set(value) {
      field = value
      invalidate()
    }

  /** In px, the blur's radius. */
  var blurRadius: Float = 0f
    set(value) {
      field = value
      applyEffect()
    }

  /**
   * Applied to the backdrop after the blur; 1 leaves it as it is. iOS's materials lift the colour of what they blur —
   * a plain blur greys it into mud — so kara's materials ask for more than 1.
   */
  var saturation: Float = 1f
    set(value) {
      field = value
      applyEffect()
    }

  private val preDraw = ViewTreeObserver.OnPreDrawListener {
    recordBackdrop()
    true
  }

  init {
    setWillNotDraw(false)
    clipToOutline = true
    outlineProvider = object : ViewOutlineProvider() {
      override fun getOutline(view: View, outline: Outline) {
        outline.setRoundRect(0, 0, view.width, view.height, cornerRadius.coerceAtMost(minOf(view.width, view.height) / 2f))
      }
    }
  }

  override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) = Unit

  override fun onSizeChanged(width: Int, height: Int, oldWidth: Int, oldHeight: Int) {
    super.onSizeChanged(width, height, oldWidth, oldHeight)
    invalidateOutline()
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    if (backdrop != null) {
      viewTreeObserver.addOnPreDrawListener(preDraw)
    }
  }

  override fun onDetachedFromWindow() {
    viewTreeObserver.removeOnPreDrawListener(preDraw)
    backdrop?.discardDisplayList()
    recorded = false
    super.onDetachedFromWindow()
  }

  private fun applyEffect() {
    val node = backdrop ?: return
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
      return
    }
    val blur = if (blurRadius > 0f) RenderEffect.createBlurEffect(blurRadius, blurRadius, Shader.TileMode.CLAMP) else null
    val saturate = if (saturation != 1f) {
      RenderEffect.createColorFilterEffect(ColorMatrixColorFilter(ColorMatrix().apply { setSaturation(saturation) }))
    } else {
      null
    }
    // A chain applies its second effect first: blurred, then saturated.
    node.setRenderEffect(
      when {
        blur != null && saturate != null -> RenderEffect.createChainEffect(saturate, blur)
        else -> blur ?: saturate
      }
    )
  }

  /**
   * What lies behind this view, recorded at its place: walking from the window's root down to this view, each
   * ancestor's background and the children it draws before the branch this view is in. Nothing of this view's own
   * branch is drawn — its display list holds the backdrop, which would then contain itself — and nothing above it.
   */
  private fun recordBackdrop() {
    val node = backdrop ?: return
    if (recording || width == 0 || height == 0 || !isShown) {
      return
    }
    val chain = ArrayList<View>()
    var view: View = this
    while (true) {
      chain.add(view)
      view = view.parent as? View ?: break
    }
    chain.reverse()
    getLocationInWindow(viewLocation)
    chain[0].getLocationInWindow(rootLocation)
    node.setPosition(0, 0, width, height)
    val canvas = node.beginRecording(width, height)
    recording = true
    try {
      canvas.translate((rootLocation[0] - viewLocation[0]).toFloat(), (rootLocation[1] - viewLocation[1]).toFloat())
      for (index in 0 until chain.size - 1) {
        val ancestor = chain[index] as? ViewGroup ?: break
        val branch = chain[index + 1]
        ancestor.background?.draw(canvas)
        canvas.translate(-ancestor.scrollX.toFloat(), -ancestor.scrollY.toFloat())
        for (position in 0 until ancestor.childCount) {
          val child = ancestor.getChildAt(position)
          if (child === branch) {
            break
          }
          if (child.visibility == View.VISIBLE) {
            drawPlaced(canvas, child)
          }
        }
        canvas.translate(branch.left.toFloat(), branch.top.toFloat())
        canvas.concat(branch.matrix)
      }
    } finally {
      recording = false
      node.endRecording()
    }
    if (!recorded) {
      recorded = true
      applyEffect()
      invalidate()
    }
  }

  /** A view at its place in its parent — offset, translation, scale — as its parent would draw it. */
  private fun drawPlaced(canvas: Canvas, child: View) {
    val saved = canvas.save()
    canvas.translate(child.left.toFloat(), child.top.toFloat())
    canvas.concat(child.matrix)
    child.draw(canvas)
    canvas.restoreToCount(saved)
  }

  override fun draw(canvas: Canvas) {
    if (recording) {
      return
    }
    super.draw(canvas)
  }

  override fun onDraw(canvas: Canvas) {
    bounds.set(0f, 0f, width.toFloat(), height.toFloat())
    val node = backdrop
    val blurred = node != null && recorded && canvas.isHardwareAccelerated
    if (blurred) {
      canvas.drawRenderNode(node!!)
    }
    tintPaint.color = if (blurred) tint else fallbackTint
    if (Color.alpha(tintPaint.color) > 0) {
      canvas.drawRect(bounds, tintPaint)
    }
    if (borderWidth > 0f && Color.alpha(borderColor) > 0) {
      borderPaint.color = borderColor
      borderPaint.strokeWidth = borderWidth
      val inset = borderWidth / 2f
      val radius = (cornerRadius - inset).coerceAtLeast(0f).coerceAtMost(minOf(width, height) / 2f - inset)
      canvas.drawRoundRect(inset, inset, width - inset, height - inset, radius, radius, borderPaint)
    }
  }
}
