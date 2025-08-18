import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

import { useColorScheme } from "@/hooks/useColorScheme";
import { UserProvider } from "../contexts/userContext";
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <UserProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right", // iOS ve Android için sağdan kayma animasyonu
            contentStyle: {
              backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
            }, // arka plan rengi
          }}
        >
          <Stack.Screen name="Start" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth/Login" />
          <Stack.Screen name="auth/Register" />
          <Stack.Screen name="report/FireAlarm" />
        </Stack>
        <Toast />
      </UserProvider>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
