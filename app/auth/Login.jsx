import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../../services/api";
import logo from "@/assets/images/fullLogo.png";
import { useUser } from "@/contexts/userContext";
import Toast from "react-native-toast-message";

const Login = () => {
  const [secure, setSecure] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { refreshUser } = useUser();

  const router = useRouter();

  const goRegisterPage = () => {
    router.push("/auth/Register");
  };

  const handleLoginSuccess = async (token) => {
    await AsyncStorage.setItem("userToken", token);
    await refreshUser();
    router.replace("/(tabs)/Map");
  };

  const login = async () => {
    if (!phoneNumber.trim() || !password) {
      Alert.alert("Hata", "Telefon numarası ve şifre zorunludur.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: phoneNumber.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Başarılı login
        console.log("Giriş başarılı:", data);
        Toast.show({
          type: "success",
          text1: "Giriş Başarılı",
          text2: "Yangın İhbar Sistemine Hoş Geldiniz 👋",
          position: "top",
        });
        const token = data.token;
        handleLoginSuccess(token);
      } else {
        // Hata mesajı varsa göster
        Toast.show({
          type: "error",
          text1: " Başarısız Giriş !",
          text2: data.error,
          position: "top",
        });
      }
    } catch (error) {
      Alert.alert("Hata", "Sunucuya bağlanırken hata oluştu.");
      console.error("Fetch hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.innerContainer}>
            <Image source={logo} style={styles.logo} />

            <Text style={styles.infoText}>Hemen Giriş Yapın !</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefon Numarası</Text>
              <TextInput
                mode="outlined"
                style={styles.textInput}
                placeholder="(555) 123 45 67"
                outlineColor="grey"
                activeOutlineColor="blue"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Şifre</Text>
              <TextInput
                mode="outlined"
                style={styles.textInput}
                placeholder="Şifre girin"
                outlineColor="grey"
                activeOutlineColor="blue"
                secureTextEntry={secure}
                right={
                  <TextInput.Icon
                    icon={secure ? "eye-off" : "eye"}
                    onPress={() => setSecure(!secure)}
                  />
                }
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <Button
              mode="contained"
              buttonColor="blue"
              rippleColor="white"
              style={styles.loginButton}
              labelStyle={styles.loginButtonText}
              loading={loading}
              disabled={loading}
              onPress={login}
            >
              Giriş Yap
            </Button>

            <View style={styles.registerContainer}>
              <Text style={styles.bottomInfoText}>Hesabın Yok Mu ?</Text>
              <TouchableOpacity onPress={goRegisterPage}>
                <Text style={styles.registerText}> Kayıt Ol</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: "white",
  },
  innerContainer: {
    alignItems: "center",
  },
  logo: {
    width: "80%",
    height: 270,
    resizeMode: "contain",
    marginBottom: 20,
  },
  infoText: {
    color: "grey",
    fontSize: 14,
    marginBottom: 30,
  },
  inputGroup: {
    width: "80%",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: "white",
  },
  loginButton: {
    width: "80%",
    height: 50,
    borderRadius: 8,
    marginTop: 20,
    justifyContent: "center",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: "row",
    marginTop: 30,
  },
  bottomInfoText: {
    color: "grey",
  },
  registerText: {
    color: "blue",
  },
});
