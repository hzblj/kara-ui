import {Tabs} from '@hzblj/kara-ui/router'

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen icon="home" name="(home)" selectedIcon="home-filled" title="Home" />
      <Tabs.Screen icon="widgets" name="components" selectedIcon="widgets-filled" title="Components" />
      <Tabs.Screen icon="palette" name="design" selectedIcon="palette-filled" title="Design" />
    </Tabs>
  )
}
