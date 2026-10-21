import {Button, Divider, EmptyState, Island, Label, LabeledContent, Link, Switch, VStack} from '@hzblj/kara-ui'

export const LabelSection = () => (
  <Island>
    <VStack bg="surface.primary" borderRadius="medium" p="s12" spacing="s8" wide>
      <Label icon="home" title="Default body" />
      <Label color="content.accent" icon="star" title="Accent" variant="labelMedium" />
      <Label color="content.destructive" icon="trash" title="Destructive" variant="footnoteMedium" />
      <Label icon="settings" iconSize="s16" title="Small icon" variant="footnote" />
    </VStack>
  </Island>
)

export const LabeledContentSection = () => (
  <Island>
    <VStack bg="surface.primary" borderRadius="medium" px="s12" wide>
      <LabeledContent label="Version" value="0.0.1" />
      <Divider />
      <LabeledContent icon="notification" label="Notifications" value="On" />
      <Divider />
      <LabeledContent label="Account" onPress={() => undefined} value="jan@example.com" />
      <Divider />
      <LabeledContent label="Analytics">
        <Switch value onValueChange={() => undefined} />
      </LabeledContent>
    </VStack>
  </Island>
)

export const LinkSection = () => (
  <Island>
    <VStack bg="surface.primary" borderRadius="medium" p="s12" spacing="s8" wide>
      <Link label="expo.dev" url="https://expo.dev" />
      <Link icon="info" label="With icon" url="https://expo.dev" />
    </VStack>
  </Island>
)

export const EmptyStateSection = () => (
  <Island>
    <VStack bg="surface.primary" borderRadius="medium" wide>
      <EmptyState
        action={<Button label="Clear filters" variant="secondary" />}
        description="Try a different query or clear the filters you have applied."
        icon="search"
        title="No results"
      />
    </VStack>
  </Island>
)
