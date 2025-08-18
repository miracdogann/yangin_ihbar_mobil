import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const infoData = [
  {
    title: "Proje Tanımı",
    content: `YiSiS, vatandaşların orman/ev yangınlarını mobil uygulama üzerinden fotoğraf ve konumla bildirebildiği, bu verilerin gerçek zamanlı olarak harita üzerinde görüntülenebildiği bir sistemdir. Web uygulaması sadece harita ve bilgilendirme ekranlarını içerir, mobil uygulama ise kullanıcıların aktif olarak ihbar yapabileceği ve bildirim alabileceği sistemdir.`,
  },
  {
    title: "Fonksiyonel Gereksinimler",
    content: `- Kullanıcılar mobil uygulamada kayıt olabilir.\n- Yangın gördüğünde fotoğraf ve konum ile ihbar yapabilir.\n- Anlık bildirimler alabilir.\n- Harita üzerinde NASA verileri, mevcut yangınlar ve itfaiye konumları görüntülenebilir.\n- Yangın ihbarının durumu: "Devam Ediyor / Müdahale Ediliyor / Söndürüldü".\n- Yangın önleme içerikleri ve en yakın itfaiye konumları gösterilir.\n- Asılsız ihbar yapan kullanıcı tespit edilebilir.`,
  },
  {
    title: "Fonksiyonel Olmayan Gereksinimler",
    content: `- Firebase ile anlık bildirim gönderebilmelidir.\n- Gerçek zamanlı konum takibi olmalıdır.\n- Arayüz sade ve hızlı olmalıdır.\n- Her ihbar loglanmalı, silinmemelidir.\n- Asılsız ihbarlar kontrol edilmeli ve önlem alınmalıdır.\n- Web uygulaması sadece görüntüleme amaçlıdır.`,
  },
  {
    title: "Kullanıcı Tipleri",
    content: `- Vatandaş: Kayıt olur, ihbar yapar, haritayı ve içerikleri görüntüler.\n- Ziyaretçi: Web üzerinden sadece haritayı ve bilgilendirme içeriklerini görüntüler.\n- Sistem Yöneticisi (Opsiyonel): İhbarları filtreleyebilir, asılsız ihbarları işleyebilir.`,
  },
  {
    title: "KVKK & Güvenlik",
    content: `- Kullanıcı rızası alınmalı (KVKK uyumu).\n- Konum, e-posta ve telefon şifreli tutulmalı.\n- İhbarlar zaman damgası ile kaydedilmeli.\n- Asılsız ihbar yapan kullanıcılar uyarılabilir veya hesap askıya alınabilir.`,
  },
];

const Info = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.mainTitle}>🔥 Yangın Bilgilendirme Sistemi</Text>
          <ScrollView style={styles.scroll}>
            {infoData.map((section, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.cardTitle}>{section.title}</Text>
                <Text style={styles.cardContent}>{section.content}</Text>
              </View>
            ))}
          </ScrollView>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Kapat</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default Info;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 15,
  },
  mainTitle: {
    color: "#ffc107",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  scroll: {
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardContent: {
    color: "#ccc",
    fontSize: 13,
    lineHeight: 18,
  },
  closeButton: {
    backgroundColor: "#1976d2",
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
  },
});
