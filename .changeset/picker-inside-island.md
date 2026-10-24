---
"@hzblj/kara-components": patch
"@hzblj/kara-ui": patch
---

`Picker` works inside a `Screen` or `Island`, next to other native views. It brought a host of its own even there, and a host nested in another one broke the island around it: on Android the nested host took the island's whole width, so the views beside the picker disappeared (a multiline `TextField` was measured a letter wide and pushed the island far past the screen), and on iOS the wheel got no height and spilled over them. Inside a host the picker now renders into that host; on its own it still brings one.
