import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hinksonhosting.digitalchessboard',
  appName: 'Digital Chessboard',
  webDir: 'dist',
  android: {
    allowMixedContent: true
  },
  server: {
    cleartext: true,
    hostname: "localhost",
    androidScheme: 'https'
  }
};

export default config;
