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
import React, { useState } from "react";
import { MaskedTextInput } from "react-native-mask-text";

import logo from "@/assets/images/fullLogo.png";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "@/services/api";

const Register = () => {
  const [nameSurname, setNameSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securePassword, setSecurePassword] = useState(true);
  const [secureRepeat, setSecureRepeat] = useState(true);
  const router = useRouter();

  const goLoginPage = () => {
    router.push("/auth/Login");
  };

  const handleRegister = async () => {
    // Basit validation (backend zaten detaylı kontrol yapacak)
    if (
      !nameSurname ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler eşleşmiyor.");
      return;
    }

    // Backend API adresin (kendi adresine göre değiştir)

    // Telefon numarasından parantez ve boşlukları kaldır (backend formatına uygun olsun)
    const normalizedPhone = phoneNumber.replace(/[()\s-]/g, "");

    try {
      const response = await fetch(`${API_BASE_URL}register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name_surname: nameSurname,
          email: email,
          phone_number: normalizedPhone,
          password: password,
          confirm_password: confirmPassword,
        }),
      });

      const json = await response.json();

      if (response.ok) {
        Alert.alert("Başarılı", json.message);
        router.push("/auth/Login"); // Kayıt sonrası login sayfasına yönlendir
      } else {
        // Backend'ten dönen hata mesajı
        Alert.alert("Hata", json.error || "Kayıt sırasında hata oluştu.");
      }
    } catch (error) {
      Alert.alert("Hata", "Sunucuya bağlanılamadı.");
      console.error(error);
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

            <Text style={styles.infoText}>Yeni Hesap Oluşturun</Text>

            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ad Soyad</Text>
              <TextInput
                mode="outlined"
                style={styles.textInput}
                placeholder="Adınızı ve soyadınızı girin"
                outlineColor="grey"
                activeOutlineColor="blue"
                value={nameSurname}
                onChangeText={setNameSurname}
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-Posta Adresi</Text>
              <TextInput
                mode="outlined"
                style={styles.textInput}
                placeholder="ornek@gmail.com"
                outlineColor="grey"
                activeOutlineColor="blue"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Phone Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefon Numarası</Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "grey",
                  borderRadius: 4,
                }}
              >
                <MaskedTextInput
                  type="custom"
                  options={{
                    mask: "(999) 999 99 99",
                  }}
                  keyboardType="numeric"
                  placeholder="(555) 123 45 67"
                  style={{
                    padding: 14,
                    fontSize: 16,
                    color: "black",
                  }}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Şifre</Text>
              <TextInput
                mode="outlined"
                style={styles.textInput}
                placeholder="Şifrenizi girin"
                outlineColor="grey"
                activeOutlineColor="blue"
                secureTextEntry={securePassword}
                right={
                  <TextInput.Icon
                    icon={securePassword ? "eye-off" : "eye"}
                    onPress={() => setSecurePassword(!securePassword)}
                  />
                }
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Password Again */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Şifre (Tekrar)</Text>
              <TextInput
                mode="outlined"
                style={styles.textInput}
                placeholder="Şifrenizi tekrar girin"
                outlineColor="grey"
                activeOutlineColor="blue"
                secureTextEntry={secureRepeat}
                right={
                  <TextInput.Icon
                    icon={secureRepeat ? "eye-off" : "eye"}
                    onPress={() => setSecureRepeat(!secureRepeat)}
                  />
                }
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            {/* Register Button */}
            <Button
              mode="contained"
              buttonColor="blue"
              rippleColor="white"
              style={styles.loginButton}
              labelStyle={styles.loginButtonText}
              onPress={handleRegister}
            >
              Kayıt Ol
            </Button>

            <View style={styles.registerContainer}>
              <Text style={styles.bottomInfoText}>Zaten hesabın var mı?</Text>
              <TouchableOpacity onPress={goLoginPage}>
                <Text style={styles.registerText}> Giriş Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;

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
    height: 180,
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
