import {Tabs} from '@hzblj/kara-ui/router'

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen icon="home" name="(home)" selectedIcon="home-filled" title="Showcase" />
      <Tabs.Screen icon="grid" name="gallery" selectedIcon="grid-filled" title="Gallery" />
    </Tabs>
  )
}
