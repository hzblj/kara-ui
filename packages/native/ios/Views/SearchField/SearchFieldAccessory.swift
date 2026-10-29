import ExpoModulesCore
import ExpoWaveform
import UIKit

/**
 The trailing end of a search field, as its `rightView`: one place that holds the microphone while the field is
 empty, a clear button once it holds text (the field's own clear button is off), and, while listening, a live waveform
 with a stop button in a circle (iOS 26 glass). Nothing here records: `onAction` reports `start` and `stop`, and the
 waveform follows whatever `meter` is (a transcription that posts `expo.audioLevel`, `@hzblj/expo-speech`'s
 `Transcription` among them), without JavaScript.

 The glyphs sit as far from the field's trailing edge as the magnifier sits from its leading edge. UIKit insets the
 `rightView` more than the `leftView`, so the buttons are laid out past the accessory's own bounds by the difference of
 `rightViewRect(forBounds:)` and `leftViewRect(forBounds:)`, and the hit area follows them. Measuring the accessory's
 own frame went stale: UIKit only moves it, which runs no `layoutSubviews`.

 A size change is laid out at once, out of any animation the call came in (a keyboard's), and only the opacities
 animate, so nothing slides when listening starts or stops.
 */
final class SearchFieldAccessory: UIView {
  enum Action: String {
    case start, stop
  }

  /// What the parts measure, in points, from the record's `sizes`. A glyph left at `nil` keeps its own size: an app
  /// image's, or the system symbol's.
  struct Sizes: Equatable {
    var clearIconSize: CGFloat?
    var microphoneIconSize: CGFloat?
    var stopButtonSize: CGFloat = 26
    var waveformWidth: CGFloat = 64
    var waveformHeight: CGFloat = 20
    var waveformBarWidth: CGFloat = 2
    var waveformBarGap: CGFloat = 2
    /// `nil` is half of the bar's width: round ends.
    var waveformBarRadius: CGFloat?
    var waveformMinBarHeight: CGFloat = 2
  }

  private static let height: CGFloat = 32
  private static let idleWidth: CGFloat = 30
  /// The place a glyph of its own size takes: the microphone's centre sits half of it from the trailing edge.
  private static let glyphSize: CGFloat = 20
  /// Between the waveform and the stop button, and between the text and the waveform.
  private static let meterGap: CGFloat = 8
  private static let textGap: CGFloat = 9

  var onAction: ((Action) -> Void)?

  /// Hides the microphone, the clear button and the meter, which then take no touches: the navigation bar's
  /// integrated search keeps the field collapsed into its search button while it is not searching.
  private(set) var isContentHidden = false

  var isListening = false {
    didSet {
      guard isListening != oldValue else {
        return
      }
      if isListening {
        waveform.reset()
      }
      update(isAnimated: window != nil)
    }
  }

  var meter: AnyObject? {
    didSet {
      waveform.meter = meter
    }
  }

  var color: UIColor = .label {
    didSet {
      microphoneButton.tintColor = color
      clearButton.tintColor = color
      waveform.color = color
      applyStopImage()
    }
  }

  private let microphoneButton = UIButton(type: .system)
  private let clearButton = UIButton(type: .system)
  private let stopButton = UIButton(type: .system)
  private let waveform = LiveWaveformView()
  private var stopImage: UIImage?
  private var sizes = Sizes()
  private weak var field: UISearchTextField?
  private var fieldClearButtonMode: UITextField.ViewMode?
  private var editingObservers: [NSObjectProtocol] = []
  private var rightViewModeObservation: NSKeyValueObservation?

  override init(frame: CGRect) {
    super.init(frame: CGRect(x: 0, y: 0, width: Self.idleWidth, height: Self.height))

    microphoneButton.tintColor = color
    microphoneButton.addAction(UIAction { [weak self] _ in self?.start() }, for: .primaryActionTriggered)
    clearButton.tintColor = color
    clearButton.addAction(UIAction { [weak self] _ in self?.clearText() }, for: .primaryActionTriggered)
    stopButton.addAction(UIAction { [weak self] _ in self?.onAction?(.stop) }, for: .primaryActionTriggered)
    if #unavailable(iOS 26.0) {
      stopButton.backgroundColor = .tertiarySystemFill
      stopButton.layer.cornerCurve = .circular
    }

    waveform.growIn = LiveWaveformGrowIn()
    waveform.color = color
    waveform.isAccessibilityElement = false

