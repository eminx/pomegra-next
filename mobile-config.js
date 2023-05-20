// This section sets up some basic app metadata, the entire section is optional.
App.info({
  id: 'com.mikroklima.librella.eminx',
  name: 'Librella',
  description: 'Read, lend, repeat',
  author: 'Emin Durak',
  email: 'emin@tuta.io',
  website: 'librella.app',
});

// Set up resources such as icons and launch screens.
App.icons({
  iphone_2x: 'private/assets/res/icons/ios/icon-60@2x.png',
  iphone_3x: 'private/assets/res/icons/ios/icon-60@3x.png',
  // More screen sizes and platforms...
});

// Before Meteor 2.6 we had to pass device specific splash screens for iOS, but this behavior was dropped in favor of story board images.
App.launchScreens({
  // iOS
  // For most cases you will only need to use the 'ios_universal' and 'ios_universal_3x'.
  ios_universal: {
    src: 'private/assets/res/screen/ios/Default@2x.png',
    srcDarkMode: 'private/assets/res/screen/ios/Default@2x~dark.png',
  }, // (2732x2732) - All @2x devices, if device/mode specific is not declared
  ios_universal_3x: 'private/assets/res/screen/ios/Default@3x.png', // (2208x2208) - All @3x devices, if device/mode specific is not declared

  // If you still want to use a universal splash, but want to fine-tune for the device mode (landscape, portrait), then use the following keys:
  // 'Default@2x~universal~comany': 'public/splash/Default@2x~universal~comany.png', // (1278x2732) - All @2x devices in portrait mode.
  // 'Default@2x~universal~comcom': 'public/splash/Default@2x~universal~comcom.png', // (1334x750) - All @2x devices in landscape (narrow) mode.
  // 'Default@3x~universal~anycom': 'public/splash/Default@3x~universal~anycom.png', // (2208x1242) - All @3x devices in landscape (wide) mode.
  // 'Default@3x~universal~comany': 'public/splash/Default@3x~universal~comany.png', // (1242x2208) - All @3x devices in portrait mode.

  // However, if you need to fine tune the splash screens for the device idiom (iPhone, iPad, etc).
  // 'Default@2x~iphone~anyany': 'public/splash/Default@2xiphoneanyany.png', // (1334x1334) - iPhone SE/6s/7/8/XR
  // 'Default@2x~iphone~comany': 'public/splash/Default@2xiphonecomany.png', // (750x1334) - iPhone SE/6s/7/8/XR - portrait mode
  // 'Default@2x~iphone~comcom': 'public/splash/Default@2xiphonecomcom.png', // (1334x750) - iPhone SE/6s/7/8/XR - landscape (narrow) mode
  // 'Default@3x~iphone~anyany': 'public/splash/Default@3x.png', // (2208x2208) - iPhone 6s Plus/7 Plus/8 Plus/X/XS/XS Max
  // 'Default@3x~iphone~anycom': {
  //   src: 'public/splash/Default@3xiphoneanycom.png',
  //   srcDarkMode: 'public/splash/Default@3xiphoneanycom~dark.png',
  // }, // (2208x1242) - iPhone 6s Plus/7 Plus/8 Plus/X/XS/XS Max - landscape (wide) mode
  // 'Default@3x~iphone~comany': 'Default@3xiphonecomany.png', // (1242x2208) - iPhone 6s Plus/7 Plus/8 Plus/X/XS/XS Max - portrait mode
  // 'Default@2x~ipad~anyany': 'Default@2xipadanyany.png', // (2732x2732) - iPad Pro 12.9"/11"/10.5"/9.7"/7.9"
  // 'Default@2x~ipad~comany': 'Default@2xipadcomany.png', // (1278x2732) - iPad Pro 12.9"/11"/10.5"/9.7"/7.9" - portrait mode

  // Android
  // android_mdpi_portrait: 'public/splash/android_mdpi_portrait.png', // (320x480)
  // android_mdpi_landscape: {
  //   src: 'public/splash/android_mdpi_landscape.png',
  //   srcDarkMode: 'public/splash/android_mdpi_landscape-night.png',
  // }, // (480x320)
  // android_hdpi_portrait: 'public/splash/android_hdpi_portrait.png', // (480x800)
  // android_hdpi_landscape: 'public/splash/android_hdpi_landscape.png', // (800x480)
  // android_xhdpi_portrait: 'public/splash/android_xhdpi_portrait.png', // (720x1280)
  // android_xhdpi_landscape: 'public/splash/android_xhdpi_landscape.png', // (1280x720)
  // android_xxhdpi_portrait: {
  //   src: 'public/splash/android_xxhdpi_portrait.png',
  //   srcDarkMode: 'public/splash/android_xxhdpi_portrait-night.png',
  // }, // (960x1600)
  // android_xxhdpi_landscape: 'public/splash/android_xxhdpi_landscape.png', // (1600x960)
  // android_xxxhdpi_portrait: 'public/splash/android_xxxhdpi_portrait.png', // (1280x1920)
  // android_xxxhdpi_landscape: 'public/splash/android_xxxhdpi_landscape.png', // (1920x1280)
});

// Set PhoneGap/Cordova preferences.
App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'default');
App.setPreference('Orientation', 'all', 'ios');

// Pass preferences for a particular PhoneGap/Cordova plugin.
// App.configurePlugin('com.phonegap.plugins.facebookconnect', {
//   APP_ID: '1234567890',
//   API_KEY: 'supersecretapikey',
// });

// Add custom tags for a particular PhoneGap/Cordova plugin to the end of the
// generated config.xml. 'Universal Links' is shown as an example here.
// App.appendToConfig(`
//     <universal-links>
//       <host name="localhost:3000" />
//     </universal-links>
//   `);
