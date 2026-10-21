import ExpoModulesCore
import ExpoUI

extension UnderlineModifier {
  static func register() {
    ViewModifierRegistry.register("underline") { params, appContext, _ in
      try UnderlineModifier(from: params, appContext: appContext)
    }
  }
}
