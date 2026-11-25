---
'@hzblj/kara-native': minor
'@hzblj/kara-components': minor
'@hzblj/kara-ui': minor
---

Content under a native header can follow the bar natively, in the same frame. `HeaderAnchor` (`/header`, over the new `NavigationBarAnchor` in kara-native) keeps native controls such as segments right under the header while its search field opens and closes. `ScrollEdgeContainer`'s new `headerInset` adds the header to the top bar and the list's inset exactly, so a list running under the header no longer jitters or stalls while the bar changes height. `useSearchHeaderInset()` gives the expanded header's height for `initialTopBarHeight`.

Fixes on iOS: a `ScrollEdgeContainer` sets up a scroll view remounted under the same `key` again, so the header no longer keeps following the removed one; the top bar's height reaches the edge effect natively as soon as the bar is laid out; with `headerInset` the hard top edge no longer leaves a thin line under the bar while nothing scrolls under it. The header search brings back only the magnifier it faded out itself, so a stacked search scrolled away no longer shows its magnifier over the bar after the screen comes back from a push or a tab switch.
