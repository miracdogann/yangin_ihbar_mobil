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
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import React, { useState } from "react";

import logo from "@/assets/images/fullLogo.png";
import { useRouter } from "expo-router";

const Login = () => {
  const [secure, setSecure] = useState(true);
  const router = useRouter();
  const goRegisterPage = () => {
    router.push("/auth/Register");
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
                placeholder="+90 (505) 505 55 55"
                outlineColor="grey"
                activeOutlineColor="blue"
                keyboardType="phone-pad"
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
              />
            </View>

            <Button
              mode="contained"
              buttonColor="blue"
              rippleColor="white"
              style={styles.loginButton}
              labelStyle={styles.loginButtonText}
              onPress={() => console.log("Giriş yapıldı")}
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
