import ExpoModulesCore

/**
 Marks a region of a `ContextMenuView` trigger that must not open the menu — a button
 inside a card, say. The interaction sits on the whole trigger, so without this a long
 press on that button opens the card's menu; `ContextMenuView` hit-tests the press and
 returns no configuration when it lands inside one of these.
 */
public final class ContextMenuExclusionView: ExpoView {}
