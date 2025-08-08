import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="Start" options={{ headerShown: false }} />

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Tek tek auth sayfalarını belirtip header'ı kapat */}
        <Stack.Screen name="auth/Login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/Register" options={{ headerShown: false }} />
        <Stack.Screen name="NotFound" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
