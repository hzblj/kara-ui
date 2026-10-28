import ExpoModulesCore
import UIKit

internal final class SegmentedControlRecord: Record {
  @Field var label: String = ""
  @Field var value: String = ""
  /// An asset-catalog image (the app's icon): drawn before the label, in the label's colour.
  @Field var icon: String?
  /// An image by URL or bundle name (a logo): drawn in its own colours instead of the label, which stays its
  /// accessibility label and comes back if the image cannot be loaded.
  @Field var image: String?

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

  /// What UIKit keeps between its own track and the selected pill.
  private static let systemPillInset: CGFloat = 2

  /// The track kara draws itself, under a clear control, once a track colour is set.
  private let track = UIView()
  private let control = UISegmentedControl()

  private var segments: [SegmentedControlRecord] = []
  private var reportedHeight: CGFloat = -1
  private var pendingSelectedValue: String?
  private var reconcileToken = 0

  private var activeTextColor: UIColor = .white
  private var inactiveTextColor: UIColor = .label
  private var fontFamily: String?
  private var fontSize: CGFloat = UIFont.labelFontSize
  /// The system face's weight, when no `fontFamily` is set.
  private var fontWeight: UIFont.Weight = .medium
  /// Extra space between the label's letters, in points. nil keeps the face's own.
  private var letterSpacing: CGFloat?
  // nil for either keeps UIKit's own rounded look.
  private var trackCornerRadius: CGFloat?
  private var pillCornerRadius: CGFloat?
  /// nil keeps UIKit's own track. Set, kara draws the track in exactly this colour.
  private var trackColor: UIColor?
  /// Space between kara's track and the selected pill. nil keeps UIKit's own 2 pt.
  private var trackPadding: CGFloat?
  /// The height of an icon or an image in a segment.
  private var iconSize: CGFloat = 20
  /// Space above and below a segment's content. nil keeps UIKit's own height.
  private var verticalPadding: CGFloat?
  /// Each icon segment's template, drawn again in the label's colour whenever the selection or the colours change.
  private var icons: [Int: UIImage] = [:]

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    track.isUserInteractionEnabled = false
    track.isHidden = true
    control.apportionsSegmentWidthsByContent = false
    control.addTarget(self, action: #selector(segmentChanged), for: .valueChanged)
    addSubview(track)
    addSubview(control)
  }

  public override func layoutSubviews() {
    super.layoutSubviews()
    track.frame = bounds
    control.frame = bounds.insetBy(dx: controlInset, dy: controlInset)
    applyTrackCorners()
    applyPillCorners()
    reportHeight()
  }

  /// Yoga never asks a native view for its size, so the control's own height goes to the shadow node — the width
  /// stays the layout's (a negative width leaves it unset). With a vertical padding the control is as tall as its
  /// content and that padding, and never less than UIKit's own height. A padded track of kara's own adds its padding
  /// on both sides, so the pill keeps that height.
  private func reportHeight() {
    let intrinsic = control.intrinsicContentSize.height
    let content = max(resolvedFont().lineHeight, iconSize)
    let padding = drawsOwnTrack ? trackPadding ?? 0 : 0
    let height =
      verticalPadding.map { max(intrinsic, ceil(content + 2 * ($0 + padding))) } ?? intrinsic + 2 * controlInset

    guard height > 0, height != reportedHeight else {
      return
    }

    reportedHeight = height
    setShadowNodeSize(-1, height: Float(height))
  }

  /// UIKit renders a control's own `backgroundColor` translucent, so a white track came out grey over a map, and a
  /// background image (`setBackgroundImage`) takes the selected pill away with the track. A track colour is therefore
  /// drawn by a plain view under a clear control, which keeps the system's pill (Liquid Glass on iOS 26).
  private var drawsOwnTrack: Bool {
    trackColor != nil
  }

  private var controlInset: CGFloat {
    guard drawsOwnTrack, let trackPadding else {
      return 0
    }

    return max(trackPadding - Self.systemPillInset, 0)
  }

  func setOptions(_ options: [SegmentedControlRecord]) {
    segments = options
    icons = [:]
    control.removeAllSegments()
    for (index, option) in options.enumerated() {
      // An image segment starts empty, as Footshop's does: its label only comes back if the image fails.
      control.insertSegment(withTitle: option.image == nil ? option.label : nil, at: index, animated: false)
      if let icon = option.icon.flatMap({ UIImage(named: $0) }) {
        icons[index] = icon.withRenderingMode(.alwaysTemplate)
      }
      loadImage(for: option, at: index)
    }
    applySelectedValue(pendingSelectedValue)
    applyIcons()
    setNeedsLayout()
  }

  func setIconSize(_ size: Double?) {
    iconSize = CGFloat(size ?? 20)
    applyIcons()
    reloadImages()
    setNeedsLayout()
  }

  func setVerticalPadding(_ padding: Double?) {
    verticalPadding = padding.map { CGFloat($0) }
    setNeedsLayout()
  }

  private func reloadImages() {
    for (index, option) in segments.enumerated() {
      loadImage(for: option, at: index)
    }
  }

  private func loadImage(for option: SegmentedControlRecord, at index: Int) {
    guard let source = option.image else {
      return
    }

    NativeImageLoader.loadImage(source, height: iconSize, scale: displayScale) { [weak self] image in
      self?.applyImage(image, to: option, at: index)
    }
  }

  private var displayScale: CGFloat {
    let scale = traitCollection.displayScale
    return scale > 0 ? scale : UITraitCollection.current.displayScale
  }

