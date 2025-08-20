import AutoScrollingLogos from "@/components/AutoScrollingLogos";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function Start() {
  const router = useRouter();

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      console.log("token var", token);
      router.push("/(tabs)/Map");
    } else {
      console.log("token yok");
      router.navigate("/auth/Login");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Logo üstte */}
        <Image
          source={require("../assets/logos/FullLogoOrg.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Orta metin */}
        <View style={styles.middleContainer}>
          <Text style={styles.subtitle}>
            Yangını erken bildir, felaketi önle!
          </Text>
        </View>

        {/* Buton altta */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={checkLoginStatus}
        >
          <Text style={styles.buttonText}>Başla</Text>
        </TouchableOpacity>
        <AutoScrollingLogos />

        {/* Footer */}
        <Text style={styles.footer}>© 2025 Tüm Hakları Saklıdır</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    // Logo en üstte, text ortada, buton en altta için flex düzeni:
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: width * 0.7,
    height: width * 0.7,
    marginTop: 10,
  },
  middleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#444",
    textAlign: "center",
    fontWeight: "500",
  },
  button: {
    width: width * 0.7,
    backgroundColor: "#0033FF",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 100,
    shadowColor: "#0033FF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 5,
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    width: "100%",
  },
});
