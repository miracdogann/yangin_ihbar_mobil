import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Card, useTheme } from "react-native-paper";

import logo from "@/assets/logos/FullLogoOrg.png";
import AboutModal from "../about/About";
import InfoModal from "../about/Info";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const FIRE_SAFETY_TIPS = [
  {
    id: 1,
    icon: "fire-extinguisher",
    text: "Yaz aylarında ormanlık bölgelerde ateş yakmayın.",
  },
  { id: 2, icon: "smoking-off", text: "Sigara izmaritlerini doğaya atmayın." },
  {
    id: 3,
    icon: "power-plug-off",
    text: "Kullanmadığınız cihazların fişlerini çekin.",
  },
  { id: 4, icon: "candle", text: "Mumları gözetimsiz bırakmayın." },
  {
    id: 5,
    icon: "stove",
    text: "Ocakta yemek pişirirken başından ayrılmayın.",
  },
  { id: 6, icon: "alarm-light", text: "Evlerinize duman dedektörü taktırın." },
];

const Info = () => {
  const theme = useTheme();
  const [aboutVisible, setAboutVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);

  return (
    <View
      style={[
        styles.formContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={Platform.OS === "ios"}
        overScrollMode={Platform.OS === "ios" ? "always" : "never"}
      >
        <Image
          source={logo}
          style={styles.logo}
          accessibilityLabel="Uygulama logosu"
        />

        <Text style={styles.title}>Yangını Önle!</Text>
        <Text style={[styles.subtitle, { color: theme.colors.secondary }]}>
          Küçük önlemlerle büyük felaketleri engelleyebilirsiniz
        </Text>

        {/* Hakkımızda ve Info butonları */}
        <View style={styles.iconRow}>
          <Pressable
            style={styles.iconButton}
            onPress={() => setAboutVisible(true)}
          >
            <MaterialCommunityIcons
              name="account-group"
              size={28}
              color="#1976d2"
            />
            <Text style={styles.iconText}>Hakkımızda</Text>
          </Pressable>

          <Pressable
            style={styles.iconButton}
            onPress={() => setInfoVisible(true)}
          >
            <MaterialCommunityIcons
              name="information"
              size={28}
              color="#1976d2"
            />
            <Text style={styles.iconText}>Bilgi</Text>
          </Pressable>
        </View>

        {FIRE_SAFETY_TIPS.map((tip) => (
          <Card
            key={tip.id}
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
            elevation={3}
          >
            <Card.Content>
              <View style={styles.cardContentContainer}>
                <MaterialCommunityIcons
                  name={tip.icon}
                  size={32}
                  color={theme.colors.error}
                  style={styles.icon}
                />
                <Text
                  style={[
                    styles.cardContentText,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {tip.text}
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      {/* Modallar */}
      <AboutModal
        visible={aboutVisible}
        onClose={() => setAboutVisible(false)}
      />
      <InfoModal visible={infoVisible} onClose={() => setInfoVisible(false)} />
    </View>
  );
};

export default Info;

const styles = StyleSheet.create({
  formContainer: { flex: 1, alignItems: "center" },

  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 32,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  cardContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },

  card: {
    width: screenWidth * 0.9, // ekran genişliğinin %90'ı
    marginVertical: 14,
    borderRadius: 14,
    elevation: 3,
  },

  logo: {
    marginTop: screenHeight * 0.02,
    width: Math.min(screenWidth * 0.55, 220), // biraz daha büyük, max 220px
    height: Math.min(screenWidth * 0.55, 220),
    resizeMode: "contain",
  },

  icon: {
    marginRight: 12,
    width: Math.min(screenWidth * 0.075, 45), // biraz daha büyük ikonlar
    height: Math.min(screenWidth * 0.075, 45),
  },

  title: {
    fontSize: Math.min(Math.round(screenWidth * 0.08), 34), // biraz daha büyük
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },

  subtitle: {
    fontSize: Math.min(Math.round(screenWidth * 0.05), 20), // biraz daha büyük
    fontWeight: "400",
    marginBottom: 28,
    textAlign: "center",
  },

  cardContentText: {
    textAlign: "left",
    fontWeight: "500",
    flex: 1,
    fontSize: Math.min(Math.round(screenWidth * 0.048), 17), // hafif büyütüldü
    lineHeight: 24,
  },

  iconRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
    marginBottom: 22,
  },

  iconButton: { alignItems: "center" },

  iconText: {
    marginTop: 4,
    fontSize: Math.min(Math.round(screenWidth * 0.04), 15), // hafif büyütüldü
    color: "#1976d2",
  },
});
