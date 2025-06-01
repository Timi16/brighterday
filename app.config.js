import 'dotenv/config';

export default {
  expo: {
    name: "BrighterDay",
    slug: "brighterday",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/app-icon.png",
    scheme: "brighterday",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#FAFAFA"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.brighterday.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#FAFAFA"
      },
      package: "com.brighterday.app"
    },
    web: {
      bundler: "metro",
      favicon: "./assets/images/favicon.png"
    },
    extra: {
      // Securely access environment variables
      openaiApiKey: process.env.OPENAI_API_KEY,
      eas: {
        projectId: "your-project-id"
      }
    }
  }
};
