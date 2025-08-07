import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import React, { useState } from 'react';

import logo from '@/assets/images/logo.png';

const LoginScreen = () => {
  const [secure, setSecure] = useState(true);
  const goRegisterPage = () => {
    console.log('Register Sayfasına Geçiş');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // Ayarlanabilir
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

        <View style={styles.formContainer}>

          <Image source={logo} style={styles.logo} />

          <Text style={styles.infoText}>Hemen Giriş Yapın !</Text>

          <View style={styles.emailContainer}>
            <Text style={styles.inputLabel}>Telefon Numarası</Text>
            <TextInput
              mode="outlined"
              style={styles.textInput}
              placeholder="example@gmail.com"
              outlineColor="grey"
              activeOutlineColor="blue"
            />
          </View>

          <View style={styles.passwordContainer}>
            <Text style={styles.inputLabel}>Şifre</Text>
            <TextInput
              mode="outlined"
              style={styles.textInput}
              placeholder="şifre girin"
              outlineColor="grey"
              activeOutlineColor="blue"
              secureTextEntry={secure}
              right={
                <TextInput.Icon
                  icon={secure ? 'eye-off' : 'eye'}
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
            onPress={() => console.log('Giriş yapıldı')}
          >
            Giriş Yap
          </Button>

          <View style={styles.bottomContainer}>
            <Text style={styles.bottomInfoText}>Hesabın Yok Mu ?</Text>
            <TouchableOpacity onPress={goRegisterPage}>
              <Text style={styles.registerText}> Kayıt Ol</Text>
            </TouchableOpacity>
          </View>

        </View>
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: 40,
  },
  emailContainer: {
    width: '75%',
    alignItems: 'flex-start',
    marginTop: 30,
  },
  passwordContainer: {
    width: '75%',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  bottomContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  logo: {
    marginTop: 50,
    width: '80%',
    height: 200,
    resizeMode: 'contain',
  },
  infoText: {
    color: 'grey',
    fontSize: 12,
    marginTop: 30,
  },
  textInput: {
    backgroundColor: 'white',
    width: '100%',
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 16,
    textAlign: 'left',
  },
  loginButton: {
    width: '75%',
    height: 50,
    borderRadius: 8,
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    width: '100%',
  },
  bottomInfoText: {
    color: 'grey',
  },
  registerText: {
    color: 'blue',
  },
});
