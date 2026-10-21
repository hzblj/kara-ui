import type {Meta, StoryObj} from '@storybook/react-native'

import {insideIsland} from '../../story-decorators'
import {Badge} from './badge'

const meta = {
  args: {label: 'Badge'},
  argTypes: {
    tone: {control: 'select', options: ['neutral', 'accent', 'success', 'destructive']},
  },
  component: Badge,
  decorators: [insideIsland],
  title: 'Atoms/Badge',
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Neutral: Story = {}

export const Accent: Story = {args: {label: 'accent', tone: 'accent'}}

export const Success: Story = {args: {label: 'success', tone: 'success'}}

export const Destructive: Story = {args: {label: 'error', tone: 'destructive'}}
