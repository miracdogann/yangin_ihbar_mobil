import AddressPickerModal from "@/components/AddressPickerModal";
import { useUser } from "@/contexts/userContext";
import { API_BASE_URL } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Dimensions
} from "react-native";
import { Button, Card, Text } from "react-native-paper";
import Toast from "react-native-toast-message";

// Cloudinary ayarları
const CLOUD_NAME = "ddsoyw2uy";
const UPLOAD_PRESET = "fire_add";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const FireALarm = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("Konum alınmadı");
  const [token, setToken] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const { user, isLoaded } = useUser();
  const cameraRef = useRef(null);
  const router = useRouter();

  const [isModalVisible, setIsModalVisible] = useState(false);

  // Token alma
  useEffect(() => {
    (async () => {
      const storedToken = await AsyncStorage.getItem("userToken");
      setToken(storedToken);
    })();
  }, []);

  // Konum alma
  const getLocation = async () => {
    setLocationStatus("Konum alınıyor...");
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setError("Konum izni gerekli");
      setLocationStatus("Konum izni yok ❌");
      return;
    }
    try {
      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setLocationStatus("Konum doğrulandı ✅");
    } catch (err) {
      setError("Konum alınamadı");
      setLocationStatus("Konum alınamadı ❌");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  if (!permission)
    return (
      <View style={styles.container}>
        <Text>İzin Yok</Text>
      </View>
    );

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Kamera izni gerekiyor, lütfen izin verin.
        </Text>
        <Button mode="contained" onPress={requestPermission}>
          İzin Ver
        </Button>
      </View>
    );
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync();
      setPhoto(photoData.uri);
    }
  };

  const handleRetakePhoto = () => {
    setPhoto(null);
  };

  const uploadToCloudinary = async () => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: photo,
        type: "image/jpeg",
        name: "fire_alarm.jpg",
      });
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", `users/${user?.id || "unknown"}`);
      formData.append("public_id", `${Date.now()}`);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) return data.secure_url;
      throw new Error("Cloudinary yükleme hatası");
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const confirmSubmit = () => {
    Alert.alert("Yangın İhbarı", "Emin misiniz? Yangın ihbarı gönderilecek.", [
      { text: "İptal", style: "cancel" },
      { text: "Evet", onPress: () => handleSubmit() },
    ]);
  };

  const handleSubmit = async () => {
    if (!photo || !location) {
      setError("Fotoğraf ve konum gerekli");
      return;
    }
    if (!token) {
      setError("Token bulunamadı");
      return;
    }

    setSubmitting(true);
    setError("");

    const uploadedUrl = await uploadToCloudinary();
    if (!uploadedUrl) {
      setSubmitting(false);
      Toast.show({ type: "error", text1: "Fotoğraf yüklenemedi" });
      return;
    }

    try {
      const payload = {
        photo_url: uploadedUrl,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      // Eğer kullanıcı adres seçtiyse payload’a adres metnini ekle
      if (selectedAddress) {
        payload.address = selectedAddress;
      }

      const response = await fetch(`${API_BASE_URL}fire-report/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Toast.show({ type: "success", text1: "Yangın İhbarı Yapıldı" });
        router.push("/(tabs)/Map");
      } else {
        const errorData = await response.json();
        let errorMessage = errorData.error || "İhbar gönderilemedi";
        let errorDetail = errorData.detail || "";

        // Yangın tespit edilmediyse özel bir mesaj göster
        if (errorMessage === "Yangın tespit edilmedi, ihbar yapılamaz.") {
          errorDetail =
            "Lütfen yangın yoğun duman vb  içeren bir fotoğraf yükleyin.";
        } else if (errorMessage === "Tüm alanlar gerekli") {
          errorDetail = "Fotoğraf, enlem ve boylam bilgilerini kontrol edin.";
        } else if (
          errorMessage === "Authorization header missing or invalid" ||
          errorMessage === "Invalid token"
        ) {
          errorDetail = "Lütfen tekrar giriş yapmayı deneyin.";
        }

        Toast.show({
          type: "error",
          text1: errorMessage,
          text2: errorDetail,
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({ type: "error", text1: "Sunucu hatası" });
    }

    setSubmitting(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-start",
          paddingBottom: 30,
          minHeight: screenHeight,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          style={[
            styles.logo,
            { width: screenWidth * 0.5, height: screenWidth * 0.5, marginTop: 10 },
          ]}
          source={require("@/assets/images/fullLogo.png")}
        />
        <Text
          style={[
            styles.title,
            { fontSize: Math.round(screenWidth * 0.09), marginBottom: 8 },
          ]}
        >
          Yangın İhbarı!
        </Text>

        <Card style={styles.card}>
          <Button
            style={{
              marginBottom: 10,
              backgroundColor: "#0000ff06",
              width: screenWidth * 0.5,
              alignSelf: "center",
            }}
            onPress={() => router.back()}
            textColor="#0000ff"
          >
            Geri Dön
          </Button>
          <Card.Content>
            {!photo ? (
              <>
                <Button
                  icon="camera"
                  mode="contained"
                  buttonColor="#0000FF"
                  onPress={handleTakePhoto}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                >
                  Fotoğraf Çek
                </Button>
                <CameraView
                  ref={cameraRef}
                  style={[styles.camera, { height: screenWidth * 0.6 }]}
                  facing="back"
                />
              </>
            ) : (
              <>
                <Image
                  source={{ uri: photo }}
                  style={[styles.previewImage, { height: screenWidth * 0.6 }]}
                />
                <Button
                  icon="camera-retake"
                  mode="contained"
                  buttonColor="#0000FF"
                  onPress={handleRetakePhoto}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                >
                  Tekrar Çek
                </Button>
              </>
            )}

            <Button
              mode="outlined"
              onPress={getLocation}
              style={styles.button}
              disabled={submitting || locationStatus === "Konum doğrulanıyor..."}
            >
              {locationStatus || "Konumu Doğrula"}
            </Button>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
              mode="outlined"
              onPress={() => setIsModalVisible(true)}
              style={styles.button}
              disabled={submitting}
            >
              Adres Girerek Konum Seç
            </Button>

            <Text>
              {selectedAddress ? (
                <Text style={styles.selectedAddress}>
                  Seçilen Adres: {selectedAddress}
                </Text>
              ) : null}
            </Text>
            <Button
              icon={submitting ? "progress-clock" : "check"}
              mode="contained"
              onPress={confirmSubmit}
              style={styles.submitButton}
              buttonColor="#D32F2F"
              contentStyle={styles.buttonContent}
              disabled={submitting}
            >
              {submitting ? "Gönderiliyor..." : "Yangın İhbarı Yap"}
            </Button>
          </Card.Content>

          <AddressPickerModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            onSelectCoordinates={(lat, lon, addressText) => {
              setLocation({ latitude: lat, longitude: lon });
              setSelectedAddress(addressText);
              setLocationStatus("Konum doğrulandı ✅");
            }}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#f5f5f5", padding: 10 },
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  logo: { alignSelf: "center" },
  title: {
    alignSelf: "center",
    fontFamily: "Inter",
  },
  card: {
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: { marginBottom: 16, borderRadius: 8 },
  buttonContent: { paddingVertical: 6 },
  camera: {
    width: "100%",
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    marginBottom: 16,
    borderRadius: 12,
  },
  submitButton: { marginTop: 8, borderRadius: 8 },
  error: { color: "#d32f2f", marginBottom: 8, textAlign: "center" },
  locationStatus: {
    textAlign: "center",
    marginBottom: 8,
    color: "#1E88E5",
    fontWeight: "500",
  },
  selectedAddress: {
    fontSize: 16,
    marginVertical: 8,
    textAlign: "center",
    color: "#333",
  },
});

export default FireALarm;
