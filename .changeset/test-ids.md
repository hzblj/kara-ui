---
'@hzblj/kara-components': minor
'@hzblj/kara-ui': minor
---

`testID` works on both platforms, so Maestro and other end-to-end tests can find a control by it: the accessibility identifier on iOS, the Compose test tag (exposed as the resource id) on Android. `Switch`, `Checkbox`, `Slider`, `Stepper`, `RadioGroup`, `Menu`, `Collapsible`, `Progress` and `Badge` take it for the first time, and `TextField`, `IconButton`, `Fab`, `Divider` and `List`, which only forwarded it on iOS, now tag their Compose views too. It lands on the control a test taps or reads rather than on a row around it: the switch or the box beside its label, the field below its label, a `Menu`'s trigger, a `Stepper`'s buttons and value, a `Collapsible`'s row.
