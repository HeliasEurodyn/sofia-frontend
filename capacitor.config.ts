import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ed.sofia',
  appName: 'Ship In Time',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      androidScaleType: "CENTER_CROP",
      "splashImmersive": true,
      "backgroundColor": "#ffffff"
    }
  }
};

export default config;
