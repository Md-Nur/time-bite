export default ({ config }) => {
  return {
    ...config,
    name: "time-bite",
    slug: "time-bite",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "timebite",
    userInterfaceStyle: "automatic",
    splash: {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.nur-manik.timebite",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/icon.png",
        backgroundImage: "./assets/images/icon.png",
        monochromeImage: "./assets/images/icon.png"
      },
      predictiveBackGestureEnabled: false,
      package: "com.nur_manik.timebite",
      versionCode: 3
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: (process.env.EXPO_PUBLIC_AD_APP_ID_ANDROID || "ca-app-pub-4099234210747390~4934621962").trim(),
          iosAppId: (process.env.EXPO_PUBLIC_AD_APP_ID_IOS || "ca-app-pub-4099234210747390~4934621962").trim()
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      ...config.extra,
      router: {},
      eas: {
        projectId: "8e3db260-6415-4c19-9749-511853106db2"
      }
    }
  };
};
