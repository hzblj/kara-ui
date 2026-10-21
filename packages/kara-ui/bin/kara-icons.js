#!/usr/bin/env node
// `npx kara-icons <source>` — validates an icon folder and writes its type declaration. Lives in @hzblj/kara-expo-plugin.
process.exitCode = require('@hzblj/kara-expo-plugin/cli').main(process.argv.slice(2))
