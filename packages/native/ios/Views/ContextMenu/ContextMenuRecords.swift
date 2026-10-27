import ExpoModulesCore

/// A single action rendered inside the UIKit context menu.
internal final class ContextMenuActionRecord: Record {
  @Field var id: String = ""
  @Field var title: String = ""
  @Field var systemImage: String?
  /// An image in the app's asset catalog — an app icon. Wins over `systemImage`.
  @Field var image: String?
  @Field var destructive: Bool = false
  /// Greyed out and not selectable.
  @Field var disabled: Bool = false

  required init() {}
}
