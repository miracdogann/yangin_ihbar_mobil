import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { Card, IconButton } from "react-native-paper";
import React from "react";

import logo from "@/assets/images/fullLogo.png";

const screenWidth = Dimensions.get("window").width;

const Info = () => {
  return (
    <View style={styles.formContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Image source={logo} style={styles.logo} />

        <Text style={styles.title}>Yangını önle !</Text>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardContentContainer}>
              <IconButton
                icon="fire-extinguisher"
                size={35}
                iconColor="red"
                style={styles.contentIcon}
              />
              <Text style={styles.cardContentText}>
                Yaz aylarında ormanlık bölgelerde ateş yakmak yangına sebep
                olabilir. Lütfen pikniklerde ateş yakmamaya dikkat edin.
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardContentContainer}>
              <IconButton
                icon="fire-extinguisher"
                size={35}
                iconColor="red"
                style={styles.contentIcon}
              />
              <Text style={styles.cardContentText}>
                Atılan sigara izmaritleri, kuru yapraklarla temas ettiğinde
                büyük yangınlara yol açabilir.
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardContentContainer}>
              <IconButton
                icon="fire-extinguisher"
                size={35}
                iconColor="red"
                style={styles.contentIcon}
              />
              <Text style={styles.cardContentText}>
                Ev yangınlarının %25'i elektrik kontağından çıkmaktadır. Uzun
                süreli kullanmadığınız cihazların fişlerini çekin.
              </Text>
            </View>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardContentContainer}>
              <IconButton
                icon="fire-extinguisher"
                size={35}
                iconColor="red"
                style={styles.contentIcon}
              />
              <Text style={styles.cardContentText}>
                Ev yangınlarının %25'i elektrik kontağından çıkmaktadır. Uzun
                süreli kullanmadığınız cihazların fişlerini çekin.
              </Text>
            </View>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardContentContainer}>
              <IconButton
                icon="fire-extinguisher"
                size={35}
                iconColor="red"
                style={styles.contentIcon}
              />
              <Text style={styles.cardContentText}>
                Ev yangınlarının %25'i elektrik kontağından çıkmaktadır. Uzun
                süreli kullanmadığınız cihazların fişlerini çekin.
              </Text>
            </View>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardContentContainer}>
              <IconButton
                icon="fire-extinguisher"
                size={35}
                iconColor="red"
                style={styles.contentIcon}
              />
              <Text style={styles.cardContentText}>
                Ev yangınlarının %25'i elektrik kontağından çıkmaktadır. Uzun
                süreli kullanmadığınız cihazların fişlerini çekin.
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

export default Info;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },

  scrollContainer: {
    flexGrow: 1,
    padding: 10,
    paddingBottom: 100,
    width: "100%",
  },

  cardContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  card: {
    width: screenWidth * 0.9,
    margin: 16,
    backgroundColor: "white",
    borderRadius: 15,
  },

  logo: {
    marginTop: 30,
    width: 200,
    height: 200,
    resizeMode: "contain",
    opacity: 0.5,
    alignSelf: "center",
  },

  contentIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    paddingLeft: 0,
  },

  title: {
    fontSize: 30,
    fontWeight: "500",
    alignSelf: "center",
  },

  cardContentText: {
    textAlign: "center",
    fontWeight: "600",
    flexShrink: 1,
    flexWrap: "wrap",
    flex: 1,
  },
});
