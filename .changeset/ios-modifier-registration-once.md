---
'@hzblj/kara-native': patch
'@hzblj/kara-ui': patch
---

Fixed a crash at launch on iOS when two React runtimes start at the same time, as when a dev client is opened through its deep link while it launches, or the app reloads during startup. Each runtime registered kara's SwiftUI modifiers into `@expo/ui`'s shared registry, and two registering at once corrupted it. They are now registered once per process, whichever runtime comes first, and a reload no longer registers them again. Rebuild the native app.
