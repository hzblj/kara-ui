package expo.modules.kara.ui.modifiers

/**
 * Registers kara's modifiers into `@expo/ui`'s `ModifierRegistry`: once per process, however many React runtimes
 * create the module, one after another or at the same time.
 *
 * Every runtime gets its own `AppContext`, which runs the module's `OnCreate`, and a reload or a second host can start
 * a runtime while another is alive or still starting. The registry is one process-wide `mutableMapOf` with no lock, so
 * two runtimes registering at once could corrupt it (on iOS, where `@expo/ui`'s registry is the same, it crashed). A
 * `SYNCHRONIZED` lazy runs its initializer exactly once, and a caller arriving while it runs waits for it to finish, so
 * the first runtime registers and every later one finds the modifiers in place. Register a modifier here, never
 * straight from `OnCreate`.
 *
 * Nothing is unregistered in `OnDestroy`. A factory holds no state (each call is handed the view's own `AppContext`),
 * so one registration serves every runtime; removing it when one runtime goes would take it from another still drawing
 * (a reload's new runtime too, when the old one is torn down after it has started), and the removal would race Compose
 * reading the registry on the main thread.
 */
internal object ModifierRegistration {
  private val installation by lazy(LazyThreadSafetyMode.SYNCHRONIZED) {
    registerAccessibilityModifier()
    registerUnderlineModifier()
  }

  fun install(): Unit = installation
}
