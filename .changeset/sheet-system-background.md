---
'@hzblj/kara-components': minor
'@hzblj/kara-ui': minor
---

`Sheet` takes `systemBackground`: on iOS the sheet keeps the system's own background instead of `bg`, which is untinted Liquid Glass on iOS 26 and a material blur before it. Use it for a sheet that floats over content it should let through, such as a map. Android keeps `bg`.
