import ExpoModulesCore
import UIKit

/// One colour of the swipe action appearance: `light` alone is used as is (a `PlatformColor` or `DynamicColorIOS` already
/// follows the appearance), both make a dynamic colour of them.
struct SwipeActionColorRecord: Record {
  @Field var light: UIColor?
  @Field var dark: UIColor?

  var dynamicColor: UIColor? {
    guard let light, let dark else {
      return light ?? dark
    }
    return UIColor { $0.userInterfaceStyle == .dark ? dark : light }
  }
}

/// What `configureSwipeActionAppearance` takes; a colour left out keeps the system's.
struct SwipeActionAppearanceRecord: Record {
  @Field var titleColor: SwipeActionColorRecord?
  @Field var iconColor: SwipeActionColorRecord?
  @Field var destructiveIconColor: SwipeActionColorRecord?
  @Field var destructiveBackgroundColor: SwipeActionColorRecord?
}
