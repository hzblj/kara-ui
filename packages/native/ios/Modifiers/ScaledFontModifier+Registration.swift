import ExpoModulesCore
import ExpoUI

extension ScaledFontModifier {
  static func register() {
    ViewModifierRegistry.register("scaledFont") { params, appContext, _ in
      try ScaledFontModifier(from: params, appContext: appContext)
    }
  }
}
