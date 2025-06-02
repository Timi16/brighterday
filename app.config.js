// For Expo Go testing, we'll include API keys directly
// Remove this and use dotenv for production
const OPENAI_API_KEY = "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";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpubHJxenFoeWpzeGpiaHVzcWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MDEyNDksImV4cCI6MjA2NDM3NzI0OX0.8hkqsuL4oVmimexVQGm14VSDC3YwSjH_V26FN3KKnHA";

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
      // Direct API keys for Expo Go testing
      openaiApiKey: OPENAI_API_KEY,
      supabaseKey: SUPABASE_KEY,
      eas: {
        projectId: "your-project-id"
      }
    }
  }
};
