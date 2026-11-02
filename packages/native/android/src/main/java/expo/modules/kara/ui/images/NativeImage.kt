package expo.modules.kara.ui.images

import android.graphics.Bitmap
import android.graphics.Canvas
import com.caverock.androidsvg.RenderOptions
import com.caverock.androidsvg.SVG

internal sealed interface NativeImage {
  val width: Float
  val height: Float

  fun render(heightPx: Int): Bitmap?

  data class Raster(val bitmap: Bitmap) : NativeImage {
    override val width get() = bitmap.width.toFloat()
    override val height get() = bitmap.height.toFloat()

    override fun render(heightPx: Int): Bitmap? {
      val widthPx = scaledWidth(heightPx) ?: return null
      return Bitmap.createScaledBitmap(bitmap, widthPx, heightPx, true)
    }
  }

  /**
   * An SVG scaled to the height it is drawn at. androidsvg draws a document that has its own `width`/`height` at that
   * size in the corner of any viewport, so both are set to 100%: with them a logo came out a third of its height.
   */
  class Vector(private val svg: SVG) : NativeImage {
    override val width = svg.documentViewBox?.width() ?: svg.documentWidth
    override val height = svg.documentViewBox?.height() ?: svg.documentHeight

    init {
      if (svg.documentViewBox == null && width > 0f && height > 0f) {
        svg.setDocumentViewBox(0f, 0f, width, height)
      }
      svg.setDocumentWidth("100%")
      svg.setDocumentHeight("100%")
    }

    override fun render(heightPx: Int): Bitmap? {
      val widthPx = scaledWidth(heightPx) ?: return null
      val bitmap = Bitmap.createBitmap(widthPx, heightPx, Bitmap.Config.ARGB_8888)
      val options = RenderOptions.create().viewPort(0f, 0f, widthPx.toFloat(), heightPx.toFloat())
      svg.renderToCanvas(Canvas(bitmap), options)
      return bitmap
    }
  }
}

private fun NativeImage.scaledWidth(heightPx: Int): Int? {
  if (width <= 0f || height <= 0f || heightPx <= 0) {
    return null
  }

  return (width * heightPx / height).toInt().coerceAtLeast(1)
}
