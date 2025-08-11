import logo from "@/assets/images/fullLogo.png";
import { API_BASE_URL } from "@/services/api";
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

  // 📌 Telefon formatlama (Login'dekiyle aynı)
  const formatPhoneNumber = (text) => {
    let digits = text.replace(/\D/g, "");
    if (!digits.startsWith("0")) digits = "0" + digits;
    digits = digits.slice(0, 11);

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

  const handlePhoneChange = (text) => {
    let digits = text.replace(/\D/g, "");
    if (!digits.startsWith("0")) digits = "0" + digits;
    if (digits.length >= 2 && digits[1] !== "5") {
      digits = digits[0] + "5" + digits.slice(2);
    }
    setPhoneNumber(formatPhoneNumber(digits));
  };

  // 📌 Email doğrulama
  const isValidEmail = (mail) => {
    const pattern = /^(?:[a-zA-Z0-9._%+-]+)@(gmail|hotmail|outlook)\.com$/;
    return pattern.test(mail);
  };

  const handleRegister = async () => {
    if (
      !nameSurname ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Lütfen tüm alanları doldurun.",
      });
      return;
    }

    if (!isValidEmail(email)) {
      Toast.show({
        type: "error",
        text1: "Geçersiz E-posta",
        text2: "Lütfen Doğru bir e-posta adresi giriniz",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Şifreler eşleşmiyor.",
      });
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (cleanPhone.length !== 11) {
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Telefon numarası 11 haneli olmalıdır.",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name_surname: nameSurname,
          email: email,
          phone_number: cleanPhone,
          password: password,
          confirm_password: confirmPassword,
        }),
      });

      const json = await response.json();

      if (response.ok) {
        Toast.show({ type: "success", text1: "Başarılı", text2: json.message });
        router.push("/auth/Login");
      } else {
        Toast.show({
          type: "error",
          text1: "Hata",
          text2: json.error || "Kayıt sırasında hata oluştu.",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Sunucuya bağlanılamadı.",
      });
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
