import logo from "@/assets/logos/FullLogoOrg.png";
import Kvkk from "@/components/Kvkk";
import { API_BASE_URL } from "@/services/api";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

const Register = () => {
  const [nameSurname, setNameSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [rawPhoneNumber, setRawPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securePassword, setSecurePassword] = useState(true);
  const [secureRepeat, setSecureRepeat] = useState(true);
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [kvkkModalVisible, setKvkkModalVisible] = useState(false);

  const phoneInputRef = useRef(null);
  const router = useRouter();

  const goLoginPage = () => {
    router.push("/auth/Login");
  };

  const formatPhoneNumber = (digits) => {
    digits = digits.replace(/\D/g, "");
    if (!digits.startsWith("0")) digits = "0" + digits;
    if (digits.length >= 2 && digits[1] !== "5")
      digits = digits[0] + "5" + digits.slice(2);
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
    if (digits.length >= 2 && digits[1] !== "5")
      digits = digits[0] + "5" + digits.slice(2);
    digits = digits.slice(0, 11);
    setRawPhoneNumber(digits);
    setPhoneNumber(formatPhoneNumber(digits));
  };

  const isValidEmail = (mail) => {
    const pattern = /^(?:[a-zA-Z0-9._%+-]+)@(gmail|hotmail|outlook)\.com$/;
    return pattern.test(mail);
  };

  const handleRegister = async () => {
    if (
      !nameSurname.trim() ||
      !email.trim() ||
      !phoneNumber.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
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
        text2: "Lütfen geçerli bir e-posta girin.",
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
    if (!kvkkAccepted) {
      Toast.show({
        type: "error",
        text1: "KVKK Kabulü",
        text2: "Lütfen KVKK politikasını kabul edin.",
      });
      return;
    }
    const cleanPhone = rawPhoneNumber;
    if (!cleanPhone || cleanPhone.length !== 11) {
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
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
              />
            </View>

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

            <View style={styles.kvkkContainer}>
              <TouchableOpacity
                onPress={() => setKvkkAccepted(!kvkkAccepted)}
                style={styles.kvkkTouchable}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.kvkkCheckbox,
                    kvkkAccepted && styles.kvkkCheckboxActive,
                  ]}
                >
                  {kvkkAccepted && <Text style={styles.kvkkCheckText}>✓</Text>}
                </View>
                <Text style={styles.kvkkText}>
                  KVKK politikasını okudum ve kabul ediyorum.{" "}
                  <Text
                    style={styles.kvkkLink}
                    onPress={() => setKvkkModalVisible(true)}
                  >
                    Aydınlatma Metni
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>

            <Modal
              animationType="slide"
              transparent={true}
              visible={kvkkModalVisible}
              onRequestClose={() => setKvkkModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <ScrollView>
                    <Text style={styles.modalTitle}>KVKK Politika Metni</Text>
                    <Kvkk />
                  </ScrollView>
                  <Pressable
                    onPress={() => setKvkkModalVisible(false)}
                    style={styles.modalCloseButton}
                  >
                    <Text style={styles.modalCloseText}>Kapat</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>

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
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: "white",
  },
  innerContainer: {
    marginTop: height * 0.01,
    alignItems: "center",
  },
  logo: {
    width: "80%",
    height: height * 0.3,
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
    height: "50",
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
  kvkkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "80%",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  kvkkTouchable: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  kvkkCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  kvkkCheckboxActive: {
    borderColor: "#4A90E2",
    backgroundColor: "#4A90E2",
  },
  kvkkCheckText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  kvkkText: {
    flexShrink: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
  kvkkLink: {
    color: "#4A90E2",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  modalCloseButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  modalCloseText: {
    color: "blue",
    fontWeight: "bold",
  },
});
