import { getStations } from "@/services/api";
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
const generateHtml = ({ apiKey, lat, lng, zoom, stations }) => `
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
          display: none !important; /* TomTom logosunu gizle (opsiyonel, lisans koşullarına dikkat) */
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
        const myloc = document.createElement('img');
        myloc.src = '${MY_LOCATION_ICON_URL}';
        myloc.className = 'custom-icon';
        new tt.Marker({ element: myloc })
          .setLngLat([${lng}, ${lat}])
          .setPopup(new tt.Popup({ offset: 30 }).setText('Konumum'))
          .addTo(map);
        const stations = ${JSON.stringify(stations)};
        stations.forEach(station => {
          const el = document.createElement('img');
          el.src = '${STATION_ICON_URL}';
          el.className = 'custom-icon';
          new tt.Marker({ element: el })
            .setLngLat([station.longitude, station.latitude])
            .setPopup(new tt.Popup({ offset: 30 }).setText(station.name))
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
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  // İstasyon verilerini alma
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await getStations();
        setStations(response.data || dummyStations); // API başarısızsa dummy veriler
        console.log("İstasyonlar:", response.data);
      } catch (err) {
        setError(err);
        console.error("İstasyon verileri alınamadı:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
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
            Linking.openSettings();
            return;
          }
        }

        // 1. Hızlı ilk konum alımı
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          maximumAge: 10000,
          timeout: 5000, // timeout ekledim
        });
        setLocation(location);
        console.log("İlk konum bilgileri:", location.coords);

        // 2. Konum değişikliklerini takip et
        subscriber = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 10, // 10 metre hareket ettikten sonra güncelle
            timeInterval: 5000, // 5 saniyede bir güncelleme (opsiyonel)
          },
          (loc) => {
            setLocation(loc);
            console.log("Konum güncellendi:", loc.coords);
          }
        );
      } catch (err) {
        setError(err);
        console.error("Konum alınamadı:", err);
      }
    };

    checkAndRequestLocation();

    // Cleanup: bileşen kapanınca watch aboneliğini kaldır
    return () => {
      if (subscriber) {
        subscriber.remove();
      }
    };
  }, []);

  // Yükleme veya konum bekleme durumu
  if (loading || !location) {
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
    lat: location.coords.latitude,
    lng: location.coords.longitude,
    zoom,
    stations,
  });

  // Buton aksiyonları
  const handleCallPress = () => {
    console.log("Arama butonuna tıklandı");
    Linking.openURL("tel:+1234567890"); // Gerçek telefon numarası ile değiştirin
  };

  const handleAddFirePress = () => {
    console.log("Yangın ihbarı butonuna tıklandı");
    router.navigate("/report/FireAlarm");
    // TODO: Yangın ihbarı için API çağrısı veya başka bir işlevsellik
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
