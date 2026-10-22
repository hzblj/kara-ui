import ExpoModulesCore

/// What a bar item is: the back chevron, the system close item, or one of the app's icons with a label.
internal enum NavigationBarItemType: String, Enumerable {
  case back
  case close
  case icon
}

/// One bar item as JS sends it. Its press comes back as `onItemPress` with its placement and index.
internal final class NavigationBarItemRecord: Record {
  @Field var type: NavigationBarItemType = .icon
  @Field var imageName: String?
  @Field var label: String = ""
  @Field var testID: String?
  @Field var separated: Bool = false

  required init() {}
}

struct NavigationBarItem: Equatable {
  let type: NavigationBarItemType
  let imageName: String?
  let label: String
  let testID: String?
  let separated: Bool

  init(record: NavigationBarItemRecord) {
    type = record.type
    imageName = record.imageName
    label = record.label
    testID = record.testID
    separated = record.separated
  }
}

enum NavigationBarItemPlacement: String {
  case leading
  case trailing
}
