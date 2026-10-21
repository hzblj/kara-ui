import ExpoModulesCore

/// A single action rendered inside the UIKit context menu.
internal final class ContextMenuActionRecord: Record {
  @Field var id: String = ""
  @Field var title: String = ""
  @Field var systemImage: String?
  @Field var destructive: Bool = false

  required init() {}
}
