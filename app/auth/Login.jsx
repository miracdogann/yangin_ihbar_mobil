import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native'
import {TextInput, Button} from 'react-native-paper'
import React, { useState } from 'react'

import logo from "@/assets/images/logo.png"

const Login = () => {
  const [secure, setSecure] = useState(true);
  const goRegisterPage = () => {console.log("Register Sayfasına Geçiş")}

  return (
    <View style={styles.formContainer}>

      <Image
        source={logo}
        style={styles.logo}
      />

      <Text style={styles.infoText}>Hemen Giriş Yapın !</Text>

      <View style={styles.emailContainer}>
        <Text style={styles.inputLabel}>Telefon Numarası</Text>
        <TextInput
          mode="outlined"
          style={styles.textInput}
          placeholder= "example@gmail.com"
          //label= "Telefon Numarası"
          outlineColor="grey"
          activeOutlineColor="blue"
        />
        </View>

        <View style={styles.passwordContainer}>
          <Text style={styles.inputLabel}>Şifre</Text>
          <TextInput
            mode="outlined"
            style={styles.textInput}
            placeholder= "şifre girin"
            //label= "Telefon Numarası"
            outlineColor="grey"
            activeOutlineColor="blue"
            secureTextEntry={secure}
            right={
              <TextInput.Icon
                icon={secure ? "eye-off" : "eye"}
                onPress = {() => setSecure(!secure)}
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

        <View style={styles.bottomContainer}>
          <Text style={styles.bottomInfoText}>
            Hesabın Yok Mu ?
          </Text>
          <TouchableOpacity onPress={goRegisterPage}>
              <Text style={styles.registerText}> Kayıt Ol</Text>
            </TouchableOpacity>
        </View>
      
    </View>
  )
};

export default Login;

const styles = StyleSheet.create({
    formContainer: { 
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
    },
    emailContainer: { //email view style
      width: "75%",
      alignItems: "flex-start",
      marginTop: 30,
    },
    passwordContainer: { // password view style
      width: "75%",
      alignItems: "flex-start",
      marginTop: 10,
    },
    bottomContainer: { // en alttaki yazıları kapsayan container için style
      flexDirection: "row",
      marginTop: "30",
    },
    logo: {
        marginTop: 20,
        width: "80%",
        height: "35%",
    },
    infoText: { // logonun altındaki text için style
        color: "grey",
        fontSize: 12,
        marginTop: 30,
    },
    textInput: { // email and password text input style
        backgroundColor: "white",
        width: "100%",
        marginTop: 10,
    },
    inputLabel: { // text inputların üstündeki etiket yazıları için style
        fontSize: 16,
        textAlign: "left",
    },
    loginButton: { // login button style
        width: "75%",
        height: "6%",
        borderRadius: 8,
        marginTop: 60,
        alignItems: "center",
        justifyContent: "center",    
    },
    loginButtonText: { //login butonun içindeki yazı için style
        color: "white",
        fontSize: 16,
        width: "100%"
    },
    bottomInfoText: { //hesabın yok mu yazısı için style
        color: "grey",
    },
    registerText: { // kayıt sayfasına giden text için style
        color: "blue",
    }
})