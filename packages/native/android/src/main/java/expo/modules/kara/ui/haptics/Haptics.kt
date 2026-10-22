package expo.modules.kara.ui.haptics

import android.annotation.SuppressLint
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.view.HapticFeedbackConstants
import androidx.annotation.ChecksSdkIntAtLeast
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.types.Enumerable

/**
 * The feedback kara plays, named for what happened rather than how it feels — the JS `Haptic` union, one value each.
 * Each maps to a chain of `HapticFeedbackConstants`, newest first: Android 14 added the constants that say what
 * happened (`TOGGLE_ON`, `SEGMENT_TICK`, `GESTURE_THRESHOLD_ACTIVATE`…), and an older OS gets the nearest feedback it
 * has. Every link is a system haptic, so the chain degrades to a plainer click, never to a vibrator buzz.
 */
enum class Haptic(val value: String) : Enumerable {
  SELECTION("selection"),
  TICK("tick"),
  SOFT("soft"),
  LIGHT("light"),
  MEDIUM("medium"),
  RIGID("rigid"),
  HEAVY("heavy"),
  SUCCESS("success"),
  WARNING("warning"),
  ERROR("error"),
  TOGGLE_ON("toggleOn"),
  TOGGLE_OFF("toggleOff"),
  LONG_PRESS("longPress"),
  DRAG_START("dragStart"),
  THRESHOLD_ACTIVATE("thresholdActivate"),
  THRESHOLD_DEACTIVATE("thresholdDeactivate"),
  KEY_PRESS("keyPress")
}

/** One link of a chain: a constant, and whether this OS has it. */
private class Feedback(val constant: Int, val isAvailable: Boolean = true)

@ChecksSdkIntAtLeast(parameter = 0)
private fun isAtLeast(api: Int): Boolean = Build.VERSION.SDK_INT >= api

private const val ANDROID_14 = Build.VERSION_CODES.UPSIDE_DOWN_CAKE
private const val ANDROID_11 = Build.VERSION_CODES.R
private const val ANDROID_8_1 = Build.VERSION_CODES.O_MR1

// The constants newer than the minimum SDK are only played behind `isAvailable`.
@get:SuppressLint("InlinedApi")
private val Haptic.chain: List<Feedback>
  get() = when (this) {
    Haptic.SELECTION -> listOf(
      Feedback(HapticFeedbackConstants.SEGMENT_TICK, isAtLeast(ANDROID_14)),
      Feedback(HapticFeedbackConstants.CLOCK_TICK)
    )
    Haptic.TICK -> listOf(
      Feedback(HapticFeedbackConstants.SEGMENT_FREQUENT_TICK, isAtLeast(ANDROID_14)),
      Feedback(HapticFeedbackConstants.TEXT_HANDLE_MOVE, isAtLeast(ANDROID_8_1)),
      Feedback(HapticFeedbackConstants.CLOCK_TICK)
    )
    Haptic.SOFT -> listOf(Feedback(HapticFeedbackConstants.CLOCK_TICK))
    Haptic.LIGHT -> listOf(Feedback(HapticFeedbackConstants.CONTEXT_CLICK))
    Haptic.MEDIUM -> listOf(Feedback(HapticFeedbackConstants.VIRTUAL_KEY))
    Haptic.RIGID -> listOf(Feedback(HapticFeedbackConstants.KEYBOARD_TAP))
    Haptic.HEAVY -> listOf(Feedback(HapticFeedbackConstants.LONG_PRESS))
    Haptic.SUCCESS -> listOf(
      Feedback(HapticFeedbackConstants.CONFIRM, isAtLeast(ANDROID_11)),
      Feedback(HapticFeedbackConstants.VIRTUAL_KEY)
    )
    // Android has no warning of its own; it is a rejection, like an error.
    Haptic.WARNING, Haptic.ERROR -> listOf(
      Feedback(HapticFeedbackConstants.REJECT, isAtLeast(ANDROID_11)),
      Feedback(HapticFeedbackConstants.LONG_PRESS)
    )
    Haptic.TOGGLE_ON -> listOf(
      Feedback(HapticFeedbackConstants.TOGGLE_ON, isAtLeast(ANDROID_14)),
      Feedback(HapticFeedbackConstants.CONTEXT_CLICK)
    )
    Haptic.TOGGLE_OFF -> listOf(
      Feedback(HapticFeedbackConstants.TOGGLE_OFF, isAtLeast(ANDROID_14)),
      Feedback(HapticFeedbackConstants.CLOCK_TICK)
    )
    Haptic.LONG_PRESS -> listOf(Feedback(HapticFeedbackConstants.LONG_PRESS))
    Haptic.DRAG_START -> listOf(
      Feedback(HapticFeedbackConstants.DRAG_START, isAtLeast(ANDROID_14)),
      Feedback(HapticFeedbackConstants.LONG_PRESS)
    )
    Haptic.THRESHOLD_ACTIVATE -> listOf(
      Feedback(HapticFeedbackConstants.GESTURE_THRESHOLD_ACTIVATE, isAtLeast(ANDROID_14)),
      Feedback(HapticFeedbackConstants.CONTEXT_CLICK)
    )
    Haptic.THRESHOLD_DEACTIVATE -> listOf(
      Feedback(HapticFeedbackConstants.GESTURE_THRESHOLD_DEACTIVATE, isAtLeast(ANDROID_14)),
      Feedback(HapticFeedbackConstants.CLOCK_TICK)
    )
    Haptic.KEY_PRESS -> listOf(Feedback(HapticFeedbackConstants.KEYBOARD_TAP))
  }

/**
 * Plays `Haptic`s as the system's own haptic feedback — `View.performHapticFeedback` on the current activity's
 * window — and never through `Vibrator`. That keeps them tuned per device (Android 13+ plays each constant as the
 * effect the manufacturer designed for it), quiet when the user switched touch feedback off, on a phone without a
 * vibrator, or with the app in the background.
 *
 * What it guards against:
 * - Called from the JS thread: it hops to the main thread, where views live.
 * - No activity, one finishing, or a window not created or attached yet (start-up, a configuration change): nothing
 *   plays — `peekDecorView` never creates a decor view as `decorView` would, and a late post never plays out of turn.
 * - A constant the OS or the device does not implement: `performHapticFeedback` answers `false` and the next link of
 *   the chain plays instead, so an OEM build missing `TOGGLE_ON` still clicks.
 * - The decor view's own `isHapticFeedbackEnabled`: ignored (`FLAG_IGNORE_VIEW_SETTING`), so a library that switched
 *   it off for its own reasons cannot silence the app. The user's global setting is always respected.
 */
internal object Haptics {
  private val main = Handler(Looper.getMainLooper())

  fun play(appContext: AppContext, haptic: Haptic) {
    main.post {
      val activity = appContext.currentActivity?.takeUnless { it.isFinishing || it.isDestroyed } ?: return@post
      val view = activity.window?.peekDecorView()?.takeIf { it.isAttachedToWindow } ?: return@post

      haptic.chain.firstOrNull { feedback ->
        feedback.isAvailable &&
          view.performHapticFeedback(feedback.constant, HapticFeedbackConstants.FLAG_IGNORE_VIEW_SETTING)
      }
    }
  }
}
