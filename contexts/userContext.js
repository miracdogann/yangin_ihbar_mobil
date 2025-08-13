import { API_BASE_URL } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // kullanıcı bilgileri
  const [loading, setLoading] = useState(true); // veri çekiliyor mu?
  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log("token userContext",token)
      if (!token) {
        setUser(null);
        setLoading(false);
        
        return;
      }

      const response = await axios.get(`${API_BASE_URL}user-info/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
    } catch (error) {
      console.log("Kullanıcı verisi alınamadı:", error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
