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

import logo from '@/assets/images/logo-2.png';

const Register = () => {

  const [secure, setSecure] = useState(true);
  const goRegisterPage = () => {
    console.log('Register Sayfasına Geçiş');
  };

return (
    <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} 
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1}} keyboardShouldPersistTaps="handled">
    
            <View style={styles.formContainer}>
    
                <Image source={logo} style={styles.logo} />

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Ad-Soyad</Text>
                    <TextInput
                    mode="outlined"
                    style={styles.input}
                    placeholder="İsminizi giriniz"
                    outlineColor="grey"
                    activeOutlineColor="blue"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>E-Posta</Text>
                    <TextInput
                    mode="outlined"
                    style={styles.input}
                    placeholder="example@gmail.com"
                    outlineColor="grey"
                    activeOutlineColor="blue"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Telefon Numarası</Text>
                    <TextInput
                    mode="outlined"
                    style={styles.input}
                    placeholder="+90 (505) 546 80 80"
                    outlineColor="grey"
                    activeOutlineColor="blue"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Şifre</Text>
                    <TextInput
                    mode="outlined"
                    style={styles.input}
                    placeholder="Şifrenizi giriniz"
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

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Şifre Tekrarı</Text>
                    <TextInput
                    mode="outlined"
                    style={styles.input}
                    placeholder="Şifrenizi tekrar giriniz"
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
                    style={styles.registerButton}
                    labelStyle={styles.registerButtonText}
                    onPress={() => console.log('Kayıt olundu')}
                >
                    Kayıt Ol
                </Button>

                <View style={styles.bottomContainer}>
                    <Text style={styles.bottomInfoText}>Hesabın Var Mı ?</Text>
                    <TouchableOpacity onPress={goRegisterPage}>
                    <Text style={styles.loginText}> Giriş Yap</Text>
                    </TouchableOpacity>
                </View>

            </View>
            
          </ScrollView>
        </KeyboardAvoidingView>
  )
}

export default Register

const styles = StyleSheet.create({

  formContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "white",
  },

  inputContainer: {
    width: '75%',
    alignItems: 'flex-start',
    marginTop: 10,
  },

  bottomContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },

  logo: {
    marginTop: 10,
    width: '80%',
    height: 150,
    resizeMode: 'contain',
  },

  input: {
    backgroundColor: 'white',
    width: '100%',
    height: 50,
    marginTop: 10,    
  },

  inputLabel: {
    fontSize: 16,
    textAlign: 'left',
  },

  registerButton: {
    width: '75%',
    height: 50,
    borderRadius: 8,
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  registerButtonText: {
    color: 'white',
    fontSize: 16,
    width: '100%',
  },

  bottomInfoText: {
    color: 'grey',
  },
  loginText: {
    color: 'blue',
  },
})