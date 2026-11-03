---
'@hzblj/kara-native': patch
'@hzblj/kara-ui': patch
---

`ScrollEdgeContainer` (iOS) syncs the top inset natively whenever a new scroll child mounts, not only when the top bar's height changes. A list mounted from a bar height measured before the bar got its safe area no longer sits about the header's height too high for a moment and jumps when JS catches up (a screen pushed over a busy one).
