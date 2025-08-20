import { useUser } from "@/contexts/userContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Divider,
  Text,
} from "react-native-paper";
import Toast from "react-native-toast-message";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const Account = () => {
  const { user, loading } = useUser();
  const handleLogout = async () => {
    Toast.show({
      type: "info",
      text1: "Çıkış Yapılıyor...",
      position: "top",
    });
    await AsyncStorage.removeItem("userToken");
    router.replace("/Start");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
        backgroundColor="white"
      />

      {/* Logo */}
      <Image
        source={require("@/assets/logos/FullLogoOrg.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Kullanıcı Bilgileri Kartı */}
      <View style={styles.cardWrapper}>
        <Card style={styles.card} mode="elevated">
          <Card.Content style={styles.cardContent}>
            <View style={styles.infoItem}>
              <Avatar.Icon
                icon="account"
                size={Math.min(screenWidth * 0.08, 36)}
                style={styles.icon}
              />
              <Text style={styles.infoText}>{user?.name_surname}</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.infoItem}>
              <Avatar.Icon
                icon="phone"
                size={Math.min(screenWidth * 0.08, 36)}
                style={styles.icon}
              />
              <Text style={styles.infoText}>{user?.phone_number}</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.infoItem}>
              <Avatar.Icon
                icon="email"
                size={Math.min(screenWidth * 0.08, 36)}
                style={styles.icon}
              />
              <Text style={styles.infoText}>{user?.email}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Profil Avatarı */}
        <Avatar.Image
          size={Math.min(screenWidth * 0.18, 70)}
          source={require("@/assets/images/user.png")}
          style={styles.avatar}
        />
      </View>

      {/* Butonlar */}
      <Button
        mode="contained"
        buttonColor="#002fffff"
        style={styles.button}
        labelStyle={styles.buttonText}
        onPress={() => router.navigate("/UserReport/UserReport")}
      >
        İhbarlarım
      </Button>

      <Button
        mode="contained"
        buttonColor="#f0170cff"
        style={styles.button}
        labelStyle={styles.buttonText}
        onPress={handleLogout}
      >
        Çıkış Yap
      </Button>

      <View style={{ height: screenHeight * 0.05 }} />
    </ScrollView>
  );
};

export default Account;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: 30,
    minHeight: screenHeight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  logo: {
    width: screenWidth * 0.6,
    height: screenHeight * 0.25,
    marginTop: screenHeight * 0.01,
    marginBottom: screenHeight * 0.03,
    resizeMode: "contain",
  },
  cardWrapper: {
    width: "95%",
    alignItems: "center",
    marginBottom: 25,
    paddingTop: 50,
  },
  card: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#fff",
    elevation: 3,
    paddingTop: 50,
    paddingBottom: 20,
  },
  cardContent: {
    paddingHorizontal: 20,
  },
  avatar: {
    position: "absolute",
    top: -35,
    zIndex: 2,
    backgroundColor: "white",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
    width: "100%",
  },
  icon: {
    backgroundColor: "#002fffff",
    marginRight: 15,
  },
  infoText: {
    fontSize: Math.min(Math.round(screenWidth * 0.045), 18),
    color: "#333",
    flexShrink: 1,
  },
  divider: {
    width: "100%",
    marginVertical: 5,
  },
  button: {
    width: "90%",
    height: Math.min(50, screenHeight * 0.07),
    borderRadius: 12,
    marginTop: 15,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: Math.min(Math.round(screenWidth * 0.045), 18),
    fontWeight: "500",
    color: "white",
  },
});
