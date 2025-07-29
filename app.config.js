const { version } = require("react");

module.exports = ({ config }) => {
  const plugins = config.plugins || [];

  return {
    ...config,
    name: "eventura",
    slug: "eventura",
    scheme: "acme",
    userInterfaceStyle: "automatic",
    orientation: "default",
    web: {
      output: "static",
    },
    plugins: [
      [
        "expo-router",
        {
          origin: "https://n",
        },
      ],
      ...plugins,
    ],
    extra: {
      EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN:
        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      EXPO_PUBLIC_FIREBASE_PROJECT_ID:
        process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET:
        process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
        process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID:
        process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,

      eas: {
        projectId: "3aa5679f-bcde-48b9-b88f-ccd5b4a5afc5",
      },
    },
    cli: {
      appVersionSource: "remote"
    },
    android: {
      package: "com.eventura.app",
      versionCode: 1,
    },
  };
};
