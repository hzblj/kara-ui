import {Tabs} from '@hzblj/kara-ui/router'

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen icon="home" name="(home)" title="Showcase" />
      <Tabs.Screen icon="grid" name="gallery" title="Gallery" />
    </Tabs>
  )
}
