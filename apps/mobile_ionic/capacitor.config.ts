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
      'https://maps.google.com',
      'https://wa.me'
    ]
  }
};

export default config;
