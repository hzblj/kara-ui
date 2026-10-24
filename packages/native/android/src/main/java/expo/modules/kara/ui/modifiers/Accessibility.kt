package expo.modules.kara.ui.modifiers

import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.SemanticsPropertyReceiver
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.onClick
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.records.recordFromMap
import expo.modules.ui.ModifierRegistry

private const val ACCESSIBILITY_MODIFIER = "karaAccessibility"

data class AccessibilityParams(
  @Field val hidden: Boolean = false,
  @Field val hint: String? = null,
  @Field val label: String? = null,
  @Field val merge: Boolean = false,
  @Field val role: String? = null,
  @Field val value: String? = null
) : Record

/**
 * What TalkBack is told about a composable, the Compose side of kara's accessibility props (`@expo/ui`'s `semantics`
 * carries only a content description).
 *
 * A pressable role (`button`, `link`) and `merge` read the composable and its children as one element. A label on such
 * an element replaces what the children would say, as VoiceOver's does, so the children's semantics are cleared rather
 * than appended to. The hint becomes the click action's label ("Double tap to …"); `SemanticsConfiguration` merges an
 * action's label and its handler separately, so it never takes the click away from the `clickable` beside it.
 */
internal fun registerAccessibilityModifier() {
  ModifierRegistry.register(ACCESSIBILITY_MODIFIER) { map, _, _, _ ->
    val params = recordFromMap<AccessibilityParams>(map)

    if (params.hidden) {
      return@register Modifier.clearAndSetSemantics {}
    }

    val pressable = params.role == "button" || params.role == "link"
    val merge = params.merge || pressable
    val properties: SemanticsPropertyReceiver.() -> Unit = {
      params.label?.let { contentDescription = it }
      params.value?.let { stateDescription = it }

      when (params.role) {
        "button" -> role = Role.Button
        "header" -> heading()
        "image" -> role = Role.Image
      }

      if (pressable) {
        params.hint?.let { onClick(label = it, action = null) }
      }
    }

    if (merge && params.label != null) {
      Modifier.clearAndSetSemantics(properties)
    } else {
      Modifier.semantics(mergeDescendants = merge, properties = properties)
    }
  }
}
