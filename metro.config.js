const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Expo SDK 54 / Node 24 uyumluluk düzeltmesi (PlatformConstants & node:sea önlemi)
config.resolver.unstable_enablePackageExports = false;

// NativeWind v4 ve Tailwind için metro entegrasyonu
module.exports = withNativeWind(config, { input: './global.css' });
