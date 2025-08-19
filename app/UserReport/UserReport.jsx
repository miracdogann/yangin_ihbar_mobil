import { getFireReportUser } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  Dimensions
} from "react-native";
import { Button } from "react-native-paper";

const { width: screenWidth } = Dimensions.get("window");

const STATUS_COLORS = {
  pending: "#FFA500",
  completed: "#28a745",
  rejected: "#dc3545",
  default: "#6c757d",
};

const API_KEY = "vxNgHq8W1x8soPbMdhwWqgyDrT6ZVMXf"; // TomTom API key

const UserReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

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

  const fetchUserReports = async () => {
    setError(null);
    setFetchingLocation(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setError("Token bulunamadı, lütfen giriş yapınız.");
        setLoading(false);
        return;
      }

      const data = await getFireReportUser(token);

      // Adresleri kontrol et ve gerekirse TomTom API'den al
      const settledReports = await Promise.allSettled(
        data.map(async (report) => {
          // Eğer address null değilse, doğrudan kullan
          if (report.address) {
            return report;
          }
          // Address null ise TomTom API'den adres al
          const address = await getAddressFromCoords(
            report.latitude,
            report.longitude
          );
          return { ...report, address };
        })
      );

      const reportsWithAddress = settledReports.map((r) =>
        r.status === "fulfilled"
          ? r.value
          : { ...r.reason, address: "Adres alınamadı" }
      );

      setReports(reportsWithAddress);
    } catch (err) {
      console.error(err);
      setError("Veri alınırken hata oluştu.");
    } finally {
      setLoading(false);
      setRefreshing(false);
      setFetchingLocation(false);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    fetchUserReports();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserReports();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          mode="contained"
          onPress={fetchUserReports}
          buttonColor="#1E90FF"
          style={styles.retryButton}
          contentStyle={{ paddingVertical: 8 }}
        >
          Tekrar Dene
        </Button>
      </View>
    );
  }

  const renderStatusBadge = (status) => {
    if (!status) return null;
    const color = STATUS_COLORS[status.toLowerCase()] || STATUS_COLORS.default;
    return (
      <View style={[styles.statusBadge, { backgroundColor: color }]}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    );
  };

  const renderReport = ({ item }) => (
    <View style={styles.reportCard}>
      <Text style={styles.title}>İhbar ID: {item.id}</Text>
      {item.photo_url && (
        <Image
          source={{ uri: item.photo_url }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.infoRow}>
        <Text style={styles.label}>Adres:</Text>
        <Text style={styles.value}>
          {item.address || "Adres yükleniyor..."}
        </Text>
      </View>
      {renderStatusBadge(item.status)}
      {item.date && (
        <Text style={styles.date}>
          Tarih:{" "}
          {new Date(item.date).toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {fetchingLocation && (
        <Animated.View style={[styles.locationOverlay, { opacity: fadeAnim }]}>
          <ActivityIndicator size="large" color="#1E90FF" />
          <Text style={styles.locationText}>Konum alınırken...</Text>
        </Animated.View>
      )}
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReport}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Gösterilecek ihbar bulunamadı.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1E90FF"]}
          />
        }
        contentContainerStyle={reports.length === 0 && styles.flatListEmpty}
      />
      <Button
        mode="contained"
        onPress={() => router.back()}
        buttonColor="#0000ff"
        style={styles.backButton}
        contentStyle={{ paddingVertical: 12 }}
      >
        Geri Dön
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6fa", paddingTop: 8 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#1E90FF",
    fontWeight: "600",
  },
  errorText: {
    color: "#dc3545",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  retryButton: { alignSelf: "center", borderRadius: 30, elevation: 3 },
  reportCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 20,
    marginVertical: 8,
    width: screenWidth * 0.9, // ekranın %90’ı
    alignSelf: "center",       // ortala
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  title: { fontWeight: "700", fontSize: 18, marginBottom: 12, color: "#222" },
  image: {
    width: "100%",             // kartın tamamını kapla
    height: (screenWidth * 0.9) * 0.6, // 3:2 oran
    borderRadius: 12,
    marginBottom: 15,
    alignSelf: "center",
  },
  infoRow: { flexDirection: "row", marginBottom: 6 },
  label: { fontWeight: "600", color: "#555", width: 80 },
  value: { color: "#333", flexShrink: 1 },
  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  statusText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    textTransform: "capitalize",
  },
  date: { marginTop: 10, color: "#666", fontStyle: "italic" },
  emptyText: { fontSize: 16, color: "#888", fontWeight: "500" },
  flatListEmpty: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: { margin: 16, borderRadius: 30, elevation: 3 },
  locationOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  locationText: {
    marginTop: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default UserReports;
