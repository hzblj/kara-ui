package expo.modules.kara.ui.images

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.util.Base64
import android.util.LruCache
import androidx.core.content.ContextCompat
import androidx.core.graphics.drawable.toBitmap
import com.caverock.androidsvg.SVG
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

internal object NativeImageLoader {
  private const val CACHE_SIZE = 64
  private const val TIMEOUT_MS = 15_000

  private val sources = LruCache<String, NativeImage>(CACHE_SIZE)
  private val renders = LruCache<String, Bitmap>(CACHE_SIZE)

  suspend fun loadBitmap(context: Context, source: String, heightPx: Int): Bitmap? {
    val key = "$heightPx|$source"
    renders.get(key)?.let { return it }

    val image = load(context, source) ?: return null
    val bitmap = withContext(Dispatchers.Default) { image.render(heightPx) } ?: return null
    renders.put(key, bitmap)
    return bitmap
  }

  private suspend fun load(context: Context, source: String): NativeImage? {
    sources.get(source)?.let { return it }

    val image = withContext(Dispatchers.IO) { runCatching { resolve(context.applicationContext, source) }.getOrNull() }
    image?.let { sources.put(source, it) }
    return image
  }

  private fun resolve(context: Context, source: String): NativeImage? {
    val uri = Uri.parse(source)

    return when (uri.scheme?.lowercase()) {
      "http", "https" -> fetch(source)
      "file" -> uri.path?.let { decode(File(it).readBytes(), source, null) }
      "data" -> decodeDataUri(source)
      "content", "android.resource" ->
        context.contentResolver.openInputStream(uri)?.use { decode(it.readBytes(), source, context.contentResolver.getType(uri)) }
      "asset" -> context.assets.open(source.removePrefix("asset:/").trimStart('/')).use { decode(it.readBytes(), source, null) }
      else -> loadResource(context, source)
    }
  }

  private fun fetch(source: String): NativeImage? {
    val connection = URL(source).openConnection() as HttpURLConnection

    return try {
      connection.connectTimeout = TIMEOUT_MS
      connection.readTimeout = TIMEOUT_MS
      connection.useCaches = true

      if (connection.responseCode !in 200..299) {
        return null
      }

      val bytes = connection.inputStream.use { it.readBytes() }
      decode(bytes, source, connection.contentType)
    } finally {
      connection.disconnect()
    }
  }

  private fun loadResource(context: Context, name: String): NativeImage? {
    val resources = context.resources
    val raw = resources.getIdentifier(name, "raw", context.packageName)

    if (raw != 0) {
      return resources.openRawResource(raw).use { decode(it.readBytes(), name, null) }
    }

    val drawable = resources.getIdentifier(name, "drawable", context.packageName)

    if (drawable == 0) {
      return null
    }

    return ContextCompat.getDrawable(context, drawable)?.toBitmap()?.let { NativeImage.Raster(it) }
  }

  private fun decodeDataUri(source: String): NativeImage? {
    val comma = source.indexOf(',')

    if (comma < 0) {
      return null
    }

    val header = source.substring(5, comma).lowercase()
    val payload = source.substring(comma + 1)
    val bytes = if (header.endsWith(";base64")) {
      Base64.decode(payload, Base64.DEFAULT)
    } else {
      Uri.decode(payload).toByteArray()
    }

    return decode(bytes, null, header.substringBefore(';'))
  }

  private fun decode(bytes: ByteArray, path: String?, mimeType: String?): NativeImage? {
    if (isSvg(bytes, path, mimeType)) {
      return runCatching { SVG.getFromInputStream(bytes.inputStream()) }.getOrNull()?.let { NativeImage.Vector(it) }
    }

    return BitmapFactory.decodeByteArray(bytes, 0, bytes.size)?.let { NativeImage.Raster(it) }
  }

  private fun isSvg(bytes: ByteArray, path: String?, mimeType: String?): Boolean {
    if (mimeType?.lowercase()?.startsWith("image/svg+xml") == true) {
      return true
    }

    if (path?.substringBefore('?')?.lowercase()?.endsWith(".svg") == true) {
      return true
    }

    return String(bytes, 0, minOf(bytes.size, 512)).lowercase().contains("<svg")
  }
}
