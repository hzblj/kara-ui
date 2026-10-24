import ExpoModulesCore
import ExpoUI

/**
 Registers kara's modifiers into `@expo/ui`'s `ViewModifierRegistry`: once per process, however many React runtimes
 create the module, one after another or at the same time.

 Every runtime (`RCTHost`) gets its own `AppContext`, which runs the module's `OnCreate` on that runtime's JavaScript
 thread, and a reload can start the next runtime while the previous one is still initialising (Expo says as much in
 `ExpoReactNativeFactory`): a dev client opened through its deep link while it launches, `Updates.reloadAsync` early in
 a launch, a brownfield app starting several hosts. The registry is one process-wide dictionary with no lock, and two
 `OnCreate`s writing it at once corrupted it (`EXC_BAD_ACCESS` in `Dictionary._Variant.setValue`, under
 `ViewModifierRegistry.register`). Even one at a time, each reload wrote it again from the new JavaScript thread while
 SwiftUI could be reading it on the main thread for the old runtime's views.

 A `static let` is initialised exactly once (`swift_once`), and a caller arriving while it runs waits for it to finish,
 so the first runtime registers and every later one finds the modifiers in place. Register a modifier here, never
 straight from `OnCreate`.

 Nothing is unregistered in `OnDestroy`. A factory holds no state (each call is handed the view's own `AppContext`), so
 one registration serves every runtime; removing it when one runtime goes would take it from another still drawing,
 and the removal would race SwiftUI's reads all the same.
 */
enum ModifierRegistration {
  private static let installation: Void = {
    ViewModifierRegistry.register("counterBadge") { params, appContext, _ in
      try CounterBadgeModifier(from: params, appContext: appContext)
    }
    ViewModifierRegistry.register("scaledFont") { params, appContext, _ in
      try ScaledFontModifier(from: params, appContext: appContext)
    }
    ViewModifierRegistry.register("underline") { params, appContext, _ in
      try UnderlineModifier(from: params, appContext: appContext)
    }
  }()

  static func install() {
    _ = installation
  }
}
