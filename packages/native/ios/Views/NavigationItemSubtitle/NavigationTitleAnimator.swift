import UIKit

/**
 Plays a `NavigationTitleTransition` over the navigation bar's own title and subtitle. Each line gets a layer in the
 bar that plays its snapshot as 60 fps keyframes (opacity, offset and scale, the blurred copies); on the way in the
 real label stays hidden by an opacity animation that ends in the same frame, so the hand-over cannot be seen. Core
 Animation runs the keyframes, so a busy main thread does not stall them.
 */
final class NavigationTitleAnimator {
  enum Direction {
    case enter
    case exit
  }

  private static let animationKey = "karaNavigationTitleTransition"
  private static let frameDuration: CFTimeInterval = 1.0 / 60.0

  private struct Overlay {
    let layer: CALayer
    weak var label: UILabel?
  }

  private var overlays: [Overlay] = []
  private var cleanup: DispatchWorkItem?

  /** Pictures of the title and subtitle as they are now, for an exit once the stack has taken the title away. */
  func snapshots(
    in navigationBar: UINavigationBar,
    title: String,
    subtitle: String,
    transition: NavigationTitleTransition
  ) -> [NavigationTitleSnapshot] {
    guard transition.isAnimated else {
      return []
    }
    navigationBar.layoutIfNeeded()
    return Self.lines(title: title, subtitle: subtitle, transition: transition).compactMap { text, motion in
      Self.findLabel(text, in: navigationBar).flatMap { NavigationTitleSnapshot(label: $0, in: navigationBar, motion: motion) }
    }
  }

  /** Brings the title and subtitle in. Returns their snapshots, empty when the labels are not in the bar yet. */
  @discardableResult
  func enter(
    in navigationBar: UINavigationBar,
    title: String,
    subtitle: String,
    transition: NavigationTitleTransition
  ) -> [NavigationTitleSnapshot] {
    cancel()
    guard transition.isAnimated else {
      return []
    }
    navigationBar.layoutIfNeeded()
    var revealed: [(label: UILabel, snapshot: NavigationTitleSnapshot)] = []
    for (text, motion) in Self.lines(title: title, subtitle: subtitle, transition: transition) {
      guard let label = Self.findLabel(text, in: navigationBar),
        let snapshot = NavigationTitleSnapshot(label: label, in: navigationBar, motion: motion)
      else {
        continue
      }
      revealed.append((label, snapshot))
    }

    let start = CACurrentMediaTime()
    CATransaction.begin()
    CATransaction.setDisableActions(true)
    for (label, snapshot) in revealed {
      let layer = Self.play(snapshot, direction: .enter, in: navigationBar.layer, from: start)
      label.layer.add(Self.hiding(for: snapshot, layer: label.layer, from: start), forKey: Self.animationKey)
      overlays.append(Overlay(layer: layer, label: label))
    }
    CATransaction.commit()
    scheduleCleanup(after: revealed.map { Self.keyframeDuration(of: $0.snapshot.motion) }.max())
    return revealed.map(\.snapshot)
  }

  /** Takes the title and subtitle out the way they came in, from pictures of them taken while they were shown. */
  func exit(in navigationBar: UINavigationBar, snapshots: [NavigationTitleSnapshot]) {
    cancel()
    guard !snapshots.isEmpty else {
      return
    }
    let start = CACurrentMediaTime()
    CATransaction.begin()
    CATransaction.setDisableActions(true)
    for snapshot in snapshots {
      overlays.append(Overlay(layer: Self.play(snapshot, direction: .exit, in: navigationBar.layer, from: start), label: nil))
    }
    CATransaction.commit()
    scheduleCleanup(after: snapshots.map { Self.keyframeDuration(of: $0.motion) }.max())
  }

  /** Stops a transition at once: the layers go and the labels show as they are. */
  func cancel() {
    cleanup?.cancel()
    cleanup = nil
    guard !overlays.isEmpty else {
      return
    }
    CATransaction.begin()
    CATransaction.setDisableActions(true)
    for overlay in overlays {
      overlay.layer.removeFromSuperlayer()
      overlay.label?.layer.removeAnimation(forKey: Self.animationKey)
    }
    CATransaction.commit()
    overlays.removeAll()
  }

