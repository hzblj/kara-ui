import type {Meta, StoryObj} from '@storybook/react-native'

import {VStack} from '../../atoms/v-stack'
import {insideIsland} from '../../story-decorators'
import {Link} from './link'

const meta = {
  args: {label: 'expo.dev', url: 'https://expo.dev'},
  argTypes: {icon: {control: 'select', options: ['info', 'share', 'arrowRight']}},
  component: Link,
  decorators: [insideIsland],
  parameters: {
    notes:
      'Opens an external URL in the platform browser, or in whichever app claims the scheme. For in-app navigation use the router, not this.',
  },
  title: 'Molecules/Link',
} satisfies Meta<typeof Link>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithIcon: Story = {args: {icon: 'info', label: 'With icon'}}

export const Both: Story = {
  render: () => (
    <VStack bg="surface.primary" borderRadius="medium" p="s12" spacing="s8" wide>
      <Link label="expo.dev" url="https://expo.dev" />
      <Link icon="info" label="With icon" url="https://expo.dev" />
    </VStack>
  ),
}
