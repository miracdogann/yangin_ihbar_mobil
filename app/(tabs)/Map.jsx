import { getFireReportAll, getStations } from "@/services/api";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ActivityIndicator,
  MD2Colors,
  Text as PaperText,
} from "react-native-paper";
import { WebView } from "react-native-webview";

// Sabitler
const DEFAULT_API_KEY = "vxNgHq8W1x8soPbMdhwWqgyDrT6ZVMXf";
const DEFAULT_LATITUDE = 38.6191;
const DEFAULT_LONGITUDE = 27.4222;
const DEFAULT_ZOOM = 13;
const BUTTON_SIZE = 50;
const ICON_SIZE = 40;
const MY_LOCATION_ICON_URL =
  "https://raw.githubusercontent.com/miracdogann/sanayi-rehberi-img/refs/heads/main/myloc2.png";
const STATION_ICON_URL =
  "https://raw.githubusercontent.com/miracdogann/sanayi-rehberi-img/refs/heads/main/fire-station.png";

const Fire_URL =
  "https://raw.githubusercontent.com/miracdogann/sanayi-rehberi-img/refs/heads/main/fireR.gif";

// Yeniden kullanılabilir RoundButton bileşeni
const RoundButton = ({
  onPress,
  iconSource,
  text,
  style,
  accessibilityLabel,
}) => (
  <TouchableOpacity
    style={[styles.roundButton, style]}
    onPress={onPress}
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="button"
  >
    {text && <Text style={styles.buttonText}>{text}</Text>}
    {iconSource && (
      <Image source={iconSource} style={styles.icon} resizeMode="contain" />
    )}
  </TouchableOpacity>
);

