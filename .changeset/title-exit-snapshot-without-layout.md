---
'@hzblj/kara-native': patch
'@hzblj/kara-ui': patch
---

`NavigationItemSubtitle` (iOS 26) plays the exit with the title as it was on screen. It no longer lays the bar out to take the exit's pictures: the stack has just cleared the bar items at that point, so the layout spread the title over the whole bar, the title left untruncated over the trailing items and the old items never faded out.
