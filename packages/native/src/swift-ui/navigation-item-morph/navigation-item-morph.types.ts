import type {ColorValue} from 'react-native'

export type NavigationItemMorphProps = {
  /** Shows the icon in a circle instead of the label. Changing it plays the morph. */
  collapsed: boolean
  /** The icon's asset-catalog name, drawn as a template in `itemColor`. */
  imageName: string
  /** The label's and the icon's colour. The system's label colour by default. */
  itemColor?: ColorValue
  /** The `identifier` of the right bar item to take over, the header action's `testID`. */
  itemIdentifier: string
  /** The item's text while it is not collapsed. */
  label: string
}
