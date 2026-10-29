@file:OptIn(ExperimentalMaterial3Api::class)

package expo.modules.kara.ui.searchfield

import expo.modules.kotlin.sharedobjects.SharedObject
import com.hzblj.expowaveform.WaveformStyle
import com.hzblj.expowaveform.LiveWaveformGrowIn
import com.hzblj.expowaveform.LiveWaveformView
import androidx.compose.ui.viewinterop.AndroidView
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.graphics.isSpecified
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.foundation.layout.size
import androidx.compose.animation.togetherWith
import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.expandHorizontally
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.animation.shrinkHorizontally
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.InputTransformation
import androidx.compose.foundation.text.input.TextFieldBuffer
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.foundation.text.input.clearText
import androidx.compose.foundation.text.input.setTextAndPlaceCursorAtEnd
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.SearchBarDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.ripple
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import expo.modules.kara.ui.icon.resourceId
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ComposableScope
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.ExpoComposeView
import expo.modules.ui.applyTestTag
import expo.modules.ui.composeOrNull
import expo.modules.ui.resolveFontFamily
import java.io.Serializable
import kotlinx.coroutines.flow.drop
import androidx.compose.ui.graphics.Color as ComposeColor

data class SearchFieldProps(
  val placeholder: MutableState<String?> = mutableStateOf(null),
  val cancelLabel: MutableState<String?> = mutableStateOf(null),
  val clearLabel: MutableState<String?> = mutableStateOf(null),
  val searchIconName: MutableState<String?> = mutableStateOf(null),
  val clearIconName: MutableState<String?> = mutableStateOf(null),
  val fieldTestID: MutableState<String?> = mutableStateOf(null),
  val containerColor: MutableState<Color?> = mutableStateOf(null),
  val textColor: MutableState<Color?> = mutableStateOf(null),
  val placeholderColor: MutableState<Color?> = mutableStateOf(null),
  val iconColor: MutableState<Color?> = mutableStateOf(null),
  val fontFamily: MutableState<String?> = mutableStateOf(null),
  val fontSize: MutableState<Float?> = mutableStateOf(null),
  val letterSpacing: MutableState<Float?> = mutableStateOf(null),
  val title: MutableState<String?> = mutableStateOf(null),
  val titleColor: MutableState<Color?> = mutableStateOf(null),
  val titleFontFamily: MutableState<String?> = mutableStateOf(null),
  val titleFontSize: MutableState<Float?> = mutableStateOf(null),
  val titleLetterSpacing: MutableState<Float?> = mutableStateOf(null),
  val toolbarHeight: MutableState<Float?> = mutableStateOf(null),
  val voiceEnabled: MutableState<Boolean> = mutableStateOf(false),
  val voiceListening: MutableState<Boolean> = mutableStateOf(false),
  val microphoneIconName: MutableState<String?> = mutableStateOf(null),
  val stopIconName: MutableState<String?> = mutableStateOf(null),
  val microphoneLabel: MutableState<String?> = mutableStateOf(null),
  val stopLabel: MutableState<String?> = mutableStateOf(null),
  val voiceMeter: MutableState<SharedObject?> = mutableStateOf(null),
  val voiceSizes: MutableState<SearchVoiceSizes?> = mutableStateOf(null)
) : ComposeProps

/** `SearchVoiceSizes` in `src/search-voice.ts`, in dp: each size left out keeps Material's own. */
data class SearchVoiceSizes(
  @Field val clearIconSize: Float? = null,
  @Field val microphoneIconSize: Float? = null,
  @Field val stopButtonSize: Float? = null,
  @Field val waveform: SearchVoiceWaveformSizes? = null
) : Record

data class SearchVoiceWaveformSizes(
  @Field val width: Float? = null,
  @Field val height: Float? = null,
  @Field val barWidth: Float? = null,
  @Field val barGap: Float? = null,
  @Field val barRadius: Float? = null,
  @Field val minBarHeight: Float? = null
) : Record

open class SearchFieldTextEvent(
  @Field open val text: String = ""
) : Record, Serializable

open class SearchFieldFocusChangeEvent(
  @Field open val isFocused: Boolean = false
) : Record, Serializable

open class SearchFieldVoiceEvent(
  @Field open val action: String = ""
) : Record, Serializable

