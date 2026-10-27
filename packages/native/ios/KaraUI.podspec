require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'KaraUI'
  s.version        = package['version']
  s.summary        = 'Native views and @expo/ui modifiers behind @hzblj/kara-ui'
  s.description    = package['description']
  s.license        = package['license']
  s.author         = package['author']
  s.homepage       = 'https://github.com/hzblj/kara-ui'
  # The floor `ExpoUI` itself declares — the modifiers register into its registry.
  s.platforms      = { :ios => '16.4' }
  s.swift_version  = '5.9'
  s.source         = { git: 'https://github.com/hzblj/kara-ui.git' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.dependency 'ExpoUI'
  # A segment's image by URL, raster or SVG, as Footshop's platform-ui loads it.
  s.dependency 'SDWebImage'
  s.dependency 'SDWebImageSVGCoder'
  # The context menu hands a tapped preview's photo to the zoom transition as its source.
  s.dependency 'ExpoZoomTransition'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
