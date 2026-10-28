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

  private static let height: CGFloat = 32
  private static let idleWidth: CGFloat = 30
  private static let listeningWidth: CGFloat = 104
  private static let stopSize: CGFloat = 26
  private static let glyphSize: CGFloat = 20
  private static let waveformSize = CGSize(width: 64, height: 20)

  var onAction: ((Action) -> Void)?

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
      stopButton.layer.cornerRadius = Self.stopSize / 2
      stopButton.layer.cornerCurve = .circular
    }

    waveform.style.barWidth = 2
    waveform.style.barGap = 2
    waveform.style.minBarHeight = 2
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

  /// Glyphs (an app image by name, drawn as a template, or the system's), labels and colour.
  func apply(_ record: SearchVoiceRecord) {
    microphoneButton.setImage(Self.image(named: record.microphoneImageName, system: "mic", pointSize: 17), for: .normal)
    clearButton.setImage(
      Self.image(named: record.clearImageName, system: "xmark.circle.fill", pointSize: 17), for: .normal)
    stopImage = Self.image(named: record.stopImageName, system: "stop.fill", pointSize: 11)
    microphoneButton.accessibilityLabel = record.microphoneLabel
    clearButton.accessibilityLabel = record.clearLabel
    stopButton.accessibilityLabel = record.stopLabel
    color = record.color ?? .label
    isListening = record.listening
  }

  override var intrinsicContentSize: CGSize {
    CGSize(width: isListening ? Self.listeningWidth : Self.idleWidth, height: Self.height)
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    let iconMidX = bounds.maxX + measureTrailingOverhang() - Self.glyphSize / 2
    let midY = bounds.midY
    microphoneButton.frame = CGRect(x: iconMidX - Self.idleWidth / 2, y: 0, width: Self.idleWidth, height: bounds.height)
    clearButton.frame = microphoneButton.frame
    stopButton.frame = CGRect(
      x: iconMidX - Self.stopSize / 2, y: midY - Self.stopSize / 2, width: Self.stopSize, height: Self.stopSize)
    waveform.frame = CGRect(
      x: stopButton.frame.minX - 8 - Self.waveformSize.width, y: midY - Self.waveformSize.height / 2,
      width: Self.waveformSize.width, height: Self.waveformSize.height)
  }

  override func point(inside point: CGPoint, with event: UIEvent?) -> Bool {
    bounds.contains(point)
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

  private static func image(named name: String?, system: String, pointSize: CGFloat) -> UIImage? {
    if let image = name.flatMap({ UIImage(named: $0) }) {
      return image.withRenderingMode(.alwaysTemplate)
    }
    return UIImage(systemName: system, withConfiguration: UIImage.SymbolConfiguration(pointSize: pointSize))
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

  private func update(isAnimated: Bool) {
    let listening = isListening
    let showsClear = !listening && !(field?.text ?? "").isEmpty
    let showsMicrophone = !listening && !showsClear

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
}
