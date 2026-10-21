import type {ReactNode} from 'react'

import type {IconProps} from '../icon'

/** The same contract as `Icon`, for the React Native tier — anywhere, no `Screen` or `Island` needed. */
export type RnIconProps = IconProps

export type RnIconComponent = (props: RnIconProps) => ReactNode
