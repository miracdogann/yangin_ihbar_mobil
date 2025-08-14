import React, { useState } from "react";
import { Modal, View, Text, TextInput, Button, StyleSheet } from "react-native";

const TOMTOM_API_KEY = "vxNgHq8W1x8soPbMdhwWqgyDrT6ZVMXf";

const AddressPickerModal = ({ visible, onClose, onSelectCoordinates }) => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCoordinates = async () => {
    if (!address.trim()) return alert("Adres boş olamaz");
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(address)}.json?key=${TOMTOM_API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const { lat, lon } = data.results[0].position;
        onSelectCoordinates(lat, lon); // Parent’a gönder
        onClose();
        setAddress("");
      } else {
        alert("Adres bulunamadı");
      }
    } catch (err) {
      console.error(err);
      alert("Adres sorgulanamadı");
    }
    setLoading(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Adres Gir</Text>
          <TextInput
            style={styles.input}
            placeholder="Adresinizi girin"
            value={address}
            onChangeText={setAddress}
          />
          <View style={{marginBottom:12}}>
            <Button
            title={loading ? "Adres alınıyor..." : "Adres Seç"}
            onPress={fetchCoordinates}
            disabled={loading}
          />
          </View>
          <Button title="İptal" onPress={() => { onClose(); setAddress(""); }} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  title: { fontSize: 20, marginBottom: 12, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 12,
    borderRadius: 6,
  },
});

export default AddressPickerModal;
