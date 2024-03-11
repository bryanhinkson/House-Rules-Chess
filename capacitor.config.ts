import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hinksonhosting.chess',
  appName: 'House Rules Chess',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
