import ExpoModulesCore
import UIKit

/**
 Hosts the React Native preview content for `ContextMenuView`. Rendered out of the
 normal flow (absolute, hidden) so it never affects the trigger's layout;
 `ContextMenuView` snapshots it when it builds the context-menu preview.
 */
public final class ContextMenuPreviewView: ExpoView {
  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    isHidden = true
    isUserInteractionEnabled = false
  }
}
