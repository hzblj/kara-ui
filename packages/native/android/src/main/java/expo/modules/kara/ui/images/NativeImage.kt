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

  class Vector(private val svg: SVG) : NativeImage {
    override val width = svg.documentViewBox?.width() ?: svg.documentWidth
    override val height = svg.documentViewBox?.height() ?: svg.documentHeight

    init {
      if (svg.documentViewBox == null && width > 0f && height > 0f) {
        svg.setDocumentViewBox(0f, 0f, width, height)
      }
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