// Harita HTML içeriğini oluşturan fonksiyon
const generateHtml = ({ apiKey, lat, lng, zoom, stations, fireReports }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.14.0/maps/maps-web.min.js"></script>
      <link rel="stylesheet" type="text/css" href="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.14.0/maps/maps.css"/>
      <style>
        html, body, #map {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
        }
        .tt-logo, .tt-attribution {
          display: none !important;
        }
        .custom-icon {
          width: ${ICON_SIZE}px;
          height: ${ICON_SIZE}px;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        window.onerror = function(message, source, lineno, colno, error) {
          window.ReactNativeWebView.postMessage('Hata: ' + message);
        };
        
        const map = tt.map({
          key: '${apiKey}',
          container: 'map',
          center: [${lng}, ${lat}],
          zoom: ${zoom},
          dragPan: true,
          scrollZoom: { around: 'center' }
        });
        
        map.on('load', () => {
          window.ReactNativeWebView.postMessage('Harita yüklendi!');
        });
        
        map.on('error', (err) => {
          window.ReactNativeWebView.postMessage('Harita Hatası: ' + err.message);
        });
        
        // Kullanıcı konumu
        const myloc = document.createElement('img');
        myloc.src = '${MY_LOCATION_ICON_URL}';
        myloc.className = 'custom-icon';
        new tt.Marker({ element: myloc })
          .setLngLat([${lng}, ${lat}])
          .setPopup(new tt.Popup({ offset: 30 }).setText('Konumum'))
          .addTo(map);

        // İtfaiye istasyonları
        const stations = ${JSON.stringify(stations || [])};
        stations.forEach(station => {
          const el = document.createElement('img');
          el.src = '${STATION_ICON_URL}';
          el.className = 'custom-icon';
          new tt.Marker({ element: el })
            .setLngLat([station.longitude, station.latitude])
            .setPopup(new tt.Popup({ offset: 30 }).setText(station.name))
            .addTo(map);
        });

        // Yangın ihbarları
        const fireReports = ${JSON.stringify(fireReports || [])};
        fireReports.forEach(fireReport => {
          const fire_gif = document.createElement('img');
          fire_gif.src = '${Fire_URL}';
          fire_gif.className = 'custom-icon';
          new tt.Marker({ element: fire_gif })
            .setLngLat([fireReport.longitude, fireReport.latitude])
            .setPopup(new tt.Popup({ offset: 30 }).setText(fireReport.description || 'Yangın İhbarı'))
            .addTo(map);
        });
      </script>
    </body>
  </html>
`;

const Map = ({
  apiKey = DEFAULT_API_KEY,
  latitude = DEFAULT_LATITUDE,
  longitude = DEFAULT_LONGITUDE,
  zoom = DEFAULT_ZOOM,
}) => {
  const [stations, setStations] = useState([]);
  const [fireReports, setFireReports] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // İstasyon verilerini alma
  useEffect(() => {
    const fetchStations = async () => {
      try {
        console.log("Fetching stations data...");
        const response = await getStations();
        console.log("Stations response:", response.data);
        setStations(response.data || []);
      } catch (err) {
        console.error("İstasyon verileri alınamadı:", err);
        // Fallback data
        setStations([
          {
            id: 1,
            name: "İzmir İtfaiye Müdürlüğü",
            latitude: 38.4192,
            longitude: 27.1287,
            address: "Konak, İzmir"
          },
          {
            id: 2,
            name: "Bornova İtfaiye İstasyonu",
            latitude: 38.4698,
            longitude: 27.2127,
            address: "Bornova, İzmir"
          }
        ]);
      }
    };
    fetchStations();
  }, []);

  // Yangın ihbarlarını alma
  useEffect(() => {
    const fetchFireReports = async () => {
      try {
        console.log("Fetching fire reports...");
        const response = await getFireReportAll();
        console.log("Fire reports response:", response.data);
        setFireReports(response.data || []);
      } catch (err) {
        console.error("Yangın ihbarları alınamadı:", err);
        // Fallback data
        setFireReports([
          {
            id: 1,
            description: "Test yangın ihbarı",
            latitude: 38.4192,
            longitude: 27.1287,
            status: "active",
            created_at: new Date().toISOString()
          }
        ]);
      }
    };
    fetchFireReports();
  }, []);

  // Kullanıcı konumunu alma
  useEffect(() => {
    let subscriber;

    const checkAndRequestLocation = async () => {
      try {
        let { status } = await Location.getForegroundPermissionsAsync();
        if (status !== "granted") {
          const { status: newStatus } =
            await Location.requestForegroundPermissionsAsync();
          if (newStatus !== "granted") {
            setError(new Error("Konum izni reddedildi"));
            // Fallback location
            setLocation({
              coords: {
                latitude: DEFAULT_LATITUDE,
                longitude: DEFAULT_LONGITUDE
              }
            });
            setLoading(false);
            return;
          }
        }

        // 1. Hızlı ilk konum alımı
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          maximumAge: 10000,
          timeout: 5000,
        });
        setLocation(location);
        console.log("İlk konum bilgileri:", location.coords);

        // 2. Konum değişikliklerini takip et
        subscriber = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 10,
            timeInterval: 5000,
          },
          (loc) => {
            setLocation(loc);
            console.log("Konum güncellendi:", loc.coords);
          }
        );
      } catch (err) {
        console.error("Konum alınamadı:", err);
        // Fallback location
        setLocation({
          coords: {
            latitude: DEFAULT_LATITUDE,
            longitude: DEFAULT_LONGITUDE
          }
        });
      } finally {
        setLoading(false);
      }
    };

    checkAndRequestLocation();

    // Cleanup
    return () => {
      if (subscriber) {
        subscriber.remove();
      }
    };
  }, []);

  // Yükleme durumu
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          animating={true}
          color={MD2Colors.red800}
          size="large"
        />
        <PaperText style={styles.statusText}>
          Konum ve harita yükleniyor...
        </PaperText>
      </View>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <PaperText style={styles.statusText}>Hata: {error.message}</PaperText>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
            setLocation(null);
          }}
        >
          <PaperText style={styles.retryButtonText}>Tekrar Dene</PaperText>
        </TouchableOpacity>
      </View>
    );
  }

  // Harita HTML içeriği
  const htmlContent = generateHtml({
    apiKey,
    lat: location?.coords?.latitude || DEFAULT_LATITUDE,
    lng: location?.coords?.longitude || DEFAULT_LONGITUDE,
    zoom,
    stations,
    fireReports,
  });

  // Buton aksiyonları
  const handleCallPress = () => {
    console.log("Arama butonuna tıklandı");
    Linking.openURL("tel:112");
  };

  const handleAddFirePress = () => {
    console.log("Yangın ihbarı butonuna tıklandı");
    router.navigate("/report/FireAlarm");
  };

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error("WebView Hatası:", nativeEvent);
          setError(new Error("Harita yüklenemedi"));
        }}
        onMessage={(event) => {
          console.log("WebView Mesajı:", event.nativeEvent.data);
        }}
      />
      <RoundButton
        iconSource={require("@/assets/icons/call.png")}
        onPress={handleCallPress}
        style={styles.callButton}
        accessibilityLabel="Acil arama yap"
      />
      <RoundButton
        iconSource={require("@/assets/icons/addFire.png")}
        text="Yangın İhbarı Ver!"
        onPress={handleAddFirePress}
        style={styles.addFireButton}
        accessibilityLabel="Yangın ihbarı ver"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    height: "100%",
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  roundButton: {
    position: "absolute",
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(249, 249, 250, 0.75)",
    zIndex: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  callButton: {
    bottom: 150,
    left: 20,
  },
  addFireButton: {
    bottom: 150,
    right: 20,
    flexDirection: "row",
    paddingHorizontal: 10,
    width: "auto",
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  buttonText: {
    color: MD2Colors.red800,
    fontSize: 14,
    fontWeight: "600",
    marginRight: 5,
  },
  statusText: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: MD2Colors.red800,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Map;
