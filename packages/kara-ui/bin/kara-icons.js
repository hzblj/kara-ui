#!/usr/bin/env node
// `npx kara-icons <source>`: validates an icon folder and writes its type declaration. Lives in @hzblj/expo-native-icons
// (its own bin is `native-icons`); kara-ui keeps a bin of its own so an app that installs only kara-ui can run it.
process.exitCode = require('@hzblj/expo-native-icons/cli').main(process.argv.slice(2), 'kara-icons')
