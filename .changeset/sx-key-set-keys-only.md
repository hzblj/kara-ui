---
"@hzblj/kara-ui": patch
"@hzblj/kara-sx": patch
---

`sx` costs less on every render. The style cache, the responsive flattening and the key behind `useSxModifiers` used to go through every key the surface has, about seventy for a `Box`, even when a component set two or three of them. Now they go through only the props that are set, and the theme's part of the cache key is worked out once per theme rather than on every render. Without a JIT, as on Hermes, an `sx()` view resolves its style 2.5–5× faster and a native atom 2–4.5× faster.
