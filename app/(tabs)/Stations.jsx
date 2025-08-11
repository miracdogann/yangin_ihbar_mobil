import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { Card, IconButton, Avatar, Divider, Button } from "react-native-paper";
import React from "react";

const screenWidth = Dimensions.get("window").width;

const Stations = () => {
  return (
      <View style={styles.formContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >

          <Image
            source={require("@/assets/images/fullLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

        <View style={styles.cardWrapper}>
          <Card style={styles.titleCard}>
            <Text style={styles.title}>Acil Yardım Merkezleri</Text>
          </Card>
        </View>

        <View style={styles.cardWrapper}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.infoItem}>
                <Avatar.Icon icon="bank-outline" size={30} style={styles.icon} />
                <Text style={styles.stationTitle}>MOSB İTFAİYE</Text>
              </View>

              <Divider style={styles.divider} />

              <View style={styles.infoItem}>
                <Avatar.Icon icon="map-marker-radius" size={30} style={styles.icon} />
                <Text style={styles.stationAddress}>
                  Mosb Mah., Malazgirt Cd. No:4, 
                  45030 Keçiliköy/Yunusemre/Manisa
                </Text>
              </View>

              <Divider style={styles.divider} />

              <Button
                icon="phone-in-talk"
                mode="contained"
                buttonColor="blue"
                style={styles.button}
                labelStyle={styles.buttonText}
                onPress={() => console.log("Arama yapıldı")}
              >
                (236) 236 11 25
              </Button>

            </Card.Content>
          </Card>
        </View>

        <View style={styles.cardWrapper}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.infoItem}>
                <Avatar.Icon icon="bank-outline" size={30} style={styles.icon} />
                <Text style={styles.stationTitle}>Manisa İTFAİYE</Text>
              </View>

              <Divider style={styles.divider} />

              <View style={styles.infoItem}>
                <Avatar.Icon icon="map-marker-radius" size={30} style={styles.icon} />
                <Text style={styles.stationAddress}>
                  Tevfikiye, Manisa İtfaiyesi, 45120 
                  Manisa Merkez/Manisa
                </Text>
              </View>

              <Divider style={styles.divider} />

              <Button
                icon="phone-in-talk"
                mode="contained"
                buttonColor="blue"
                style={styles.button}
                labelStyle={styles.buttonText}
                onPress={() => console.log("Arama yapıldı")}
              >
                (236) 236 11 25
              </Button>

            </Card.Content>
          </Card>
        </View>

        </ScrollView>
      </View>
    );
  };


export default Stations;

const styles = StyleSheet.create({

  formContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    width: "100%",
  },

  scrollContainer: {
    flexGrow: 1,
    padding: 10,
    paddingBottom: 100,
    width: "100%",       
  },

  logo: {
    width: screenWidth * 0.4,
    height: 150,
    marginTop: 50,
    alignSelf: "center",
  },

  cardWrapper: {
    width: screenWidth * 0.90,
    alignItems: "center", 
    marginBottom: 20,
    justifyContent: "center",
  },

  card: {
    width: "90%",
    borderRadius: 25,
    backgroundColor: "#ffffff",
  },

  titleCard: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },

  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 26,
    paddingVertical: 10,
  },

  cardContent: {
    width: "100%",
    paddingHorizontal: 20,
    flexGrow: 0,
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

  divider: {
    width: "100%",
    marginVertical: 2,
    backgroundColor: "white"
  },

  button: {
    width: "100%",
    height: 40,
    borderRadius: 8,
    marginTop: 15,
    justifyContent: "center",
    alignSelf: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },

  stationTitle: {
    fontSize: 20,
    flexShrink: 1,
    flexWrap: "wrap",
    overflow: "hidden",
    paddingLeft: 10,
  },

  stationAddress: {
      fontSize: 14,
      textAlign: "left",
      paddingRight: 10,
      flexShrink: 1,
      flexWrap: "wrap",
      overflow: "hidden",
  },

})

