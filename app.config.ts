// app.config.ts
import "dotenv/config";
import type { ExpoConfig } from "expo/config";

export default ({ config }: { config: ExpoConfig }): ExpoConfig => ({
  ...config,
  name: config.name ?? "digbiz-app",
  slug: config.slug ?? "digbiz-app",
  scheme: "digbizapp",
  plugins: [...(config.plugins ?? []), "expo-router"],
  extra: {
    ...config.extra,
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },
    authRedirectScheme: "digbizapp",
    google: {
      clientId: process.env.GOOGLE_WEB_CLIENT_ID as string, // <-- set this in .env
    },
  },
});