/**
 * Material 3's search `InputField` with autocorrect off. A tap on the idle field ripples over the pill and focuses it;
 * while it is focused or holds text, a `TextButton` expands next to it that clears and blurs it. The search and clear
 * icons are drawables by name (kara's `kara_glyph_*` unless the app passes its own).
 *
 * With `voiceEnabled` the trailing slot holds a microphone while the field is empty and the clear button in its place
 * once it holds text; while `voiceListening`, a live waveform of `voiceMeter` (expo-waveform's `LiveWaveformView`, which
 * follows the transcription natively) and a tonal stop button. Nothing here records: `onVoiceAction` reports `start`
 * and `stop`. The overlay that focuses an idle field stops short of the microphone.
 *
 * With `title` it is a whole search header: a `toolbarHeight` spacer and a large title above the field collapse while
 * the field is active, so the field slides up to the top. React Native content is not composed in: a nested host took
 * the focus from the field, and a React Native view under a collapsed slot still caught touches at its old place.
 *
 * `clearQuery`, `setQuery`, `focusField` and `blurField` are view functions; they reject once the view is detached.
 */
@SuppressLint("ViewConstructor")
class SearchFieldView(context: Context, appContext: AppContext) :
  ExpoComposeView<SearchFieldProps>(context, appContext) {

  override val props = SearchFieldProps()
  internal val onQueryChange by EventDispatcher<SearchFieldTextEvent>()
  internal val onSearchFocusChange by EventDispatcher<SearchFieldFocusChangeEvent>()
  internal val onSearchSubmit by EventDispatcher<SearchFieldTextEvent>()
  internal val onVoiceAction by EventDispatcher<SearchFieldVoiceEvent>()

  private val textFieldState = TextFieldState()
  private val focusRequester = FocusRequester()
  private val blurRequests = mutableIntStateOf(0)

  fun clearQuery() {
    textFieldState.clearText()
  }

  fun setQuery(text: String) {
    textFieldState.setTextAndPlaceCursorAtEnd(text)
  }

  fun focusField() {
    runCatching { focusRequester.requestFocus() }
  }

  fun blurField() {
    blurRequests.intValue += 1
  }

  @Composable
  override fun ComposableScope.Content() {
    val placeholder by props.placeholder
    val cancelLabel by props.cancelLabel
    val clearLabel by props.clearLabel
    val searchIconName by props.searchIconName
    val clearIconName by props.clearIconName
    val fieldTestID by props.fieldTestID
    val containerColor by props.containerColor
    val textColor by props.textColor
    val placeholderColor by props.placeholderColor
    val iconColor by props.iconColor
    val fontFamilyName by props.fontFamily
    val fontSize by props.fontSize
    val letterSpacing by props.letterSpacing
    val title by props.title
    val titleColor by props.titleColor
    val titleFontFamilyName by props.titleFontFamily
    val titleFontSize by props.titleFontSize
    val titleLetterSpacing by props.titleLetterSpacing
    val toolbarHeight by props.toolbarHeight
    val voiceEnabled by props.voiceEnabled
    val voiceListening by props.voiceListening
    val microphoneIconName by props.microphoneIconName
    val stopIconName by props.stopIconName
    val microphoneLabel by props.microphoneLabel
    val stopLabel by props.stopLabel
    val voiceMeter by props.voiceMeter
    val voiceSizes by props.voiceSizes
    val blurRequest by blurRequests

    val focusManager = LocalFocusManager.current
    val keyboardController = LocalSoftwareKeyboardController.current
    var isFocused by remember { mutableStateOf(false) }
    val hasText by remember { derivedStateOf { textFieldState.text.isNotEmpty() } }
    val isActive = isFocused || hasText
    val shape = SearchBarDefaults.inputFieldShape

    val textStyle = remember(fontFamilyName, fontSize, letterSpacing) {
      TextStyle(
        fontFamily = resolveFontFamily(fontFamilyName, context),
        fontSize = fontSize?.sp ?: TextUnit.Unspecified,
        letterSpacing = letterSpacing?.sp ?: TextUnit.Unspecified
      )
    }
    val container = containerColor.composeOrNull ?: ComposeColor.Unspecified
    val text = textColor.composeOrNull ?: ComposeColor.Unspecified
    val hint = placeholderColor.composeOrNull ?: ComposeColor.Unspecified
    val icon = iconColor.composeOrNull ?: ComposeColor.Unspecified
    val colors = SearchBarDefaults.inputFieldColors(
      focusedTextColor = text,
      unfocusedTextColor = text,
      cursorColor = text,
      focusedLeadingIconColor = icon,
      unfocusedLeadingIconColor = icon,
      focusedTrailingIconColor = icon,
      unfocusedTrailingIconColor = icon,
      focusedPlaceholderColor = hint,
      unfocusedPlaceholderColor = hint,
      focusedContainerColor = container,
      unfocusedContainerColor = container
    )

    LaunchedEffect(Unit) {
      snapshotFlow { textFieldState.text.toString() }
        .drop(1)
        .collect { onQueryChange(SearchFieldTextEvent(it)) }
    }

    LaunchedEffect(blurRequest) {
      if (blurRequest > 0) {
        focusManager.clearFocus()
      }
    }

    val cancel = {
      textFieldState.clearText()
      focusManager.clearFocus()
    }

    val searchRow: @Composable (Modifier) -> Unit = { rowModifier ->
      Row(rowModifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
        Box(Modifier.weight(1f)) {
          SearchBarDefaults.InputField(
            state = textFieldState,
            onSearch = {
              keyboardController?.hide()
              onSearchSubmit(SearchFieldTextEvent(it))
            },
            expanded = isActive,
            onExpandedChange = {},
            modifier = Modifier
              .fillMaxWidth()
              .focusRequester(focusRequester)
              .onFocusChanged { state ->
                if (state.isFocused != isFocused) {
                  isFocused = state.isFocused
                  onSearchFocusChange(SearchFieldFocusChangeEvent(state.isFocused))
                }
              }
              .applyTestTag(fieldTestID),
            textStyle = textStyle,
            placeholder = {
              placeholder?.let { Text(it, style = textStyle, maxLines = 1) }
            },
            leadingIcon = {
              DrawableIcon(searchIconName, null)
            },
            trailingIcon = {
              Row(verticalAlignment = Alignment.CenterVertically) {
                if (voiceEnabled && voiceListening) {
                  VoiceMeter(voiceMeter, icon, voiceSizes?.waveform)
                  FilledTonalIconButton(
                    onClick = { onVoiceAction(SearchFieldVoiceEvent("stop")) },
                    modifier = voiceSizes?.stopButtonSize?.let { Modifier.size(it.dp) } ?: Modifier
                  ) {
                    DrawableIcon(stopIconName, stopLabel)
                  }
                } else if (voiceEnabled) {
                  AnimatedContent(
                    targetState = hasText,
                    transitionSpec = {
                      (fadeIn() + scaleIn(initialScale = ICON_SCALE)) togetherWith
                        (fadeOut() + scaleOut(targetScale = ICON_SCALE))
                    },
                    label = "voiceOrClear"
                  ) { showsClear ->
                    if (showsClear) {
                      IconButton(onClick = { textFieldState.clearText() }) {
                        DrawableIcon(clearIconName, clearLabel, voiceSizes?.clearIconSize)
                      }
                    } else {
                      IconButton(onClick = {
                        focusRequester.requestFocus()
                        onVoiceAction(SearchFieldVoiceEvent("start"))
                      }) {
                        DrawableIcon(microphoneIconName, microphoneLabel, voiceSizes?.microphoneIconSize)
                      }
                    }
                  }
                } else {
                  ClearButton(isVisible = hasText, iconName = clearIconName, label = clearLabel) {
                    textFieldState.clearText()
                  }
                }
              }
            },
            inputTransformation = SearchKeyboard,
            shape = shape,
            colors = colors
          )

          if (!isActive) {
            Box(
              Modifier
                .matchParentSize()
                .padding(end = if (voiceEnabled) VoiceButtonWidth else 0.dp)
                .clip(shape)
                .clickable(interactionSource = remember { MutableInteractionSource() }, indication = ripple()) {
                  focusRequester.requestFocus()
                  keyboardController?.show()
                }
            )
          }
        }

        AnimatedVisibility(
          visible = isActive,
          enter = expandHorizontally(HeaderSizeSpec, expandFrom = Alignment.Start) + fadeIn(HeaderFadeInSpec),
          exit = shrinkHorizontally(HeaderSizeSpec, shrinkTowards = Alignment.Start) + fadeOut(HeaderFadeOutSpec)
        ) {
          TextButton(onClick = cancel) {
            Text(cancelLabel.orEmpty(), style = textStyle, color = text, maxLines = 1)
          }
        }
      }
    }

    val headerTitle = title

    if (headerTitle == null) {
      searchRow(Modifier)
      return
    }

    val titleStyle = remember(titleFontFamilyName, titleFontSize, titleLetterSpacing) {
      TextStyle(
        fontFamily = resolveFontFamily(titleFontFamilyName, context),
        fontSize = titleFontSize?.sp ?: TextUnit.Unspecified,
        letterSpacing = titleLetterSpacing?.sp ?: TextUnit.Unspecified
      )
    }

    Column(Modifier.fillMaxWidth()) {
      CollapsibleSection(isVisible = !isActive) {
        Column(Modifier.fillMaxWidth()) {
          Spacer(Modifier.height(toolbarHeight?.dp ?: 0.dp))
          Text(
            headerTitle,
            style = titleStyle,
            color = titleColor.composeOrNull ?: text,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.padding(horizontal = HeaderInset, vertical = TitleVerticalInset)
          )
        }
      }
      searchRow(
        Modifier.padding(
          start = HeaderInset,
          end = CancelEndInset,
          top = FieldVerticalInset,
          bottom = FieldVerticalInset
        )
      )
    }
  }
}

