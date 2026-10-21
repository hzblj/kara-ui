import ExpoModulesCore
import ExpoUI

extension CounterBadgeModifier {
  static func register() {
    ViewModifierRegistry.register("counterBadge") { params, appContext, _ in
      try CounterBadgeModifier(from: params, appContext: appContext)
    }
  }
}
