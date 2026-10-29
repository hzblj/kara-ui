import ExpoModulesCore
import ExpoUI
import SwiftUI

/**
 * An icon's effect, as `@hzblj/expo-native-icons` flattens `NativeIconEffect`: the type and whichever of its options
 * apply. The same record its `NativeIconView` takes, so `Icon` and `RnIcon` play one effect the same way.
 */
internal struct SymbolEffectRecord: Record, Equatable {
  @Field var type: String = ""
  @Field var direction: String?
  @Field var scope: String?
  @Field var angle: Double?
  @Field var fill: String?
  @Field var reversing: Bool?
  @Field var inactiveLayers: String?
  @Field var style: String?
  @Field var speed: Double?
  @Field var repeatCount: Int?
  @Field var repeatContinuous: Bool?
  @Field var repeatDelay: Double?

  static func == (lhs: Self, rhs: Self) -> Bool {
    lhs.type == rhs.type && lhs.direction == rhs.direction && lhs.scope == rhs.scope && lhs.angle == rhs.angle
      && lhs.fill == rhs.fill && lhs.reversing == rhs.reversing && lhs.inactiveLayers == rhs.inactiveLayers
      && lhs.style == rhs.style && lhs.speed == rhs.speed && lhs.repeatCount == rhs.repeatCount
      && lhs.repeatContinuous == rhs.repeatContinuous && lhs.repeatDelay == rhs.repeatDelay
  }

  var isState: Bool {
    type == "scale" || type == "appear" || type == "disappear"
  }
}

/**
 * Everything SF Symbols does with an app icon's custom symbol in a host: the rendering mode and its colours, iOS 26's
 * gradient, the replace transition when `transitionValue` (the symbol and its variable value) changes, and an effect
 * played once per change of `effectTrigger` or running while `effectActive`. The SwiftUI half of what
 * `@hzblj/expo-native-icons`' `NativeIconView` does in UIKit, so `Icon` and `RnIcon` agree.
 *
 * Registered as `symbolStyle` in `ModifierRegistration`, applied to `@expo/ui`'s `Image(assetName:)`.
 */
internal struct SymbolStyleModifier: ViewModifier, Record {
  @Field var renderingMode: String?
  @Field var color: Color?
  @Field var secondaryColor: Color?
  @Field var tertiaryColor: Color?
  @Field var gradient: Bool = false
  @Field var transition: String?
  @Field var transitionValue: String?
  @Field var effect: SymbolEffectRecord?
  @Field var effectTrigger: String?
  @Field var effectActive: Bool = true

  func body(content: Content) -> some View {
    content
      .modifier(SymbolColors(
        renderingMode: renderingMode,
        color: color ?? .primary,
        secondaryColor: secondaryColor,
        tertiaryColor: tertiaryColor,
        gradient: gradient
      ))
      .modifier(SymbolTransition(transition: transition, value: transitionValue))
      .modifier(SymbolEffectPlayback(effect: effect, trigger: effectTrigger, active: effectActive))
  }
}

private struct SymbolColors: ViewModifier {
  let renderingMode: String?
  let color: Color
  let secondaryColor: Color?
  let tertiaryColor: Color?
  let gradient: Bool

  func body(content: Content) -> some View {
    colored(content).modifier(Gradient(enabled: gradient))
  }

  @ViewBuilder
  private func colored(_ content: Content) -> some View {
    switch renderingMode {
    case "hierarchical":
      content.symbolRenderingMode(.hierarchical).foregroundStyle(color)
    case "palette":
      let secondary = secondaryColor ?? color
      content.symbolRenderingMode(.palette).foregroundStyle(color, secondary, tertiaryColor ?? secondary)
    case "multicolor":
      content.symbolRenderingMode(.multicolor).foregroundStyle(color).tint(color)
    default:
      content.symbolRenderingMode(.monochrome).foregroundStyle(color)
    }
  }

  private struct Gradient: ViewModifier {
    let enabled: Bool

    @ViewBuilder
    func body(content: Content) -> some View {
      if #available(iOS 26.0, *), enabled {
        content.symbolColorRenderingMode(.gradient)
      } else {
        content
      }
    }
  }
}

/**
 * A content transition only animates inside an animation, so the modifier animates a change of `value` (the symbol's
 * name and variable value) itself. Unset, the symbol swaps at once.
 */
private struct SymbolTransition: ViewModifier {
  let transition: String?
  let value: String?