@Composable
private fun CollapsibleSection(isVisible: Boolean, content: @Composable () -> Unit) {
  AnimatedVisibility(
    visible = isVisible,
    enter = expandVertically(HeaderSizeSpec, expandFrom = Alignment.Top) + fadeIn(HeaderFadeInSpec),
    exit = shrinkVertically(HeaderSizeSpec, shrinkTowards = Alignment.Top) + fadeOut(HeaderFadeOutSpec)
  ) {
    content()
  }
}

@Composable
private fun VoiceMeter(meter: SharedObject?, color: ComposeColor, sizes: SearchVoiceWaveformSizes?) {
  val tint = if (color.isSpecified) color else LocalContentColor.current
  AndroidView(
    factory = { context -> LiveWaveformView(context).apply { growIn = LiveWaveformGrowIn() } },
    update = { view ->
      val density = view.resources.displayMetrics.density
      view.style = WaveformStyle(
        barWidth = (sizes?.barWidth ?: VOICE_METER_BAR) * density,
        barGap = (sizes?.barGap ?: VOICE_METER_BAR) * density,
        barRadius = sizes?.barRadius?.let { it * density },
        minBarHeight = (sizes?.minBarHeight ?: VOICE_METER_BAR) * density
      )
      view.meter = meter
      view.color = tint.toArgb()
    },
    modifier = Modifier.size(
      width = sizes?.width?.dp ?: VoiceMeterWidth,
      height = sizes?.height?.dp ?: VoiceMeterHeight
    )
  )
}

