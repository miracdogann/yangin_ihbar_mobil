import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Card, useTheme } from "react-native-paper";

import logo from "@/assets/images/fullLogo.png";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Yangın önleme ipuçları verileri
const FIRE_SAFETY_TIPS = [
  {
    id: 1,
    icon: "fire-extinguisher",
    text: "Yaz aylarında ormanlık bölgelerde ateş yakmak yangına sebep olabilir. Lütfen pikniklerde ateş yakmamaya dikkat edin.",
  },
  {
    id: 2,
    icon: "smoking-off",
    text: "Atılan sigara izmaritleri, kuru yapraklarla temas ettiğinde büyük yangınlara yol açabilir.",
  },
  {
    id: 3,
    icon: "power-plug-off",
    text: "Ev yangınlarının %25'i elektrik kontağından çıkmaktadır. Uzun süreli kullanmadığınız cihazların fişlerini çekin.",
  },
  {
    id: 4,
    icon: "candle",
    text: "Yanar halde bırakılan mumlar ev yangınlarının önemli sebeplerindendir. Mumları asla gözetimsiz bırakmayın.",
  },
  {
    id: 5,
    icon: "stove",
    text: "Yemek pişirirken ocak başından ayrılmayın. Yağ yangınlarında asla su kullanmayın, üzerini kapatarak oksijeni kesin.",
  },
  {
    id: 6,
    icon: "alarm-light",
    text: "Evlerinize duman dedektörü taktırın. Düzenli olarak pil kontrolü yapın ve 10 yılda bir değiştirin.",
  },
];

const Info = () => {
  const theme = useTheme();
  const isIOS = Platform.OS === "ios";

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
        bounces={isIOS} // iOS için bounce efekti
        overScrollMode={isIOS ? "always" : "never"} // Android için overscroll ayarı
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

        {FIRE_SAFETY_TIPS.map((tip) => (
          <Card
            key={tip.id}
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                shadowColor: theme.colors.primary,
              },
            ]}
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
    </View>
  );
};

export default Info;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 32,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  cardContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 8,
  },
  card: {
    width: screenWidth * 0.92,
    marginVertical: 12,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Android için shadow
    elevation: 3,
    // iOS için shadow
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  logo: {
    marginTop: screenHeight * 0.02,
    width: 180,
    height: 180,
    resizeMode: "contain",
    opacity: 1,
  },
  icon: {
    marginRight: 12,
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
    fontFamily: Platform.select({
      ios: "Helvetica Neue",
      android: "sans-serif-medium",
    }),
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 24,
    textAlign: "center",
    fontFamily: Platform.select({
      ios: "Helvetica Neue",
      android: "sans-serif",
    }),
  },
  cardContentText: {
    textAlign: "left",
    fontWeight: "500",
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: "Helvetica Neue",
      android: "sans-serif",
    }),
  },
});
