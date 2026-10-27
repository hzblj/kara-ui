import ExpoModulesCore
import SDWebImage
import SDWebImageSVGCoder
import UIKit

internal final class SegmentedControlRecord: Record {
  @Field var label: String = ""
  @Field var value: String = ""
  /// An image shown instead of the label, which stays the segment's accessibility label.
  @Field var icon: URL?

  required init() {}
}

/**
 * A `UISegmentedControl` with its colours set from outside: the selected pill, both label colours and the track. The
 * system control would tint only the pill, and `@expo/ui`'s SwiftUI picker not even that — this is how the accent
 * reaches it. The React Native tier: a plain `UIView`, so it needs no host. Its height is UIKit's own, reported to
 * layout; the width is the layout's.
 */
public final class SegmentedControlView: ExpoView {
  let onValueChange = EventDispatcher()

  private let control = UISegmentedControl()

  private var segments: [SegmentedControlRecord] = []
  private var reportedHeight: CGFloat = -1
  private var pendingSelectedValue: String?
  private var reconcileToken = 0

  private var activeTextColor: UIColor = .white
  private var inactiveTextColor: UIColor = .label
  private var fontFamily: String?
  private var fontSize: CGFloat = UIFont.labelFontSize
  // nil for either keeps UIKit's own rounded look.
  private var trackCornerRadius: CGFloat?
  private var pillCornerRadius: CGFloat?
  private let iconHeight: CGFloat = 20

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    control.apportionsSegmentWidthsByContent = false
    control.addTarget(self, action: #selector(segmentChanged), for: .valueChanged)
    addSubview(control)
  }

  public override func layoutSubviews() {
    super.layoutSubviews()
    control.frame = bounds
    applyTrackCorners()
    applyPillCorners()
    reportHeight()
  }

  /// Yoga never asks a native view for its size, so the control's own height goes to the shadow node — the width
  /// stays the layout's (a negative width leaves it unset).
  private func reportHeight() {
    let height = control.intrinsicContentSize.height

    guard height > 0, height != reportedHeight else {
      return
    }

    reportedHeight = height
    setShadowNodeSize(-1, height: Float(height))
  }

  func setOptions(_ options: [SegmentedControlRecord]) {
    segments = options
    control.removeAllSegments()
    for (index, option) in options.enumerated() {
      control.insertSegment(withTitle: option.icon == nil ? option.label : nil, at: index, animated: false)
      loadIcon(for: option, at: index)
    }
    applySelectedValue(pendingSelectedValue)
  }

  /// A segment with an icon stays empty until SDWebImage has it (from its cache, the same one `expo-image` uses, or the
  /// network), and shows its label if the image cannot be loaded.
  private func loadIcon(for option: SegmentedControlRecord, at index: Int) {
    guard let url = option.icon else {
      return
    }

    SegmentedControlIcon.registerSVGCoder()
    _ = SDWebImageManager.shared.loadImage(with: url, options: [], progress: nil) { [weak self] icon, _, _, _, _, _ in
      self?.applyIcon(icon, to: option, at: index)
    }
  }

  private func applyIcon(_ icon: UIImage?, to option: SegmentedControlRecord, at index: Int) {
    // The options may have changed while the image loaded.
    guard index < segments.count, segments[index] === option else {
      return
    }

    guard let icon, let image = SegmentedControlIcon.image(from: icon, height: iconHeight, label: option.label) else {
      control.setTitle(option.label, forSegmentAt: index)
      return
    }

    control.setImage(image, forSegmentAt: index)
  }

  func setSelectedValue(_ value: String) {
    pendingSelectedValue = value
    // JS confirmed (or overrode) the selection, so the fallback below has nothing left to fix.
    reconcileToken += 1
    applySelectedValue(value)
  }

  func setDisabled(_ disabled: Bool) {
    control.isEnabled = !disabled
  }

  func setActivePillColor(_ color: UIColor) {
    control.selectedSegmentTintColor = color
  }

  func setTrackColor(_ color: UIColor?) {
    control.backgroundColor = color
  }

  func setActiveTextColor(_ color: UIColor) {
    activeTextColor = color
    applyTitleAttributes()
  }

  func setInactiveTextColor(_ color: UIColor) {
    inactiveTextColor = color
    applyTitleAttributes()
  }

  func setFontFamily(_ family: String?) {
    fontFamily = family
    applyTitleAttributes()
  }

