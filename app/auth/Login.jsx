// Login.jsx
import logo from "@/assets/images/fullLogo.png";
import { useUser } from "@/contexts/userContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "../../services/api";

const Login = () => {
  const [secure, setSecure] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(""); // formatlı
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { refreshUser } = useUser();
  const router = useRouter();

  const goRegisterPage = () => {
    router.push("/auth/Register");
  };

  // 📌 Telefon numarasını formatlayan fonksiyon
  const formatPhoneNumber = (text) => {
    // Rakam olmayan karakterleri sil
    let digits = text.replace(/\D/g, "");

    // İlk rakam her zaman 0 olacak
    if (!digits.startsWith("0")) {
      digits = "0" + digits;
    }

    // Sadece 11 hanelik rakama izin ver
    digits = digits.slice(0, 11);

    // Görsel format: 0(5xx) xxx xx xx
    if (digits.length <= 1) return digits;
    if (digits.length <= 4) return digits[0] + "(" + digits.slice(1);
    if (digits.length <= 7)
      return digits[0] + "(" + digits.slice(1, 4) + ") " + digits.slice(4);
    if (digits.length <= 9)
      return (
        digits[0] +
        "(" +
        digits.slice(1, 4) +
        ") " +
        digits.slice(4, 7) +
        " " +
        digits.slice(7)
      );
    return (
      digits[0] +
      "(" +
      digits.slice(1, 4) +
      ") " +
      digits.slice(4, 7) +
      " " +
      digits.slice(7, 9) +
      " " +
      digits.slice(9)
    );
  };

  // 📌 Input değiştiğinde format uygula
  const handlePhoneChange = (text) => {
    let digits = text.replace(/\D/g, "");

    // İlk rakam 0 sabit
    if (!digits.startsWith("0")) {
      digits = "0" + digits;
    }

    // 2. rakam sabit 5 olacak
    if (digits.length >= 2 && digits[1] !== "5") {
      digits = digits[0] + "5" + digits.slice(2);
    }

    setPhoneNumber(formatPhoneNumber(digits));
  };

  const handleLoginSuccess = async (token) => {
    await AsyncStorage.setItem("userToken", token);
    await refreshUser();
    router.replace("/(tabs)/Map");
  };

  const login = async () => {
    if (!phoneNumber.trim() || !password) {
      Toast.show({
        type: "error",
        text1: "Telefon numarası ve şifre zorunludur. ",
        text2: "Telefon numararsı ve şifre giriniz !",
        position: "top",
      });
      return;
    }

    // 📌 API’ye gönderilecek format (sadece rakamlar)
    const cleanPhone = phoneNumber.replace(/\D/g, "");

    if (cleanPhone.length !== 11) {
      Toast.show({
        type: "error",
        text1: "Telefon numarası 11 haneli olmalıdır.",
        text2: "",
      });
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
          phone_number: cleanPhone, // 05055555555 formatı
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Toast.show({
          type: "success",
          text1: "Giriş Başarılı",
          text2: "Yangın İhbar Sistemine Hoş Geldiniz 👋",
          position: "top",
        });
        handleLoginSuccess(data.token);
      } else {
        Toast.show({
          type: "error",
          text1: "Başarısız Giriş!",
          text2: data.error,
          position: "top",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Sunucuya bağlanırken hata oluştu.",
        text2: "",
      });
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
                placeholder="0(5xx) xxx xx xx"
                outlineColor="grey"
                activeOutlineColor="blue"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={handlePhoneChange}
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
