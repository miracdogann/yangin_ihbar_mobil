import { API_BASE_URL, SecurityUtils } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // kullanıcı bilgileri
  const [loading, setLoading] = useState(true); // veri çekiliyor mu?
  const [securityStatus, setSecurityStatus] = useState({
    isAuthenticated: false,
    tokenValid: false,
    lastActivity: null
  });

  // Güvenlik durumunu kontrol et
  const checkSecurityStatus = async () => {
    try {
      const token = await SecurityUtils.SecureTokenManager.getToken();
      const tokenData = await AsyncStorage.getItem("tokenData");
      
      let isValid = false;
      let lastActivity = null;
      
      if (token && tokenData) {
        const { expiresAt, createdAt } = JSON.parse(tokenData);
        isValid = Date.now() < expiresAt;
        lastActivity = createdAt;
      }
      
      setSecurityStatus({
        isAuthenticated: !!token,
        tokenValid: isValid,
        lastActivity
      });
      
      return isValid;
    } catch (error) {
      console.error("Security status check error:", error);
      return false;
    }
  };

  const fetchUser = async () => {
    try {
      console.log("=== USER DATA FETCH START ===");
      
      const token = await SecurityUtils.SecureTokenManager.getToken();
      console.log("Token found:", token ? "Yes" : "No");
      
      if (!token) {
        console.log("No token found, using fallback data");
        // Token yoksa fallback data kullan
        setUser({
          name_surname: "Test Kullanıcı",
          phone_number: "0505 123 45 67",
          email: "test@example.com"
        });
        setLoading(false);
        console.log("=== USER DATA FETCH END (FALLBACK) ===");
        return;
      }

      // Token varsa API'den veri çekmeye çalış
      try {
        console.log("Attempting API call to:", `${API_BASE_URL}user-info/`);
        const response = await axios.get(`${API_BASE_URL}user-info/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Request-ID': Date.now().toString(),
            'X-Timestamp': Date.now().toString(),
          },
          timeout: 10000,
        });

        console.log("API Response Status:", response.status);
        console.log("API Response Data:", response.data);
        setUser(response.data);
        
        // Son aktivite zamanını güncelle
        await AsyncStorage.setItem("lastActivity", Date.now().toString());
        console.log("=== USER DATA FETCH END (SUCCESS) ===");
        
      } catch (apiError) {
        console.error("API Error Details:", {
          message: apiError.message,
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data
        });
        
        // 401 hatası durumunda token'ları temizle
        if (apiError.response?.status === 401) {
          console.log("401 error, clearing tokens");
          await SecurityUtils.SecureTokenManager.clearTokens();
          setSecurityStatus({
            isAuthenticated: false,
            tokenValid: false,
            lastActivity: null
          });
        }
        
        // API hatası durumunda fallback data kullan
        setUser({
          name_surname: "Test Kullanıcı",
          phone_number: "0505 123 45 67",
          email: "test@example.com"
        });
        console.log("=== USER DATA FETCH END (API ERROR - FALLBACK) ===");
      }
      
    } catch (error) {
      console.error("General error in fetchUser:", error.message);
      
      // Herhangi bir hata durumunda fallback data kullan
      setUser({
        name_surname: "Test Kullanıcı",
        phone_number: "0505 123 45 67",
        email: "test@example.com"
      });
      console.log("=== USER DATA FETCH END (GENERAL ERROR - FALLBACK) ===");
    } finally {
      setLoading(false);
    }
  };

  // Güvenli logout fonksiyonu
  const secureLogout = async () => {
    try {
      await SecurityUtils.SecureTokenManager.clearTokens();
      await AsyncStorage.removeItem("lastActivity");
      setUser(null);
      setSecurityStatus({
        isAuthenticated: false,
        tokenValid: false,
        lastActivity: null
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Aktivite takibi
  const updateActivity = async () => {
    try {
      await AsyncStorage.setItem("lastActivity", Date.now().toString());
    } catch (error) {
      console.error("Activity update error:", error);
    }
  };

  // Inactivity timeout kontrolü (30 dakika)
  const checkInactivity = async () => {
    try {
      const lastActivity = await AsyncStorage.getItem("lastActivity");
      if (lastActivity) {
        const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
        const thirtyMinutes = 30 * 60 * 1000;
        
        if (timeSinceLastActivity > thirtyMinutes) {
          console.log("Inactivity timeout, logging out user");
          await secureLogout();
        }
      }
    } catch (error) {
      console.error("Inactivity check error:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    
    // Periyodik güvenlik kontrolleri (daha az sıklıkta)
    const securityInterval = setInterval(async () => {
      await checkInactivity();
      await checkSecurityStatus();
    }, 300000); // Her 5 dakika kontrol et
    
    return () => clearInterval(securityInterval);
  }, []);

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      securityStatus,
      refreshUser: fetchUser, 
      secureLogout,
      updateActivity,
      checkSecurityStatus
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