  func setFontSize(_ size: Double) {
    fontSize = CGFloat(size)
    applyTitleAttributes()
  }

  func setCornerRadius(_ radius: Double?) {
    trackCornerRadius = radius.map { CGFloat($0) }
    applyTrackCorners()
  }

  func setPillCornerRadius(_ radius: Double?) {
    pillCornerRadius = radius.map { CGFloat($0) }
    setNeedsLayout()
  }

  private func applyTrackCorners() {
    // nil: radius 0 without clipping, which leaves UIKit's own rounded background showing.
    control.layer.cornerRadius = trackCornerRadius ?? 0
    control.layer.masksToBounds = trackCornerRadius != nil
  }

  private func applyPillCorners() {
    // Best effort: UIKit draws the selected segment's tint in a private subview — the one hosting no label or image
    // (segments do) and spanning about one segment. If a future iOS reorders these views, leave `pillCornerRadius` unset
    // to fall back to the system pill.
    guard let pillCornerRadius else {
      return
    }

    let segmentWidth = control.bounds.width / CGFloat(max(control.numberOfSegments, 1))
    for subview in control.subviews {
      let hostsContent = subview.subviews.contains { $0 is UILabel || $0 is UIImageView }
      let spansSegment = subview.bounds.width >= segmentWidth * 0.6
      if !hostsContent, spansSegment {
        subview.layer.cornerRadius = pillCornerRadius
        subview.layer.masksToBounds = true
      }
    }
  }

  private func resolvedFont() -> UIFont {
    // Not scaled with Dynamic Type: the control is laid out at a fixed height, which a larger label would overflow.
    if let fontFamily, let font = UIFont(name: fontFamily, size: fontSize) {
      return font
    }

    return .systemFont(ofSize: fontSize, weight: .medium)
  }

  private func applyTitleAttributes() {
    let font = resolvedFont()
    control.setTitleTextAttributes([.foregroundColor: inactiveTextColor, .font: font], for: .normal)
    control.setTitleTextAttributes([.foregroundColor: activeTextColor, .font: font], for: .selected)
    // A new font can change the control's height.
    setNeedsLayout()
  }

  private func applySelectedValue(_ value: String?) {
    guard let value, let index = segments.firstIndex(where: { $0.value == value }) else {
      return
    }

    if control.selectedSegmentIndex != index {
      // A move from the props is a correction, not the user's tap — jumping straight there keeps a tap UIKit already
      // animated from animating a second time.
      UIView.performWithoutAnimation {
        control.selectedSegmentIndex = index
      }
    }
  }

  @objc private func segmentChanged() {
    let index = control.selectedSegmentIndex

    guard index >= 0, index < segments.count else {
      return
    }

    onValueChange(["value": segments[index].value])
    scheduleSelectionReconcile()
  }

  /// JS owns the selection, but the pill stays where UIKit put it so the tap feels instant. If no `selectedValue`
  /// confirms the tap — the caller kept its value — the pill goes back to the prop instead of staying stale.
  private func scheduleSelectionReconcile() {
    reconcileToken += 1
    let token = reconcileToken

    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [weak self] in
      guard let self, token == self.reconcileToken else {
        return
      }

      self.applySelectedValue(self.pendingSelectedValue)
    }
  }
}

private enum SegmentedControlIcon {
  /// `expo-image` registers the SVG coder too; without it in the app, an SVG icon would not decode.
  private static let svgCoderRegistration: Void = {
    let coders = SDImageCodersManager.shared.coders ?? []
    if !coders.contains(where: { $0 is SDImageSVGCoder }) {
      SDImageCodersManager.shared.addCoder(SDImageSVGCoder.shared)
    }
  }()

  static func registerSVGCoder() {
    _ = svgCoderRegistration
  }

  /// The icon scaled to `height`, drawn in its own colours: UIKit tints a segment image like a template otherwise.
  static func image(from icon: UIImage, height: CGFloat, label: String) -> UIImage? {
    guard icon.size.height > 0 else {
      return nil
    }

    let size = CGSize(width: icon.size.width * height / icon.size.height, height: height)
    let image = UIGraphicsImageRenderer(size: size).image { _ in
      icon.draw(in: CGRect(origin: .zero, size: size))
    }.withRenderingMode(.alwaysOriginal)
    image.accessibilityLabel = label
    return image
  }
}