  private func applyImage(_ image: UIImage?, to option: SegmentedControlRecord, at index: Int) {
    // The options may have changed while the image loaded.
    guard index < segments.count, segments[index] === option else {
      return
    }

    guard let image else {
      control.setTitle(option.label, forSegmentAt: index)
      return
    }

    image.accessibilityLabel = option.label
    control.setImage(image, forSegmentAt: index)
    setNeedsLayout()
  }

  /// A segment shows a title or an image, never both, so an icon segment is one image: the icon and the label drawn
  /// together in the colour the label would have, the selected segment's or the others'.
  private func applyIcons() {
    for (index, icon) in icons where index < segments.count {
      let color = index == control.selectedSegmentIndex ? activeTextColor : inactiveTextColor
      control.setImage(renderSegment(icon: icon, label: segments[index].label, color: color), forSegmentAt: index)
    }
  }

  private func renderSegment(icon: UIImage, label: String, color: UIColor) -> UIImage {
    let iconWidth = icon.size.height > 0 ? iconSize * icon.size.width / icon.size.height : iconSize
    let text = NSAttributedString(string: label, attributes: titleAttributes(color: color))
    let textSize = label.isEmpty ? .zero : text.size()
    let gap: CGFloat = label.isEmpty ? 0 : 6
    let height = max(iconSize, ceil(textSize.height))
    let size = CGSize(width: ceil(iconWidth + gap + textSize.width), height: height)
    let format = UIGraphicsImageRendererFormat.preferred()
    format.scale = displayScale

    let image = UIGraphicsImageRenderer(size: size, format: format).image { _ in
      icon.withTintColor(color, renderingMode: .alwaysOriginal)
        .draw(in: CGRect(x: 0, y: (height - iconSize) / 2, width: iconWidth, height: iconSize))
      if !label.isEmpty {
        text.draw(at: CGPoint(x: iconWidth + gap, y: (height - textSize.height) / 2))
      }
    }.withRenderingMode(.alwaysOriginal)
    image.accessibilityLabel = label

    return image
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
    trackColor = color
    applyTrack()
  }

  func setTrackPadding(_ padding: Double?) {
    trackPadding = padding.map { CGFloat($0) }
    applyTrack()
  }

  private func applyTrack() {
    track.isHidden = !drawsOwnTrack
    track.backgroundColor = trackColor
    control.backgroundColor = drawsOwnTrack ? .clear : nil
    setNeedsLayout()
  }

  func setActiveTextColor(_ color: UIColor) {
    activeTextColor = color
    applyTitleAttributes()
    applyIcons()
  }

  func setInactiveTextColor(_ color: UIColor) {
    inactiveTextColor = color
    applyTitleAttributes()
    applyIcons()
  }

  func setFontFamily(_ family: String?) {
    fontFamily = family
    applyTitleAttributes()
    applyIcons()
  }

  func setFontSize(_ size: Double) {
    fontSize = CGFloat(size)
    applyTitleAttributes()
    applyIcons()
  }

  func setFontWeight(_ weight: String?) {
    fontWeight = Self.systemWeight(weight)
    applyTitleAttributes()
    applyIcons()
  }

  func setLetterSpacing(_ spacing: Double?) {
    letterSpacing = spacing.map { CGFloat($0) }
    applyTitleAttributes()
    applyIcons()
  }

  /// The numeric weights React Native and the theme use, as the system face's.
  private static func systemWeight(_ weight: String?) -> UIFont.Weight {
    switch weight {
    case "100": return .ultraLight
    case "200": return .thin
    case "300": return .light
    case "400": return .regular
    case "600": return .semibold
    case "700": return .bold
    case "800": return .heavy
    case "900": return .black
    default: return .medium
    }
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
    // nil: radius 0 without clipping, which leaves UIKit's own rounded background showing. kara's own track is a
    // capsule then, the shape of iOS 26's.
    let radius = trackCornerRadius ?? (drawsOwnTrack ? bounds.height / 2 : nil)
    track.layer.cornerRadius = radius ?? 0
    control.layer.cornerRadius = radius.map { max($0 - controlInset, 0) } ?? 0
    control.layer.masksToBounds = radius != nil
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

    return .systemFont(ofSize: fontSize, weight: fontWeight)
  }

  private func titleAttributes(color: UIColor) -> [NSAttributedString.Key: Any] {
    var attributes: [NSAttributedString.Key: Any] = [.foregroundColor: color, .font: resolvedFont()]
    if let letterSpacing {
      attributes[.kern] = letterSpacing
    }

    return attributes
  }

  private func applyTitleAttributes() {
    let inactiveAttributes = titleAttributes(color: inactiveTextColor)
    let activeAttributes = titleAttributes(color: activeTextColor)
    control.setTitleTextAttributes(inactiveAttributes, for: .normal)
    control.setTitleTextAttributes(activeAttributes, for: .selected)
    // iOS 26 puts the segments under a held or dragged glass pill into the highlighted state; without these their
    // titles fall back to the system black until the drag ends.
    control.setTitleTextAttributes(inactiveAttributes, for: .highlighted)
    control.setTitleTextAttributes(activeAttributes, for: [.selected, .highlighted])
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
      applyIcons()
    }
  }

  @objc private func segmentChanged() {
    let index = control.selectedSegmentIndex

    guard index >= 0, index < segments.count else {
      return
    }

    applyIcons()
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
