---
'@hzblj/kara-native': patch
'@hzblj/kara-ui': patch
---

Fixed a crash at launch on iOS when two React runtimes start at the same time, as when a dev client is opened through its deep link while it launches, or the app reloads during startup. Each runtime registered kara's native modifiers into `@expo/ui`'s shared registry, and two registering at once corrupted it. On both platforms the modifiers are now registered once per process, whichever runtime comes first, and a reload no longer registers them again. On Android, a runtime that goes away no longer unregisters `underline` and the accessibility modifier while another runtime still uses them. Rebuild the native app.
