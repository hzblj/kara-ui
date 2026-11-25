import {useHeaderBarInset} from './use-header-bar-inset'

/** A stacked search bar: the 44pt field and 10pt of padding, which scroll away in turn. */
const STACKED_SEARCH_BAR_HEIGHT = 54

export const useSearchHeaderInset = () => useHeaderBarInset() + STACKED_SEARCH_BAR_HEIGHT
