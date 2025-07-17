import { StyledStack } from "@/components/navigation/stack";
import "@/global.css";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { LogBox, useColorScheme } from "react-native";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}
LogBox.ignoreLogs(["Clerk: Clerk has been loaded with development keys"]);

const InitialLayout = () => {
  return (
    <StyledStack
      contentClassName="bg-gray-100 dark:bg-dark"
      headerClassName="bg-dark text-white"
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="signin"
        options={{ title: "Amazon", presentation: "fullScreenModal" }}
      />
    </StyledStack>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <InitialLayout />
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
