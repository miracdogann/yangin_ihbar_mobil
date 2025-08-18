import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TOMTOM_API_KEY = "vxNgHq8W1x8soPbMdhwWqgyDrT6ZVMXf";

const AddressPickerModal = ({ visible, onClose, onSelectCoordinates }) => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const fetchCoordinates = async () => {
    if (!address.trim()) return alert("Adres boş olamaz");
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
          address
        )}.json?key=${TOMTOM_API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setResults(data.results);
      } else {
        alert("Adres bulunamadı");
        setResults([]);
      }
    } catch (err) {
      console.error(err);
      alert("Adres sorgulanamadı");
      setResults([]);
    }
    setLoading(false);
  };

  const handleSelect = (position, addressText) => {
    onSelectCoordinates(position.lat, position.lon, addressText);
    onClose();
    setAddress("");
    setResults([]);
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

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={fetchCoordinates}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Adres alınıyor..." : "Adres Ara"}
            </Text>
          </TouchableOpacity>

          {results.length > 0 && (
            <FlatList
              data={results}
              keyExtractor={(item, index) => index.toString()}
              style={styles.resultList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultItem}
                  onPress={() =>
                    handleSelect(item.position, item.address.freeformAddress)
                  }
                >
                  <Text style={styles.resultText}>
                    {item.address.freeformAddress}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => {
              onClose();
              setAddress("");
              setResults([]);
            }}
          >
            <Text style={styles.buttonText}>İptal</Text>
          </TouchableOpacity>
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
    maxHeight: "80%",
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: "#a0cfff",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultList: {
    marginBottom: 12,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resultText: {
    fontSize: 16,
  },
});

export default AddressPickerModal;
