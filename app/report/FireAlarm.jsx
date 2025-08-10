import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Card, Text } from "react-native-paper";
import Toast from "react-native-toast-message";
const FireALarm = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const cameraRef = useRef(null);
  const router = useRouter();

  if (!permission)
    return (
      <View>
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

  const handleSubmit = () => {
    if (!photo) {
      setError("Lütfen tüm alanları doldurun!");
      return;
    }

    setError("");
    Toast.show({
      type: "success",
      text1: "Yangın İhbarı Yapıldı",
    });
    router.push("/(tabs)/Map");
    // Buraya backend'e gönderme işlemi eklenebilir
  };
  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <Image
        style={{ alignSelf: "center", marginTop: 15, width: 180, height: 180 }}
        source={require("@/assets/images/fullLogo.png")}
      />
      <Text style={{ alignSelf: "center", fontSize: 35, fontFamily: "Inter" }}>
        Yangın İhbarı!
      </Text>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topIcon}>
          <Image
            source={require("../../assets/icons/camera.png")}
            style={styles.logo}
          />
        </View>

        <Card style={styles.card}>
          <Card.Content>
            {!photo && (
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
                  style={styles.camera}
                  facing="back"
                />
              </>
            )}

            {photo && (
              <>
                <Image source={{ uri: photo }} style={styles.previewImage} />
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

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
              icon="check"
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
              buttonColor="#ff0000ff"
              contentStyle={styles.buttonContent}
            >
              Yangın İhbarı Yap
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },

  topIcon: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: -24,
    zIndex: 1,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // backgroundColor: "red",
  },
  logo: {
    width: 35,
    height: 35,
  },
  card: {
    // borderRadius: 12,
    padding: 8,
    elevation: 4,
    backgroundColor: "#ffffff",
  },
  button: {
    marginBottom: 16,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 4,
  },
  camera: {
    width: "100%",
    height: 300,
    marginBottom: 16,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  previewImage: {
    width: "100%",
    height: 240,
    marginBottom: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 8,
  },
  error: {
    color: "#d32f2f",
    marginBottom: 8,
    textAlign: "center",
    fontSize: 14,
  },
  message: {
    textAlign: "center",
    marginBottom: 12,
    color: "#333",
    fontSize: 16,
  },
});

export default FireALarm;
