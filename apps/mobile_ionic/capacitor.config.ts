import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rinomed.app',
  appName: 'RINOMED 2026',
  webDir: 'www',
  server: {
    cleartext: false,
    allowNavigation: [
      'https://api.rinomed2026.com',
      'https://rinomed2026.com',
      'https://adminweb-production-d7b5.up.railway.app',
      'https://maps.google.com',
      'https://wa.me'
    ]
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0F0F12",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false
    },
    StatusBar: {
      style: "DARK"
    }
  }
};

export default config;
