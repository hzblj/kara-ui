import CoreGraphics
import ExpoModulesCore
import QuartzCore

/**
 How one line of a revealed title (the title or the subtitle) comes in: where it starts (`offset` points below its
 place, `blur` radius, `scale`), after how long (`delay`) and along which curves. The opacity, the position (offset and
 scale) and the blur each have a curve of their own, as UIKit's own title does; a custom `timing` sets all three.
 */
struct NavigationTitleLineMotion: Equatable {
  var offset: CGFloat
  var blur: CGFloat
  var scale: CGFloat
  var delay: CFTimeInterval
  var opacity: NavigationTitleCurve
  var position: NavigationTitleCurve
  var clarity: NavigationTitleCurve

  /** The same curve for the opacity, the position and the blur. */
  init(offset: CGFloat, blur: CGFloat, scale: CGFloat = 1, delay: CFTimeInterval = 0, curve: NavigationTitleCurve) {
    self.init(offset: offset, blur: blur, scale: scale, delay: delay, opacity: curve, position: curve, clarity: curve)
  }

  init(
    offset: CGFloat,
    blur: CGFloat,
    scale: CGFloat = 1,
    delay: CFTimeInterval = 0,
    opacity: NavigationTitleCurve,
    position: NavigationTitleCurve,
    clarity: NavigationTitleCurve
  ) {
    self.offset = offset
    self.blur = blur
    self.scale = scale
    self.delay = delay
    self.opacity = opacity
    self.position = position
    self.clarity = clarity
  }

  /** The line without movement or blur, only fading: what Reduce Motion leaves of it. */
  var fadeOnly: NavigationTitleLineMotion {
    NavigationTitleLineMotion(offset: 0, blur: 0, delay: delay, opacity: opacity, position: opacity, clarity: opacity)
  }

  /** From the start of the transition until the line is in place. */
  var duration: CFTimeInterval {
    delay + max(opacity.settleDuration, position.settleDuration, clarity.settleDuration)
  }
}

/**
 How a title and its subtitle come into the navigation bar when they are revealed (`subtitleHidden` turning off), and
 whether they leave the same way backwards (`exit`). `rise`, the default, is Mail's inline title on iOS 26 as measured
 frame by frame: both lines start together, the title 17 pt below its place and blurred by 5.8 pt, the subtitle 14 pt
 and 5.9 pt on slower springs, so it trails without a delay.
 */
struct NavigationTitleTransition: Equatable {
  enum Exit: String {
    case none
    case reverse
  }

  var title: NavigationTitleLineMotion
  var subtitle: NavigationTitleLineMotion
  var exit: Exit
  var isAnimated: Bool

  static let rise = NavigationTitleTransition(
    title: NavigationTitleLineMotion(
      offset: 17,
      blur: 5.8,
      opacity: .spring(response: 0.41, dampingFraction: 1),
      position: .spring(response: 0.43, dampingFraction: 1),
      clarity: .spring(response: 0.38, dampingFraction: 1)
    ),
    subtitle: NavigationTitleLineMotion(
      offset: 14,
      blur: 5.9,
      opacity: .spring(response: 0.62, dampingFraction: 1),
      position: .spring(response: 0.64, dampingFraction: 1),
      clarity: .spring(response: 0.52, dampingFraction: 1)
    ),
    exit: .reverse,
    isAnimated: true
  )

  static let blur: NavigationTitleTransition = {
    var transition = rise
    transition.title.offset = 0
    transition.subtitle.offset = 0
    return transition
  }()

  static let fade = NavigationTitleTransition(
    title: NavigationTitleLineMotion(offset: 0, blur: 0, curve: .spring(response: 0.35, dampingFraction: 1)),
    subtitle: NavigationTitleLineMotion(offset: 0, blur: 0, curve: .spring(response: 0.5, dampingFraction: 1)),
    exit: .reverse,
    isAnimated: true
  )

  static let none: NavigationTitleTransition = {
    var transition = fade
    transition.exit = .none
    transition.isAnimated = false
    return transition
  }()

  static func preset(named name: String?) -> NavigationTitleTransition {
    switch name {
    case "blur": return .blur
    case "fade": return .fade
    case "none": return .none
    default: return .rise
    }
  }

  init(title: NavigationTitleLineMotion, subtitle: NavigationTitleLineMotion, exit: Exit, isAnimated: Bool) {
    self.title = title
    self.subtitle = subtitle
    self.exit = exit
    self.isAnimated = isAnimated
  }

  /** The record's preset with its overrides on top; `rise` without one. */
  init(record: NavigationTitleTransitionRecord?) {
    self = Self.preset(named: record?.preset)
    title = title.applying(record?.title)
    subtitle = subtitle.applying(record?.subtitle)
    if let exit = record?.exit.flatMap(Exit.init(rawValue:)) {
      self.exit = exit
    }
  }
}

/** `NavigationTitleTransition` in `src/swift-ui/navigation-item-subtitle`, normalized: the preset by name. */
struct NavigationTitleTransitionRecord: Record {
  @Field var preset: String?
  @Field var title: NavigationTitleLineRecord?
  @Field var subtitle: NavigationTitleLineRecord?
  @Field var exit: String?
}

struct NavigationTitleLineRecord: Record {
  @Field var offset: Double?
  @Field var blur: Double?
  @Field var scale: Double?
  @Field var delay: Double?
  @Field var timing: NavigationTitleTimingRecord?
}

/** A spring (`response`, `dampingFraction`) or a `duration` with a named `easing` or a cubic `bezier`. */
struct NavigationTitleTimingRecord: Record {
  @Field var type: String?
  @Field var response: Double?
  @Field var dampingFraction: Double?
  @Field var duration: Double?
  @Field var easing: String?
  @Field var bezier: [Double]?
}

private extension NavigationTitleLineMotion {
  func applying(_ record: NavigationTitleLineRecord?) -> NavigationTitleLineMotion {
    guard let record else {
      return self
    }
    var motion = self
    if let offset = record.offset {
      motion.offset = CGFloat(offset)
    }
    if let blur = record.blur {
      motion.blur = max(CGFloat(blur), 0)
    }
    if let scale = record.scale {
      motion.scale = max(CGFloat(scale), 0.01)
    }
    if let delay = record.delay {
      motion.delay = max(delay, 0)
    }
    if let curve = NavigationTitleCurve(record: record.timing) {
      motion.opacity = curve
      motion.position = curve
      motion.clarity = curve
    }
    return motion
  }
}

private extension NavigationTitleCurve {
  init?(record: NavigationTitleTimingRecord?) {
    guard let record else {
      return nil
    }
    if record.type == "timing" {
      self = .timing(duration: max(record.duration ?? 0.35, 0), easing: NavigationTitleEasing(record: record))
      return
    }
    self = .spring(response: record.response ?? 0.4, dampingFraction: CGFloat(record.dampingFraction ?? 1))
  }
}

private extension NavigationTitleEasing {
  init(record: NavigationTitleTimingRecord) {
    if let bezier = record.bezier, bezier.count == 4 {
      self.init(x1: CGFloat(bezier[0]), y1: CGFloat(bezier[1]), x2: CGFloat(bezier[2]), y2: CGFloat(bezier[3]))
      return
    }
    self = record.easing.flatMap(NavigationTitleEasing.init(name:)) ?? .easeOut
  }
}