  @ViewBuilder
  func body(content: Content) -> some View {
    if #available(iOS 17.0, *), let transition {
      transitioned(content, transition).animation(.default, value: value)
    } else {
      content
    }
  }

  @available(iOS 17.0, *)
  @ViewBuilder
  private func transitioned(_ content: Content, _ transition: String) -> some View {
    switch transition {
    case "replaceUpUp":
      content.contentTransition(.symbolEffect(.replace.upUp))
    case "replaceOffUp":
      content.contentTransition(.symbolEffect(.replace.offUp))
    case "magicReplace":
      if #available(iOS 18.0, *) {
        content.contentTransition(.symbolEffect(.replace.magic(fallback: .replace.downUp)))
      } else {
        content.contentTransition(.symbolEffect(.replace.downUp))
      }
    case "automatic":
      content.contentTransition(.symbolEffect(.automatic))
    default:
      content.contentTransition(.symbolEffect(.replace.downUp))
    }
  }
}

/**
 * The effect, as `NativeIconView` plays it: once per change of `trigger` (never on mount), else while `active`. Scale,
 * appear and disappear are states and always follow `active`. Wiggle, rotate and breathe need iOS 18.
 */
private struct SymbolEffectPlayback: ViewModifier {
  let effect: SymbolEffectRecord?
  let trigger: String?
  let active: Bool

