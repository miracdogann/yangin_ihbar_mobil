// app/[...catchall].jsx
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function CatchAll() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sayfa Bulunamadı</Text>
      <Pressable onPress={() => router.back()} style={styles.button}>
        <Text style={styles.buttonText}> Geri Dön</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { color: "white", fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  button: { backgroundColor: "#007bff", padding: 10, borderRadius: 8 },
  buttonText: { color: "#fff", fontSize: 16 },
});
