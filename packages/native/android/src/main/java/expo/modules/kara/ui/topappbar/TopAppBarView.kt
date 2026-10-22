@file:OptIn(ExperimentalMaterial3Api::class)

package expo.modules.kara.ui.topappbar

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.sp
import expo.modules.kara.ui.icon.resourceId
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.types.Enumerable
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ComposableScope
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.ExpoComposeView
import expo.modules.ui.applyTestTag
import expo.modules.ui.composeOrNull
import expo.modules.ui.resolveFontFamily
import java.io.Serializable
import androidx.compose.ui.graphics.Color as ComposeColor

enum class TopAppBarItemType(val value: String) : Enumerable {
  BACK("back"),
  CLOSE("close"),
  ICON("icon")
}

/** One bar item as JS sends it. Its press comes back as `onItemPress` with its placement and index. */
class TopAppBarItemRecord(
  @Field val type: TopAppBarItemType = TopAppBarItemType.ICON,
  @Field val iconName: String? = null,
  @Field val label: String = "",
  @Field val testID: String? = null
) : Record, Serializable

open class TopAppBarItemPressEvent(
  @Field open val placement: String = "trailing",
  @Field open val index: Int = 0
) : Record, Serializable

data class TopAppBarProps(
  val title: MutableState<String?> = mutableStateOf(null),
  val titleAlignment: MutableState<String> = mutableStateOf("center"),
  val titleVisible: MutableState<Boolean> = mutableStateOf(true),
  val leadingItems: MutableState<List<TopAppBarItemRecord>> = mutableStateOf(emptyList()),
  val trailingItems: MutableState<List<TopAppBarItemRecord>> = mutableStateOf(emptyList()),
  val itemColor: MutableState<Color?> = mutableStateOf(null),
  val titleColor: MutableState<Color?> = mutableStateOf(null),
  val fontFamily: MutableState<String?> = mutableStateOf(null),
  val fontSize: MutableState<Float?> = mutableStateOf(null)
) : ComposeProps

/**
 * Material's top app bar on a transparent container, for a header that is not a navigation screen's — a sheet's, above
 * all. Leading items go into the `navigationIcon` slot and trailing ones into `actions`, in the order given, so a close
 * item can sit on either side. `back` and `close` are kara's own Material Symbols glyphs, `icon` is one of the app's
 * drawables. Material has no grouped capsules, so iOS's `separated` has no counterpart here.
 */
@SuppressLint("ViewConstructor")
class TopAppBarView(context: Context, appContext: AppContext) :
  ExpoComposeView<TopAppBarProps>(context, appContext) {

  override val props = TopAppBarProps()
  internal val onItemPress by EventDispatcher<TopAppBarItemPressEvent>()

  @Composable
  override fun ComposableScope.Content() {
    val title by props.title
    val titleAlignment by props.titleAlignment
    val titleVisible by props.titleVisible
    val leadingItems by props.leadingItems
    val trailingItems by props.trailingItems
    val itemColor by props.itemColor
    val titleColor by props.titleColor
    val fontFamilyName by props.fontFamily
    val fontSize by props.fontSize

    val titleStyle = remember(fontFamilyName, fontSize) {
      TextStyle(
        fontFamily = resolveFontFamily(fontFamilyName, context),
        fontSize = fontSize?.sp ?: TextUnit.Unspecified,
        fontWeight = FontWeight.SemiBold
      )
    }
    val colors = TopAppBarDefaults.topAppBarColors(
      containerColor = ComposeColor.Transparent,
      scrolledContainerColor = ComposeColor.Transparent,
      navigationIconContentColor = itemColor.composeOrNull ?: ComposeColor.Unspecified,
      titleContentColor = titleColor.composeOrNull ?: ComposeColor.Unspecified,
      actionIconContentColor = itemColor.composeOrNull ?: ComposeColor.Unspecified
    )

    val titleContent: @Composable () -> Unit = {
      AnimatedVisibility(visible = titleVisible, enter = fadeIn(), exit = fadeOut()) {
        Text(title.orEmpty(), style = titleStyle, maxLines = 1, overflow = TextOverflow.Ellipsis)
      }
    }
    val navigationIcon: @Composable () -> Unit = {
      Row {
        BarItems(leadingItems, "leading")
      }
    }
    val actions: @Composable RowScope.() -> Unit = {
      BarItems(trailingItems, "trailing")
    }

    if (titleAlignment == "leading") {
      TopAppBar(
        title = titleContent,
        modifier = Modifier.fillMaxWidth(),
        navigationIcon = navigationIcon,
        actions = actions,
        windowInsets = NoInsets,
        colors = colors
      )
    } else {
      CenterAlignedTopAppBar(
        title = titleContent,
        modifier = Modifier.fillMaxWidth(),
        navigationIcon = navigationIcon,
        actions = actions,
        windowInsets = NoInsets,
        colors = colors
      )
    }
  }

  @Composable
  private fun BarItems(items: List<TopAppBarItemRecord>, placement: String) {
    items.forEachIndexed { index, item ->
      IconButton(
        onClick = { onItemPress(TopAppBarItemPressEvent(placement, index)) },
        modifier = Modifier.applyTestTag(item.testID)
      ) {
        val name = when (item.type) {
          TopAppBarItemType.BACK -> "kara_glyph_back"
          TopAppBarItemType.CLOSE -> "kara_glyph_close"
          TopAppBarItemType.ICON -> item.iconName
        }
        DrawableIcon(name, item.label)
      }
    }
  }
}

private val NoInsets = WindowInsets(0, 0, 0, 0)

@Composable
private fun DrawableIcon(name: String?, contentDescription: String) {
  val context = LocalContext.current
  val id = remember(name) { resourceId(context, name) }

  if (id == 0) {
    return
  }

  Icon(painter = painterResource(id), contentDescription = contentDescription)
}
