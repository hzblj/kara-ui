import type {Meta, StoryObj} from '@storybook/react-native'
import {useRef} from 'react'
import {fn} from 'storybook/test'

import {insideIsland} from '../../utils/story-decorators'
import {VStack} from '../v-stack'
import {TextField} from './text-field'
import type {TextFieldRef} from './text-field.types'

const meta = {
  args: {label: 'Display name', onChangeText: fn()},
  component: TextField,
  decorators: [insideIsland],
  parameters: {
    notes:
      'Uncontrolled on purpose: it seeds from `defaultValue` and reports through `onChangeText`, so neither platform has to round-trip every keystroke through JS.',
  },
  title: 'Atoms/TextField',
} satisfies Meta<typeof TextField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Prefilled: Story = {args: {defaultValue: 'Jan'}}

export const Placeholder: Story = {args: {label: 'Display name', placeholder: 'As others will see it'}}

export const Email: Story = {
  args: {contentType: 'emailAddress', keyboard: 'email', label: 'Email', placeholder: 'name@example.com'},
  parameters: {
    notes:
      'The `email` keyboard turns capitals and corrections off by itself. `contentType` offers the address to fill ' +
      'in: iOS AutoFill, and an autofill hint on Android that an autofill service (Google, a password manager) answers.',
  },
}

export const Secure: Story = {args: {label: 'Password', secure: true}}

export const Password: Story = {
  args: {contentType: 'password', label: 'Password', secure: true, submitLabel: 'done'},
  parameters: {
    notes:
      'With `contentType="password"` iOS offers the keychain above the keyboard. On Android a `secure` field brings up ' +
      'the password keyboard, which suggests and learns nothing, and the hint lets an autofill service fill it.',
  },
}

export const OneTimeCode: Story = {
  args: {contentType: 'oneTimeCode', keyboard: 'number', label: 'Verification code', maxLength: 6},
  parameters: {
    notes:
      '`maxLength` cuts what is typed past six digits. iOS offers the code from a text message above its number pad, ' +
      'which has no return key: a `number`, `decimal` or `phone` field there never calls `onSubmit`.',
  },
}

export const Submit: Story = {
  args: {
    autoCapitalize: 'sentences',
    label: 'Message',
    onFocusChange: fn(),
    onSubmit: fn(),
    placeholder: 'Say something nice',
    submitLabel: 'send',
  },
  parameters: {
    notes:
      'The return key reads Send and calls `onSubmit` with the text. Unset, `autoCapitalize` is the platform’s own ' +
      '(sentences on iOS, none on Android); here both start a sentence with a capital.',
  },
}

const SignIn = () => {
  const password = useRef<TextFieldRef>(null)

  return (
    <VStack spacing="s12" wide>
      <TextField
        autoFocus
        contentType="username"
        keyboard="email"
        label="Email"
        onSubmit={() => password.current?.focus()}
        placeholder="name@example.com"
        submitLabel="next"
      />
      <TextField contentType="password" label="Password" ref={password} secure submitLabel="done" />
    </VStack>
  )
}

export const NextField: Story = {
  parameters: {
    notes:
      'The email field takes focus as it appears, and its Next focuses the password through a `ref`. Android’s `next` ' +
      'also moves focus by itself to the next field in the same host; on iOS it is `onSubmit` that moves it.',
  },
  render: () => <SignIn />,
}

export const Multiline: Story = {args: {label: 'Notes', multiline: true}}

export const WithError: Story = {args: {defaultValue: '110', error: 'A postcode has five digits.', label: 'Postcode'}}

export const Disabled: Story = {args: {disabled: true, label: 'Disabled'}}

export const AllStates: Story = {
  render: () => (
    <VStack spacing="s12" wide>
      <TextField label="Label" />
      <TextField label="Placeholder" placeholder="Shown while empty" />
      <TextField label="Secure" secure />
      <TextField defaultValue="110" error="A postcode has five digits." label="Postcode" />
      <TextField disabled label="Disabled" />
    </VStack>
  ),
}