  @ViewBuilder
  func body(content: Content) -> some View {
    if #available(iOS 17.0, *), let effect {
      let once = trigger != nil && !effect.isState
      played(content, effect, options: options(effect, once: once), once: once)
    } else {
      content
    }
  }

  @available(iOS 17.0, *)
  @ViewBuilder
  private func played(_ content: Content, _ effect: SymbolEffectRecord, options: SymbolEffectOptions, once: Bool) -> some View {
    let value = trigger ?? ""

    switch effect.type {
    case "bounce":
      let bounce = scoped(effect, effect.direction == "down" ? BounceSymbolEffect.bounce.down : effect.direction == "up" ? .bounce.up : .bounce)
      if once {
        content.symbolEffect(bounce, options: options, value: value)
      } else if #available(iOS 18.0, *) {
        content.symbolEffect(bounce, options: options, isActive: active)
      } else {
        content.symbolEffect(bounce, options: options.repeating, value: active)
      }
    case "pulse":
      let pulse = scoped(effect, PulseSymbolEffect.pulse)
      if once {
        content.symbolEffect(pulse, options: options, value: value)
      } else {
        content.symbolEffect(pulse, options: options, isActive: active)
      }
    case "variableColor":
      let variableColor = variableColor(effect)
      if once {
        content.symbolEffect(variableColor, options: options, value: value)
      } else {
        content.symbolEffect(variableColor, options: options, isActive: active)
      }
    case "scale":
      content.symbolEffect(scoped(effect, effect.direction == "down" ? ScaleSymbolEffect.scale.down : .scale.up), options: options, isActive: active)
    case "appear":
      let appear = effect.direction == "down" ? AppearSymbolEffect.appear.down : effect.direction == "up" ? .appear.up : .appear
      content.symbolEffect(scoped(effect, appear), options: options, isActive: active)
    case "disappear":
      let disappear = effect.direction == "down" ? DisappearSymbolEffect.disappear.down : effect.direction == "up" ? .disappear.up : .disappear
      content.symbolEffect(scoped(effect, disappear), options: options, isActive: active)
    default:
      if #available(iOS 18.0, *) {
        playedNewer(content, effect, options: options, once: once, value: value)
      } else {
        content
      }
    }
  }

  @available(iOS 18.0, *)
  @ViewBuilder
  private func playedNewer(_ content: Content, _ effect: SymbolEffectRecord, options: SymbolEffectOptions, once: Bool, value: String) -> some View {
    switch effect.type {
    case "wiggle":
      let wiggle = scoped(effect, wiggle(effect))
      if once {
        content.symbolEffect(wiggle, options: options, value: value)
      } else {
        content.symbolEffect(wiggle, options: options, isActive: active)
      }
    case "rotate":
      let rotate = scoped(effect, effect.direction == "counterClockwise" ? RotateSymbolEffect.rotate.counterClockwise : .rotate.clockwise)
      if once {
        content.symbolEffect(rotate, options: options, value: value)
      } else {
        content.symbolEffect(rotate, options: options, isActive: active)
      }
    case "breathe":
      let breathe = scoped(effect, effect.style == "pulse" ? BreatheSymbolEffect.breathe.pulse : effect.style == "plain" ? .breathe.plain : .breathe)
      if once {
        content.symbolEffect(breathe, options: options, value: value)
      } else {
        content.symbolEffect(breathe, options: options, isActive: active)
      }
    default:
      content
    }
  }

  @available(iOS 17.0, *)
  private func options(_ effect: SymbolEffectRecord, once: Bool) -> SymbolEffectOptions {
    let options = effect.speed.map { SymbolEffectOptions.default.speed($0) } ?? .default

    if #available(iOS 18.0, *) {
      if effect.repeatContinuous == true {
        return options.repeat(.continuous)
      }
      if effect.repeatCount != nil || (effect.repeatDelay != nil && !once) {
        return options.repeat(.periodic(effect.repeatCount, delay: effect.repeatDelay))
      }
      return once ? options.nonRepeating : options
    }

    if let count = effect.repeatCount {
      return options.repeat(count)
    }

    return once ? options.nonRepeating : options
  }

  @available(iOS 17.0, *)
  private func variableColor(_ effect: SymbolEffectRecord) -> VariableColorSymbolEffect {
    var variableColor = VariableColorSymbolEffect.variableColor

    if effect.fill == "iterative" {
      variableColor = variableColor.iterative
    } else if effect.fill == "cumulative" {
      variableColor = variableColor.cumulative
    }

    if let reversing = effect.reversing {
      variableColor = reversing ? variableColor.reversing : variableColor.nonReversing
    }

    if effect.inactiveLayers == "hide" {
      variableColor = variableColor.hideInactiveLayers
    } else if effect.inactiveLayers == "dim" {
      variableColor = variableColor.dimInactiveLayers
    }

    return variableColor
  }

  @available(iOS 18.0, *)
  private func wiggle(_ effect: SymbolEffectRecord) -> WiggleSymbolEffect {
    if let angle = effect.angle {
      return .wiggle.custom(angle: angle)
    }

    switch effect.direction {
    case "clockwise": return .wiggle.clockwise
    case "counterClockwise": return .wiggle.counterClockwise
    case "left": return .wiggle.left
    case "right": return .wiggle.right
    case "up": return .wiggle.up
    case "down": return .wiggle.down
    case "forward": return .wiggle.forward
    case "backward": return .wiggle.backward
    default: return .wiggle
    }
  }

  @available(iOS 17.0, *)
  private func scoped(_ effect: SymbolEffectRecord, _ bounce: BounceSymbolEffect) -> BounceSymbolEffect {
    effect.scope == "byLayer" ? bounce.byLayer : effect.scope == "wholeSymbol" ? bounce.wholeSymbol : bounce
  }

  @available(iOS 17.0, *)
  private func scoped(_ effect: SymbolEffectRecord, _ pulse: PulseSymbolEffect) -> PulseSymbolEffect {
    effect.scope == "byLayer" ? pulse.byLayer : effect.scope == "wholeSymbol" ? pulse.wholeSymbol : pulse
  }

  @available(iOS 17.0, *)
  private func scoped(_ effect: SymbolEffectRecord, _ scale: ScaleSymbolEffect) -> ScaleSymbolEffect {
    effect.scope == "byLayer" ? scale.byLayer : effect.scope == "wholeSymbol" ? scale.wholeSymbol : scale
  }

  @available(iOS 17.0, *)
  private func scoped(_ effect: SymbolEffectRecord, _ appear: AppearSymbolEffect) -> AppearSymbolEffect {
    effect.scope == "byLayer" ? appear.byLayer : effect.scope == "wholeSymbol" ? appear.wholeSymbol : appear
  }

  @available(iOS 17.0, *)
  private func scoped(_ effect: SymbolEffectRecord, _ disappear: DisappearSymbolEffect) -> DisappearSymbolEffect {
    effect.scope == "byLayer" ? disappear.byLayer : effect.scope == "wholeSymbol" ? disappear.wholeSymbol : disappear
  }

  @available(iOS 18.0, *)
  private func scoped(_ effect: SymbolEffectRecord, _ wiggle: WiggleSymbolEffect) -> WiggleSymbolEffect {
    effect.scope == "byLayer" ? wiggle.byLayer : effect.scope == "wholeSymbol" ? wiggle.wholeSymbol : wiggle
  }

  @available(iOS 18.0, *)
  private func scoped(_ effect: SymbolEffectRecord, _ rotate: RotateSymbolEffect) -> RotateSymbolEffect {
    effect.scope == "byLayer" ? rotate.byLayer : effect.scope == "wholeSymbol" ? rotate.wholeSymbol : rotate
  }

  @available(iOS 18.0, *)
  private func scoped(_ effect: SymbolEffectRecord, _ breathe: BreatheSymbolEffect) -> BreatheSymbolEffect {
    effect.scope == "byLayer" ? breathe.byLayer : effect.scope == "wholeSymbol" ? breathe.wholeSymbol : breathe
  }
}
