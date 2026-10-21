import type {Meta, StoryObj} from '@storybook/react-native'

import {Box} from '../box'
import {Countdown} from './countdown'

const MINUTE_MS = 60_000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

/** Fixed when the story file loads, so switching stories does not restart the clock. */
const NOW = Date.now()

const meta = {
  args: {endsAt: NOW + 2 * DAY_MS + 5 * HOUR_MS + 9 * MINUTE_MS, variant: 'headingS'},
  argTypes: {
    color: {control: 'select', options: ['content.primary', 'content.accent', 'content.destructive']},
    variant: {control: 'select', options: ['body', 'headline', 'headingS', 'headingM', 'labelMedium']},
  },
  component: Countdown,
  parameters: {
    notes:
      'Ticks natively — no React render per second — and rolls a changed digit: a numeric content transition on iOS, ' +
      'a slide from above on Android. Days show only while there are some, hours only while one is left. The ' +
      'React Native tier: an invisible text of the same shape gives it its size, so it needs no host around it. ' +
      'Unit initials follow the locale unless `units` overrides them.',
  },
  render: args => (
    <Box align="flex-start" bg="surface.primary" borderRadius="medium" p="s16">
      <Countdown {...args} />
    </Box>
  ),
  title: 'Atoms/Countdown',
} satisfies Meta<typeof Countdown>

export default meta

type Story = StoryObj<typeof meta>

export const Days: Story = {}

export const LastHour: Story = {args: {endsAt: NOW + 42 * MINUTE_MS, variant: 'body'}}

export const CustomUnits: Story = {args: {units: [' days', ' hrs', ' min', ' sec'], variant: 'subheadline'}}
