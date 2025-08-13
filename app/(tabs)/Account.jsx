import { useUser } from "@/contexts/userContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import {
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
        source={require("@/assets/images/fullLogo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Kullanıcı Bilgileri Kartı */}
      <View style={styles.cardWrapper}>
        <Card style={styles.card} mode="elevated">
          <Card.Content style={styles.cardContent}>
            <View style={styles.infoItem}>
              <Avatar.Icon icon="account" size={28} style={styles.icon} />
              <Text style={styles.infoText}>{user?.name_surname}</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.infoItem}>
              <Avatar.Icon icon="phone" size={28} style={styles.icon} />
              <Text style={styles.infoText}>{user?.phone_number}</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.infoItem}>
              <Avatar.Icon icon="email" size={28} style={styles.icon} />
              <Text style={styles.infoText}>{user?.email}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Profil Avatarı */}
        <Avatar.Image
          size={70}
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

      {/* İleride ek alanlar için boşluk */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

export default Account;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  logo: {
    width: "60%",
    height: 200,
    marginBottom: 20,
  },
  cardWrapper: {
    width: "90%",
    alignItems: "center",
    marginBottom: 25,
  },
  card: {
    width: "100%",
    borderRadius: 16,
    paddingTop: 50,
    backgroundColor: "#fff",
    elevation: 3,
  },
  cardContent: {
    paddingHorizontal: 20,
  },
  avatar: {
    position: "absolute",
    top: -35,
    zIndex: 1,
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
    fontSize: 16,
    color: "#333",
    flexShrink: 1,
  },
  divider: {
    width: "100%",
    marginVertical: 5,
  },
  button: {
    width: "90%",
    height: 50,
    borderRadius: 12,
    marginTop: 15,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
});
