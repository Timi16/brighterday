// For Expo Go testing, we'll include the API key directly
// Remove this and use dotenv for production
const OPENAI_API_KEY = "";
export default {
  expo: {
    name: "BrighterDay",
    slug: "brighterday",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "brighterday",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/images/splash-icon.png",
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
      // Direct API key for Expo Go testing
      openaiApiKey: OPENAI_API_KEY,
      eas: {
        projectId: "your-project-id"
      }
    }
  }
};
