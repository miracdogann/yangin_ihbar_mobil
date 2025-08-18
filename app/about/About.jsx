import React, { useMemo } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const teamMembers = [
  {
    name: "Burak Efe Kılıç",
    role: "Frontend Developer",
    description: "Web Site ve Mobil Uygulama Geliştirme",
    image:
      "https://raw.githubusercontent.com/miracdogann/yangin_ihbar_app/refs/heads/songuncel/public/images/about/burak.png",
  },
  {
    name: "Fevzi Bağrıaçık",
    role: "Backend Developer",
    description: "Web Site ve Mobil Uygulama Geliştirme",
    image:
      "https://raw.githubusercontent.com/miracdogann/yangin_ihbar_app/refs/heads/songuncel/public/images/about/fevzi.jpg",
  },
  {
    name: "Kerem Işık",
    role: "Siber Güvenlik Uzmanı",
    description: "Yangın verileri analizi ve modelleme uzmanı",
    image:
      "https://raw.githubusercontent.com/miracdogann/yangin_ihbar_app/refs/heads/songuncel/public/images/about/kerem.jpg",
  },
  {
    name: "Mehmet Kıvrak",
    role: "Frontend Developer",
    description: "Web Site ve Mobil Uygulama Geliştirme",
    image:
      "https://raw.githubusercontent.com/miracdogann/yangin_ihbar_app/refs/heads/songuncel/public/images/about/Mehmet.jpg",
  },
  {
    name: "Miraç Doğan",
    role: "Yazılım Geliştirici",
    description: "Uzman yazılım geliştirici ve sistem mimarı",
    image:
      "https://raw.githubusercontent.com/miracdogann/yangin_ihbar_app/refs/heads/songuncel/public/images/about/mirac.jpg",
  },
  {
    name: "Tolga Yılmaz",
    role: "Mobil Uygulama Geliştirici",
    description: "Yangın verileri analizi ve modelleme uzmanı",
    image:
      "https://raw.githubusercontent.com/miracdogann/yangin_ihbar_app/refs/heads/songuncel/public/images/about/tolga.png",
  },
];

function shuffleArray(array) {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const About = ({ visible, onClose }) => {
  // useMemo ile modal her açıldığında karışık sıra oluştur
  const shuffledTeam = useMemo(() => shuffleArray(teamMembers), [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <ScrollView style={styles.container}>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✖ Kapat</Text>
        </Pressable>

        <View style={styles.headerContainer}>
          <Text style={styles.badge}>🔥 Yangın İhbar Sistemi</Text>
          <Text style={styles.title}>Hakkımızda</Text>
          <Text style={styles.subtitle}>
            Teknoloji ile{" "}
            <Text style={styles.highlight}>hayat kurtarıyoruz</Text>
          </Text>
          <Text style={styles.description}>
            YiSiS (Yangın İhbar Sistemi), modern teknoloji ve yapay zeka
            destekli çözümlerle yangın tespiti ve erken uyarı hizmetleri sunan
            yenilikçi bir platformdur. Amacımız, can ve mal güvenliğini en üst
            seviyede korumaktır.
          </Text>
        </View>

        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>🚨</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>2024</Text>
              <Text style={styles.statLabel}>Kuruluş Yılı</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Aktif Proje</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Ekibimiz</Text>
        <View style={styles.teamContainer}>
          {shuffledTeam.map((member, index) => (
            <View key={index} style={styles.card}>
              <Image source={{ uri: member.image }} style={styles.avatar} />
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{member.role}</Text>
              <Text style={styles.memberDesc}>{member.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  closeButton: { marginTop: 50, padding: 15, alignItems: "flex-end" },
  closeText: { color: "#fff", fontSize: 16 },
  headerContainer: { padding: 20 },
  badge: {
    backgroundColor: "white",
    color: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 10,
    fontWeight: "bold",
  },
  title: { fontSize: 28, fontWeight: "bold", color: "white", marginBottom: 10 },
  subtitle: { fontSize: 20, color: "#ccc", marginBottom: 10 },
  highlight: { color: "#ffc107", fontWeight: "bold" },
  description: { fontSize: 16, color: "#bbb", lineHeight: 22, maxWidth: "95%" },
  iconContainer: { alignItems: "center", marginTop: 20 },
  iconCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  icon: { fontSize: 50 },
  statsContainer: { flexDirection: "row", justifyContent: "center", gap: 40 },
  statBox: { alignItems: "center" },
  statNumber: { color: "#ffc107", fontSize: 24, fontWeight: "bold" },
  statLabel: { color: "#ccc", fontSize: 14 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginTop: 30,
    marginBottom: 15,
    textAlign: "center",
  },
  teamContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    width: Dimensions.get("window").width / 2.2,
    margin: 8,
  },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  memberName: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  memberRole: {
    color: "#ffc107",
    fontSize: 12,
    marginBottom: 5,
    textAlign: "center",
  },
  memberDesc: { color: "#bbb", fontSize: 11, textAlign: "center" },
});

export default About;
