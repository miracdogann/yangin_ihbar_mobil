// app/start.tsx
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Start() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        YİSİ App'e Hoş Geldin!
      </Text>
      <Button title="Devam Et" onPress={() => router.navigate("/(tabs)/Map")} />
      <Button
        title=" giriş yap"
        onPress={() => router.navigate("/auth/Login")}
      />
      <Button
        title="Kayıt ol"
        onPress={() => router.navigate("/auth/Register")}
      />

      {/* veya giriş ekranına yönlendirme:
      onPress={() => router.replace('/auth/login')} */}
    </View>
  );
}
