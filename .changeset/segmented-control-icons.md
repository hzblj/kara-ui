---
'@hzblj/kara-native': minor
---

`SegmentedControl` options take an `icon` URL (PNG, SVG…): the segment shows the image instead of its label, which stays the accessibility label. iOS loads it natively through SDWebImage, from the cache `expo-image` shares, so a remote carrier or brand logo needs no JS round trip; the segment falls back to the label if the image cannot be loaded.
