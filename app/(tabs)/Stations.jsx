import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Avatar, Button, Card, Divider } from "react-native-paper";

// API'den istasyon verilerini almak için fonksiyon (örnek)
import { getStations } from "@/services/api";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Stations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // İstasyon verilerini alma
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await getStations();
        setStations(response.data || []);
        console.log("İstasyon verileri:", response.data);
      } catch (err) {
        setError("İstasyon verileri alınamadı.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  return (
    <View style={styles.formContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require("@/assets/logos/FullLogoOrg.png")}
          style={styles.logo}
        />

        <View style={styles.cardWrapper}>
          <Card style={styles.titleCard}>
            <Text style={styles.title}>Acil Yardım Merkezleri</Text>
          </Card>
        </View>

        {/* Loading durumu */}
        {loading && (
          <ActivityIndicator
            size="large"
            color="blue"
            style={{ marginTop: 20 }}
          />
        )}

        {/* Hata durumu */}
        {error && !loading && (
          <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
            {error}
          </Text>
        )}

        {/* İstasyon listesi */}
        {!loading &&
          !error &&
          stations.map((station, index) => (
            <View key={index} style={styles.cardWrapper}>
              <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  {/* İstasyon Adı */}
                  <View style={styles.infoItem}>
                    <Avatar.Icon
                      icon="bank-outline"
                      size={30}
                      style={styles.icon}
                    />
                    <Text style={styles.stationTitle}>{station.name}</Text>
                  </View>

                  <Divider style={styles.divider} />

                  {/* Adres */}
                  <View style={styles.infoItem}>
                    <Avatar.Icon
                      icon="map-marker-radius"
                      size={30}
                      style={styles.icon}
                    />
                    <Text style={styles.stationAddress}>{station.address}</Text>
                  </View>

                  <Divider style={styles.divider} />

                  {/* Telefon Butonu */}
                  <Button
                    icon="phone-in-talk"
                    mode="contained"
                    buttonColor="blue"
                    style={styles.button}
                    labelStyle={styles.buttonText}
                    onPress={() => {
                      if (!station.phone_number) {
                        Alert.alert(
                          "Bilgi Eksik",
                          "Telefon numarası bulunamadı."
                        );
                        return;
                      }

                      // Numara formatlama (boşluk ve tireleri temizle)
                      let phone = station.phone_number.replace(/[\s-]/g, "");

                      // Eğer numara 0 ile başlıyorsa +90 ekle
                      if (phone.startsWith("0")) {
                        phone = "+90" + phone.substring(1);
                      }

                      const url = `tel:${phone}`;
                      Linking.openURL(url).catch(() => {
                        Alert.alert("Hata", "Arama başlatılamadı.");
                      });
                    }}
                  >
                    {station.phone_number}
                  </Button>
                </Card.Content>
              </Card>
            </View>
          ))}
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
    width: screenWidth * 0.5, // ekran genişliğinin %50'si
    height: screenHeight * 0.2, // ekran yüksekliğinin %20'si
    maxHeight: 200, // büyük ekranlar için maksimum
    minHeight: 100, // küçük ekranlar için minimum
    marginTop: screenHeight * 0.05, // üst boşluk
    alignSelf: "center",
    resizeMode: "contain",
  },
  cardWrapper: {
    width: screenWidth * 0.9,
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
    backgroundColor: "white",
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
});
