import logo from "@/assets/images/fullLogo.png";
import { useUser } from "@/contexts/userContext";
import { secureLogin } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
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

const Login = () => {
  const [secure, setSecure] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(""); // formatlı
  const [rawPhoneNumber, setRawPhoneNumber] = useState(""); // ham rakamlar
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const phoneInputRef = useRef(null);

  const { refreshUser, updateActivity } = useUser();
  const router = useRouter();

  // Login attempt tracking
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 dakika

  const goRegisterPage = () => {
    router.push("/auth/Register");
  };

  // Güvenlik kontrolleri
  const checkLoginSecurity = async () => {
    try {
      const lastFailedAttempt = await AsyncStorage.getItem("lastFailedLogin");
      const attempts = await AsyncStorage.getItem("loginAttempts");
      
      if (lastFailedAttempt && attempts) {
        const timeSinceLastAttempt = Date.now() - parseInt(lastFailedAttempt);
        const attemptCount = parseInt(attempts);
        
        if (attemptCount >= MAX_LOGIN_ATTEMPTS && timeSinceLastAttempt < LOCKOUT_DURATION) {
          const remainingTime = Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 60000);
          Toast.show({
            type: "error",
            text1: "Çok fazla başarısız deneme",
            text2: `${remainingTime} dakika sonra tekrar deneyin`,
            position: "top",
          });
          return false;
        }
        
        // Lockout süresi geçmişse sıfırla
        if (timeSinceLastAttempt >= LOCKOUT_DURATION) {
          await AsyncStorage.multiRemove(["loginAttempts", "lastFailedLogin"]);
          setLoginAttempts(0);
        }
      }
      
      return true;
    } catch (error) {
      console.error("Login security check error:", error);
      return true;
    }
  };

  const recordFailedAttempt = async () => {
    try {
      const currentAttempts = loginAttempts + 1;
      setLoginAttempts(currentAttempts);
      
      await AsyncStorage.setItem("loginAttempts", currentAttempts.toString());
      await AsyncStorage.setItem("lastFailedLogin", Date.now().toString());
      
      if (currentAttempts >= MAX_LOGIN_ATTEMPTS) {
        Toast.show({
          type: "error",
          text1: "Hesabınız geçici olarak kilitlendi",
          text2: "15 dakika sonra tekrar deneyin",
          position: "top",
        });
      }
    } catch (error) {
      console.error("Failed attempt recording error:", error);
    }
  };

  const clearFailedAttempts = async () => {
    try {
      await AsyncStorage.multiRemove(["loginAttempts", "lastFailedLogin"]);
      setLoginAttempts(0);
    } catch (error) {
      console.error("Clear failed attempts error:", error);
    }
  };

  // 📌 Telefon numarasını formatlayan fonksiyon
  const formatPhoneNumber = (digits) => {
    // Rakam olmayan karakterleri sil
    digits = digits.replace(/\D/g, "");

    // İlk rakam her zaman 0 olacak
    if (!digits.startsWith("0")) {
      digits = "0" + digits;
    }

    // İkinci rakam her zaman 5 olacak
    if (digits.length >= 2 && digits[1] !== "5") {
      digits = digits[0] + "5" + digits.slice(2);
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
    // Rakam olmayan karakterleri çıkararak ham veriyi al
    let digits = text.replace(/\D/g, "");

    // İlk rakam 0 sabit
    if (!digits.startsWith("0")) {
      digits = "0" + digits;
    }

    // İkinci rakam sabit 5 olacak
    if (digits.length >= 2 && digits[1] !== "5") {
      digits = digits[0] + "5" + digits.slice(2);
    }

    // 11 haneli sınırı uygula
    digits = digits.slice(0, 11);

    // Ham ve formatlanmış veriyi güncelle
    setRawPhoneNumber(digits);
    setPhoneNumber(formatPhoneNumber(digits));
  };

  const handleLoginSuccess = async (token) => {
    try {
      // Başarılı login sonrası güvenlik temizliği
      await clearFailedAttempts();
      await updateActivity();
      await refreshUser();
      router.replace("/(tabs)/Map");
    } catch (error) {
      console.error("Login success handling error:", error);
    }
  };

  const login = async () => {
    // Güvenlik kontrolleri
    const isSecurityOk = await checkLoginSecurity();
    if (!isSecurityOk) return;

    if (!phoneNumber.trim() || !password) {
      Toast.show({
        type: "error",
        text1: "Telefon numarası ve şifre zorunludur. ",
        text2: "Telefon numararsı ve şifre giriniz !",
        position: "top",
      });
      return;
    }

    // 📌 API'ye gönderilecek format (sadece rakamlar)
    const cleanPhone = rawPhoneNumber;

    if (cleanPhone.length !== 11) {
      Toast.show({
        type: "error",
        text1: "Telefon numarası 11 haneli olmalıdır.",
        text2: "",
      });
      return;
    }

    // Şifre güvenlik kontrolü
    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Şifre en az 6 karakter olmalıdır.",
        text2: "",
      });
      return;
    }

    setLoading(true);

    try {
      // Güvenli login fonksiyonunu kullan
      const data = await secureLogin(cleanPhone, password);

      Toast.show({
        type: "success",
        text1: "Giriş Başarılı",
        text2: "Yangın İhbar Sistemine Hoş Geldiniz 👋",
        position: "top",
      });
      
      handleLoginSuccess(data.token);
      
    } catch (error) {
      console.error("Login error:", error);
      
      // Başarısız deneme kaydı
      await recordFailedAttempt();
      
      let errorMessage = "Sunucuya bağlanırken hata oluştu.";
      
      if (error.response?.status === 401) {
        errorMessage = "Telefon numarası veya şifre hatalı.";
      } else if (error.response?.status === 429) {
        errorMessage = "Çok fazla deneme. Lütfen bekleyin.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      Toast.show({
        type: "error",
        text1: "Başarısız Giriş!",
        text2: errorMessage,
        position: "top",
      });
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
                ref={phoneInputRef}
                mode="outlined"
                style={styles.textInput}
                placeholder="0(5xx) xxx xx xx"
                outlineColor="grey"
                activeOutlineColor="blue"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={15}
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
                maxLength={50}
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
