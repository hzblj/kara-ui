import CoreGraphics
import QuartzCore

/** A cubic bézier easing from (0, 0) to (1, 1), as CSS and `CAMediaTimingFunction` define it. */
struct NavigationTitleEasing: Equatable {
  let x1: CGFloat
  let y1: CGFloat
  let x2: CGFloat
  let y2: CGFloat

  static let linear = NavigationTitleEasing(x1: 0, y1: 0, x2: 1, y2: 1)
  static let easeIn = NavigationTitleEasing(x1: 0.42, y1: 0, x2: 1, y2: 1)
  static let easeOut = NavigationTitleEasing(x1: 0, y1: 0, x2: 0.58, y2: 1)
  static let easeInOut = NavigationTitleEasing(x1: 0.42, y1: 0, x2: 0.58, y2: 1)

  init(x1: CGFloat, y1: CGFloat, x2: CGFloat, y2: CGFloat) {
    self.x1 = min(max(x1, 0), 1)
    self.y1 = y1
    self.x2 = min(max(x2, 0), 1)
    self.y2 = y2
  }

  /** The named curve, or `nil` for a name it does not know. */
  init?(name: String) {
    switch name {
    case "linear": self = .linear
    case "easeIn": self = .easeIn
    case "easeOut": self = .easeOut
    case "easeInOut": self = .easeInOut
    default: return nil
    }
  }

  /** The curve's value at `x` (time, 0 to 1). */
  func value(at x: CGFloat) -> CGFloat {
    guard x > 0 else {
      return 0
    }
    guard x < 1 else {
      return 1
    }
    return sampleY(solveT(forX: x))
  }

  private func sampleX(_ t: CGFloat) -> CGFloat {
    ((1 - 3 * x2 + 3 * x1) * t + (3 * x2 - 6 * x1)) * t * t + 3 * x1 * t
  }

  private func sampleY(_ t: CGFloat) -> CGFloat {
    ((1 - 3 * y2 + 3 * y1) * t + (3 * y2 - 6 * y1)) * t * t + 3 * y1 * t
  }

  private func slopeX(_ t: CGFloat) -> CGFloat {
    3 * (1 - 3 * x2 + 3 * x1) * t * t + 2 * (3 * x2 - 6 * x1) * t + 3 * x1
  }

  private func solveT(forX x: CGFloat) -> CGFloat {
    var t = x
    for _ in 0..<8 {
      let error = sampleX(t) - x
      let slope = slopeX(t)
      if abs(error) < 1e-5 {
        return t
      }
      if abs(slope) < 1e-6 {
        break
      }
      t -= error / slope
    }
    var low: CGFloat = 0
    var high: CGFloat = 1
    t = x
    while high - low > 1e-5 {
      if sampleX(t) < x {
        low = t
      } else {
        high = t
      }
      t = (low + high) / 2
    }
    return t
  }
}

/**
 How one property of a title line gets from its start to its place: a spring (`response` in seconds, `dampingFraction`
 1 for no overshoot, below 1 to bounce) or a fixed duration with an easing. `progress(at:)` runs from 0 to 1.
 */
enum NavigationTitleCurve: Equatable {
  case spring(response: CFTimeInterval, dampingFraction: CGFloat)
  case timing(duration: CFTimeInterval, easing: NavigationTitleEasing)

  private static let settleTolerance: CGFloat = 0.001
  private static let settleStep: CFTimeInterval = 1.0 / 120.0
  private static let longestSettle: CFTimeInterval = 4

  /** Where the property is at `time` seconds after it starts, from 0 to 1 (a bouncy spring passes 1 on the way). */
  func progress(at time: CFTimeInterval) -> CGFloat {
    guard time > 0 else {
      return 0
    }
    switch self {
    case let .spring(response, dampingFraction):
      return Self.spring(at: time, response: response, dampingFraction: dampingFraction)
    case let .timing(duration, easing):
      guard duration > 0 else {
        return 1
      }
      return easing.value(at: CGFloat(time / duration))
    }
  }

  /** When the property has arrived: a timing's duration, or the moment a spring stays within 0.1 % of its place. */
  var settleDuration: CFTimeInterval {
    switch self {
    case let .timing(duration, _):
      return max(duration, 0)
    case .spring:
      var settled: CFTimeInterval = 0
      var time: CFTimeInterval = 0
      while time < Self.longestSettle {
        time += Self.settleStep
        if abs(1 - progress(at: time)) >= Self.settleTolerance {
          settled = time
        }
      }
      return settled + Self.settleStep
    }
  }

  private static func spring(at time: CFTimeInterval, response: CFTimeInterval, dampingFraction: CGFloat) -> CGFloat {
    let omega = 2 * .pi / max(response, 0.01)
    let zeta = Double(max(dampingFraction, 0.01))
    if zeta < 1 {
      let damped = omega * (1 - zeta * zeta).squareRoot()
      let decay = exp(-zeta * omega * time)
      return CGFloat(1 - decay * (cos(damped * time) + zeta * omega / damped * sin(damped * time)))
    }
    if zeta == 1 {
      let phase = omega * time
      return CGFloat(1 - (1 + phase) * exp(-phase))
    }
    let root = (zeta * zeta - 1).squareRoot()
    let fast = -omega * (zeta + root)
    let slow = -omega * (zeta - root)
    return CGFloat(1 - (fast * exp(slow * time) - slow * exp(fast * time)) / (fast - slow))
  }
}
