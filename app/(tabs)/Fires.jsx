import { getAllReports } from "@/services/api";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  Dimensions
} from "react-native";

const API_KEY = "vxNgHq8W1x8soPbMdhwWqgyDrT6ZVMXf"; // TomTom API key

const screenWidth = Dimensions.get("window").width;

const Fires = () => {
  const [fires, setFires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Adres cache
  const addressCache = useRef({});

  const getAddressFromCoords = async (lat, lon) => {
    const key = `${lat},${lon}`;
    if (addressCache.current[key]) return addressCache.current[key];

    try {
      const radius = 10000;
      const url =
        `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lon}.json` +
        `?returnSpeedLimit=false&radius=${radius}&returnRoadUse=false&allowFreeformNewLine=false&returnMatchType=false&view=Unified&language=tr-TR&key=${API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      const address =
        data.addresses && data.addresses.length > 0
          ? data.addresses[0].address.freeformAddress
          : "Adres bulunamadı";

      // Cachele
      addressCache.current[key] = address;
      return address;
    } catch (err) {
      console.error("Adres alınırken hata:", err);
      return "Adres alınamadı";
    }
  };

  const fetchFires = async () => {
    setError(null);
    try {
      const response = await getAllReports();
      let fireList = response.data || [];

      const settledFires = await Promise.allSettled(
        fireList.map(async (fire) => {
          let address = fire.address; // Öncelikle mevcut address'i al
          if (!address) {
            // Eğer adres yoksa TomTom API ile al
            address = await getAddressFromCoords(fire.latitude, fire.longitude);
          }
          return { ...fire, address };
        })
      );

      const firesWithAddress = settledFires.map((r) =>
        r.status === "fulfilled"
          ? r.value
          : { ...r.reason, address: "Adres alınamadı" }
      );

      setFires(firesWithAddress);
      console.log("Yangın ihbar verileri:", firesWithAddress);
    } catch (err) {
      setError("Yangın ihbar verileri alınamadı.");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFires();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFires();
  }, []);

  const renderFire = ({ item }) => {
    let statusLabel = "";
    let statusStyle = {};

    switch (item.status) {
      case "devam":
        statusLabel = "Devam Ediyor";
        statusStyle = styles.statusActive;
        break;
      case "mudahale":
        statusLabel = "Müdahale Ediliyor";
        statusStyle = styles.statusPending;
        break;
      case "sonduruldu":
        statusLabel = "Söndürüldü";
        statusStyle = styles.statusInactive;
        break;
      default:
        statusLabel = item.status || "Bilinmiyor";
        statusStyle = styles.statusDefault;
        break;
    }

    return (
      <View style={styles.card}>
        <Image
          source={{ uri: item.photo_url }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.user_name_masked}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Durum:</Text>
            <Text style={[styles.statusText, statusStyle]}>{statusLabel}</Text>
          </View>
          <Text style={styles.coordinates}>
            {item.address ? `Adres: ${item.address}` : "Adres yükleniyor..."}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={fires}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFire}
        ListHeaderComponent={
          <View style={styles.logoCard}>
            <Image
              source={require("@/assets/images/logored.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>Yangın İhbarları</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Henüz yangın ihbarı bulunmamaktadır.
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF4500"]}
          />
        }
        contentContainerStyle={styles.scrollContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  scrollContainer: { padding: 16, paddingBottom: 32 },
  logoCard: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // elevation: 4,
  },
  logo: {
    width: screenWidth * 0.4,
    height: screenWidth * 0.4,
    marginBottom: 0, // eski 8 yerine 4 yaptık
  },
  headerTitle: {
    fontSize: screenWidth * 0.05,
    fontWeight: "bold",
    color: "#1A1A1A",
    textAlign: "center",
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 16, color: "#666" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "#D32F2F", textAlign: "center" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: { fontSize: 16, color: "#666", textAlign: "center" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  cardImage: {
    width: screenWidth - 32,          // FlatList paddingını çıkarıyoruz
    height: ((screenWidth - 32) * 9) / 16, // 16:9 oranında yüksekliği ayarla
    resizeMode: "contain",            // resmin tamamı gözükür
    alignSelf: "center",
  },
  cardContent: { padding: 16 },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusLabel: { fontSize: 16, color: "#666", marginRight: 8 },
  statusText: { fontSize: 16, fontWeight: "600" },
  statusActive: { color: "#fd0000ff" },
  statusPending: { color: "#0000ffdb" },
  statusInactive: { color: "#009c05ff" },
  coordinates: { fontSize: 14, color: "#666", marginBottom: 12 },
});


export default Fires;
