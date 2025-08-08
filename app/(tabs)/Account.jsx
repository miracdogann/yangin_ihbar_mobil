import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Avatar, Button, Card, Text, Divider } from "react-native-paper";

const Account = () => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("@/assets/images/fullLogo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Avatar ve Kartı birlikte sarmala */}
      <View style={styles.cardWrapper}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.infoItem}>
              <Avatar.Icon icon="account" size={24} style={styles.icon} />
              <Text style={styles.infoText}>Tolga YILMAZ</Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoItem}>
              <Avatar.Icon icon="phone" size={24} style={styles.icon} />
              <Text style={styles.infoText}>0(505) 505 55 55</Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoItem}>
              <Avatar.Icon icon="email" size={24} style={styles.icon} />
              <Text style={styles.infoText}>yilmaztolga@gmail.com</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Avatar kart üst kenarına bindirildi */}
        <Avatar.Image
          size={80}
          source={require("@/assets/images/user.png")}
          style={styles.avatar}
        />
      </View>

      {/* Buttons */}
      <Button
        mode="contained"
        buttonColor="blue"
        style={styles.button}
        labelStyle={styles.buttonText}
        onPress={() => console.log("İhbarlarım")}
      >
        İhbarlarım
      </Button>

      <Button
        mode="contained"
        buttonColor="blue"
        style={styles.button}
        labelStyle={styles.buttonText}
        onPress={() => console.log("Çıkış Yap")}
      >
        Çıkış Yap
      </Button>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 40,
  },
  logo: {
    width: "60%",
    height: 250,
    marginBottom: 20,
  },
  cardWrapper: {
    width: "85%",
    alignItems: "center", // avatar'ı ve kartı ortalar
    marginBottom: 20,
  },
  card: {
    width: "100%",
    borderRadius: 12,
    paddingTop: 40, // avatar için boşluk
    backgroundColor: "#ffffff",
  },
  cardContent: {
    width: "100%",
    paddingHorizontal: 20,
  },
  avatar: {
    position: "absolute",
    top: -40, // kartın üst kenarına taşar
    zIndex: 1,
    backgroundColor: "white",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    justifyContent: "flex-start",
    width: "100%",
  },
  icon: {
    backgroundColor: "#0000FF",
    marginRight: 15,
  },
  infoText: {
    fontSize: 16,
    flexShrink: 1,
  },
  divider: {
    width: "100%",
    marginVertical: 5,
  },
  button: {
    width: "85%",
    height: 50,
    borderRadius: 8,
    marginTop: 15,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