@Composable
private fun ClearButton(isVisible: Boolean, iconName: String?, label: String?, onClick: () -> Unit) {
  AnimatedVisibility(
    visible = isVisible,
    enter = fadeIn() + scaleIn(initialScale = ICON_SCALE),
    exit = fadeOut() + scaleOut(targetScale = ICON_SCALE)
  ) {
    IconButton(onClick = onClick) {
      DrawableIcon(iconName, label)
    }
  }
}

@Composable
private fun DrawableIcon(name: String?, contentDescription: String?, size: Float? = null) {
  val context = LocalContext.current
  val id = remember(name) { resourceId(context, name) }

  if (id == 0) {
    return
  }

  Icon(
    painter = painterResource(id),
    contentDescription = contentDescription,
    modifier = size?.let { Modifier.size(it.dp) } ?: Modifier
  )
}

private object SearchKeyboard : InputTransformation {
  override val keyboardOptions = KeyboardOptions(
    capitalization = KeyboardCapitalization.None,
    autoCorrectEnabled = false,
    imeAction = ImeAction.Search
  )

  override fun TextFieldBuffer.transformInput() = Unit
}

private const val ICON_SCALE = 0.6f
private val VoiceButtonWidth = 48.dp
private val VoiceMeterWidth = 64.dp
private val VoiceMeterHeight = 20.dp
private const val VOICE_METER_BAR = 2f

private val HeaderEasing = CubicBezierEasing(0.2f, 0f, 0f, 1f)
private val HeaderSizeSpec = tween<IntSize>(durationMillis = 350, easing = HeaderEasing)
private val HeaderFadeInSpec = tween<Float>(durationMillis = 250, delayMillis = 100, easing = HeaderEasing)
private val HeaderFadeOutSpec = tween<Float>(durationMillis = 150, easing = HeaderEasing)
private val HeaderInset = 16.dp
private val CancelEndInset = 8.dp
private val TitleVerticalInset = 8.dp
private val FieldVerticalInset = 8.dp