    apply(SearchVoiceRecord())
    for view in [waveform, stopButton, clearButton, microphoneButton] {
      addSubview(view)
    }
    update(isAnimated: false)
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) is not supported")
  }

  /// Glyphs (an app image by name, drawn as a template, or the system's), labels, colour and sizes.
  func apply(_ record: SearchVoiceRecord) {
    let sizes = Sizes(record.sizes)
    microphoneButton.setImage(
      Self.image(named: record.microphoneImageName, system: "mic", pointSize: 17, size: sizes.microphoneIconSize),
      for: .normal)
    clearButton.setImage(
      Self.image(named: record.clearImageName, system: "xmark.circle.fill", pointSize: 17, size: sizes.clearIconSize),
      for: .normal)
    stopImage = Self.image(named: record.stopImageName, system: "stop.fill", pointSize: 11)
    if #unavailable(iOS 26.0) {
      stopButton.layer.cornerRadius = sizes.stopButtonSize / 2
    }
    waveform.style.barWidth = sizes.waveformBarWidth
    waveform.style.barGap = sizes.waveformBarGap
    waveform.style.barRadius = sizes.waveformBarRadius
    waveform.style.minBarHeight = sizes.waveformMinBarHeight
    if sizes != self.sizes {
      self.sizes = sizes
      update(isAnimated: false)
    }
    microphoneButton.accessibilityLabel = record.microphoneLabel
    clearButton.accessibilityLabel = record.clearLabel
    stopButton.accessibilityLabel = record.stopLabel
    color = record.color ?? .label
    isListening = record.listening
  }

  /// Listening, the waveform and the stop button take the room left of the microphone's place.
  override var intrinsicContentSize: CGSize {
    let listeningWidth =
      Self.textGap + sizes.waveformWidth + Self.meterGap + sizes.stopButtonSize / 2 + microphonePlace / 2
    return CGSize(width: isListening ? listeningWidth : Self.idleWidth, height: Self.height)
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    let iconMidX = bounds.maxX + measureTrailingOverhang() - microphonePlace / 2
    let midY = bounds.midY
    let stopSize = sizes.stopButtonSize
    microphoneButton.frame = CGRect(x: iconMidX - Self.idleWidth / 2, y: 0, width: Self.idleWidth, height: bounds.height)
    clearButton.frame = microphoneButton.frame
    stopButton.frame = CGRect(x: iconMidX - stopSize / 2, y: midY - stopSize / 2, width: stopSize, height: stopSize)
    waveform.frame = CGRect(
      x: stopButton.frame.minX - Self.meterGap - sizes.waveformWidth, y: midY - sizes.waveformHeight / 2,
      width: sizes.waveformWidth, height: sizes.waveformHeight)
  }

  private var microphonePlace: CGFloat {
    sizes.microphoneIconSize ?? Self.glyphSize
  }

  override func point(inside point: CGPoint, with event: UIEvent?) -> Bool {
    guard !isContentHidden else {
      return false
    }
    return bounds.contains(point)
      || [microphoneButton, clearButton, stopButton].contains { $0.isUserInteractionEnabled && $0.frame.contains(point) }
  }

  /// Becomes the field's `rightView` and keeps it shown: integrated search sets `rightViewMode` to `.never`.
  func attach(to searchBar: UISearchBar) {
    let field = searchBar.searchTextField
    guard self.field !== field || field.rightView !== self else {
      return
    }
    detach()
    self.field = field
    fieldClearButtonMode = field.clearButtonMode
    field.clearButtonMode = .never
    field.addTarget(self, action: #selector(refresh), for: .editingChanged)
    editingObservers = [UITextField.textDidBeginEditingNotification, UITextField.textDidEndEditingNotification].map {
      NotificationCenter.default.addObserver(forName: $0, object: field, queue: .main) { [weak self] _ in
        self?.refresh()
      }
    }
    field.rightView = self
    field.rightViewMode = .always
    rightViewModeObservation = field.observe(\.rightViewMode) { [weak self] field, _ in
      guard let self, field.rightView === self, field.rightViewMode != .always else {
        return
      }
      field.rightViewMode = .always
    }
    update(isAnimated: false)
  }

  func detach() {
    guard let field else {
      return
    }
    field.removeTarget(self, action: #selector(refresh), for: .editingChanged)
    rightViewModeObservation = nil
    for observer in editingObservers {
      NotificationCenter.default.removeObserver(observer)
    }
    editingObservers = []
    if let mode = fieldClearButtonMode {
      field.clearButtonMode = mode
    }
    fieldClearButtonMode = nil
    if field.rightView === self {
      field.rightView = nil
    }
    self.field = nil
  }

  /// Reads the text again: after a change no `.editingChanged` reports (a programmatic `text`).
  @objc func refresh() {
    update(isAnimated: window != nil)
  }

  /// An app image by name or the system symbol, fitted into a square of `size` points when one is given.
  private static func image(named name: String?, system: String, pointSize: CGFloat, size: CGFloat? = nil) -> UIImage? {
    let image =
      name.flatMap({ UIImage(named: $0) })?.withRenderingMode(.alwaysTemplate)
      ?? UIImage(systemName: system, withConfiguration: UIImage.SymbolConfiguration(pointSize: pointSize))
    guard let image, let size, image.size.width > 0, image.size.height > 0 else {
      return image
    }
    let scale = min(size / image.size.width, size / image.size.height)
    let drawn = CGSize(width: image.size.width * scale, height: image.size.height * scale)
    return UIGraphicsImageRenderer(size: CGSize(width: size, height: size)).image { _ in
      image.draw(in: CGRect(origin: CGPoint(x: (size - drawn.width) / 2, y: (size - drawn.height) / 2), size: drawn))
    }.withRenderingMode(.alwaysTemplate)
  }

  private func applyStopImage() {
    if #available(iOS 26.0, *) {
      var stop = UIButton.Configuration.glass()
      stop.image = stopImage
      stop.baseForegroundColor = color
      stop.cornerStyle = .capsule
      stop.contentInsets = .zero
      stopButton.configuration = stop
    } else {
      stopButton.setImage(stopImage, for: .normal)
      stopButton.tintColor = color
    }
  }

  private func measureTrailingOverhang() -> CGFloat {
    guard let field, field.leftView != nil else {
      return 0
    }
    let fieldBounds = field.bounds
    let leadingInset = field.leftViewRect(forBounds: fieldBounds).minX
    let trailingInset = fieldBounds.maxX - field.rightViewRect(forBounds: fieldBounds).maxX
    return max(trailingInset - leadingInset, 0)
  }

  /// Empties the field the way its own clear button would: `UISearchBar` turns `.editingChanged` into
  /// `searchBar(_:textDidChange:)`, so its delegate (react-native-screens, `NavigationBarView`) hears it.
  private func clearText() {
    guard let field else {
      return
    }
    if !field.isFirstResponder {
      field.becomeFirstResponder()
    }
    field.text = ""
    field.sendActions(for: .editingChanged)
  }

  private func start() {
    field?.becomeFirstResponder()
    onAction?(.start)
  }

  func setContentHidden(_ isHidden: Bool, isAnimated: Bool) {
    guard isContentHidden != isHidden else {
      return
    }
    isContentHidden = isHidden
    update(isAnimated: isAnimated && window != nil)
  }

  private func update(isAnimated: Bool) {
    let listening = isListening && !isContentHidden
    let showsClear = !isListening && !isContentHidden && !(field?.text ?? "").isEmpty
    let showsMicrophone = !isListening && !isContentHidden && !showsClear

    UIView.performWithoutAnimation {
      bounds.size = intrinsicContentSize
      invalidateIntrinsicContentSize()
      setNeedsLayout()
      layoutIfNeeded()
      field?.setNeedsLayout()
      field?.layoutIfNeeded()
    }
    let apply = {
      self.microphoneButton.alpha = showsMicrophone ? 1 : 0
      self.clearButton.alpha = showsClear ? 1 : 0
      self.stopButton.alpha = listening ? 1 : 0
      self.waveform.alpha = listening ? 1 : 0
    }
    microphoneButton.isUserInteractionEnabled = showsMicrophone
    clearButton.isUserInteractionEnabled = showsClear
    stopButton.isUserInteractionEnabled = listening
    microphoneButton.isAccessibilityElement = showsMicrophone
    clearButton.isAccessibilityElement = showsClear
    stopButton.isAccessibilityElement = listening

    guard isAnimated, !UIAccessibility.isReduceMotionEnabled else {
      apply()
      return
    }
    UIView.animate(withDuration: 0.2, delay: 0, options: [.beginFromCurrentState, .allowUserInteraction], animations: apply)
  }
}

