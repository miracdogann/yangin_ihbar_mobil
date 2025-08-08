// app/start.tsx
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

export default function Start() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../assets/images/fullLogo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Alt başlık */}
      <Text style={styles.subtitle}>Yangını erken bildir, felaketi önle!</Text>

      {/* Başla Butonu */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/Map")}
      >
        <Text style={styles.buttonText}>Başla</Text>
      </TouchableOpacity>
      <Button
        title=" giriş yap"
        onPress={() => router.navigate("/auth/Login")}
      />
      <Button
        title="Kayıt ol"
        onPress={() => router.navigate("/auth/Register")}
      />

      {/* Footer metni */}
      <Text style={styles.footer}>Tüm Hakları Saklıdır</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 350,
    height: 350,
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "monospace", // isteğe göre değiştirilebilir
    color: "#333",
    marginBottom: 40,
  },
  button: {
    width: 250,
    backgroundColor: "#0033FF",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginBottom: 60,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    fontSize: 12,
    color: "#999",
  },
});