  private func scheduleCleanup(after duration: CFTimeInterval?) {
    guard let duration else {
      return
    }
    let work = DispatchWorkItem { [weak self] in
      self?.cancel()
    }
    cleanup = work
    DispatchQueue.main.asyncAfter(deadline: .now() + duration + Self.frameDuration, execute: work)
  }

  private static func lines(
    title: String,
    subtitle: String,
    transition: NavigationTitleTransition
  ) -> [(text: String, motion: NavigationTitleLineMotion)] {
    let reduceMotion = UIAccessibility.isReduceMotionEnabled
    return [(title, transition.title), (subtitle, transition.subtitle)]
      .filter { !$0.0.isEmpty }
      .map { text, motion in (text, reduceMotion ? motion.fadeOnly : motion) }
  }

  private static func findLabel(_ text: String, in navigationBar: UINavigationBar) -> UILabel? {
    NavigationTitleSnapshot.findLabel(showing: text, in: navigationBar)
  }

  private static func keyframeDuration(of motion: NavigationTitleLineMotion) -> CFTimeInterval {
    (motion.duration / frameDuration).rounded(.up) * frameDuration
  }

  private static func hiding(for snapshot: NavigationTitleSnapshot, layer: CALayer, from start: CFTimeInterval) -> CAAnimation {
    let hidden = CABasicAnimation(keyPath: "opacity")
    hidden.fromValue = 0
    hidden.toValue = 0
    hidden.beginTime = layer.convertTime(start, from: nil)
    hidden.duration = keyframeDuration(of: snapshot.motion)
    return hidden
  }

  private static func play(
    _ snapshot: NavigationTitleSnapshot,
    direction: Direction,
    in container: CALayer,
    from start: CFTimeInterval
  ) -> CALayer {
    let motion = snapshot.motion
    let duration = keyframeDuration(of: motion)
    let frameCount = Int((duration / frameDuration).rounded()) + 1
    var opacities: [NSNumber] = []
    var transforms: [NSValue] = []
    var images: [Any] = []
    for frame in 0..<frameCount {
      let isLast = frame == frameCount - 1
      let time = Double(frame) * frameDuration - motion.delay
      let shown = isLast ? 1 : motion.opacity.progress(at: time)
      let placed = isLast ? 1 : motion.position.progress(at: time)
      let sharp = isLast ? 1 : motion.clarity.progress(at: time)
      let visibility = direction == .enter ? shown : 1 - shown
      let arrival = direction == .enter ? placed : 1 - placed
      let clarity = direction == .enter ? sharp : 1 - sharp
      let scale = 1 + (motion.scale - 1) * (1 - arrival)
      let offset = CATransform3DMakeTranslation(0, motion.offset * (1 - arrival), 0)
      opacities.append(NSNumber(value: Float(min(max(visibility, 0), 1))))
      transforms.append(NSValue(caTransform3D: CATransform3DScale(offset, scale, scale, 1)))
      images.append(snapshot.image(blurredBy: 1 - clarity))
    }

    let layer = CALayer()
    layer.frame = snapshot.frame.insetBy(dx: -snapshot.padding, dy: -snapshot.padding)
    layer.contents = snapshot.ladder[0]
    layer.opacity = 0
    container.addSublayer(layer)

    let keyTimes = (0..<frameCount).map { NSNumber(value: Double($0) / Double(max(frameCount - 1, 1))) }

    let opacity = CAKeyframeAnimation(keyPath: "opacity")
    opacity.values = opacities
    opacity.keyTimes = keyTimes

    let transform = CAKeyframeAnimation(keyPath: "transform")
    transform.values = transforms
    transform.keyTimes = keyTimes

    let contents = CAKeyframeAnimation(keyPath: "contents")
    contents.values = images
    contents.keyTimes = keyTimes
    contents.calculationMode = .discrete

    let group = CAAnimationGroup()
    group.animations = [opacity, transform, contents]
    group.beginTime = layer.convertTime(start, from: nil)
    group.duration = duration
    group.fillMode = .backwards
    group.timingFunction = CAMediaTimingFunction(name: .linear)
    layer.add(group, forKey: animationKey)
    return layer
  }
}