/// A search field's voice, from JavaScript. Image names are the app's asset-catalog images; unset, the system's.
struct SearchVoiceRecord: Record {
  @Field var enabled: Bool = false
  @Field var listening: Bool = false
  @Field var microphoneImageName: String?
  @Field var stopImageName: String?
  @Field var clearImageName: String?
  @Field var microphoneLabel: String?
  @Field var stopLabel: String?
  @Field var clearLabel: String?
  @Field var color: UIColor?
  @Field var sizes: SearchVoiceSizesRecord?
}

/// `SearchVoiceSizes` in `src/search-voice.ts`: each size left out keeps the accessory's own.
struct SearchVoiceSizesRecord: Record {
  @Field var clearIconSize: Double?
  @Field var microphoneIconSize: Double?
  @Field var stopButtonSize: Double?
  @Field var waveform: SearchVoiceWaveformSizesRecord?
}

struct SearchVoiceWaveformSizesRecord: Record {
  @Field var width: Double?
  @Field var height: Double?
  @Field var barWidth: Double?
  @Field var barGap: Double?
  @Field var barRadius: Double?
  @Field var minBarHeight: Double?
}

extension SearchFieldAccessory.Sizes {
  init(_ record: SearchVoiceSizesRecord?) {
    let defaults = Self()
    let waveform = record?.waveform
    clearIconSize = record?.clearIconSize.map { CGFloat($0) }
    microphoneIconSize = record?.microphoneIconSize.map { CGFloat($0) }
    stopButtonSize = record?.stopButtonSize.map { CGFloat($0) } ?? defaults.stopButtonSize
    waveformWidth = waveform?.width.map { CGFloat($0) } ?? defaults.waveformWidth
    waveformHeight = waveform?.height.map { CGFloat($0) } ?? defaults.waveformHeight
    waveformBarWidth = waveform?.barWidth.map { CGFloat($0) } ?? defaults.waveformBarWidth
    waveformBarGap = waveform?.barGap.map { CGFloat($0) } ?? defaults.waveformBarGap
    waveformBarRadius = waveform?.barRadius.map { CGFloat($0) }
    waveformMinBarHeight = waveform?.minBarHeight.map { CGFloat($0) } ?? defaults.waveformMinBarHeight
  }
}
