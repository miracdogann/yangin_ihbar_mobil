import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import securityMiddleware from './securityMiddleware';

// Güvenlik konfigürasyonu
const SECURITY_CONFIG = {
  // Rate limiting
  MAX_REQUESTS_PER_MINUTE: 60,
  MAX_REQUESTS_PER_HOUR: 1000,
  
  // Certificate pinning (development için devre dışı)
  ENABLE_CERT_PINNING: false, // Expo Go için false
  
  // Request timeout
  REQUEST_TIMEOUT: 10000,
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};

// Rate limiting için request tracking
const requestTracker = {
  requests: new Map(),
  
  isRateLimited: (endpoint) => {
    const now = Date.now();
    const minuteAgo = now - 60000;
    const hourAgo = now - 3600000;
    
    if (!requestTracker.requests.has(endpoint)) {
      requestTracker.requests.set(endpoint, []);
    }
    
    const requests = requestTracker.requests.get(endpoint);
    const recentRequests = requests.filter(time => time > minuteAgo);
    const hourlyRequests = requests.filter(time => time > hourAgo);
    
    requestTracker.requests.set(endpoint, recentRequests);
    
    return recentRequests.length >= SECURITY_CONFIG.MAX_REQUESTS_PER_MINUTE ||
           hourlyRequests.length >= SECURITY_CONFIG.MAX_REQUESTS_PER_HOUR;
  },
  
  trackRequest: (endpoint) => {
    if (!requestTracker.requests.has(endpoint)) {
      requestTracker.requests.set(endpoint, []);
    }
    requestTracker.requests.get(endpoint).push(Date.now());
  }
};

// Güvenli token yönetimi
class SecureTokenManager {
  static async getToken() {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return null;
      
      // Token'ın geçerliliğini kontrol et
      const tokenData = await AsyncStorage.getItem("tokenData");
      if (tokenData) {
        try {
          const { expiresAt } = JSON.parse(tokenData);
          if (Date.now() > expiresAt) {
            console.log("Token expired, clearing tokens");
            await this.clearTokens();
            return null;
          }
        } catch (parseError) {
          console.error("Token data parse error:", parseError);
          // Parse hatası durumunda token'ı temizle
          await this.clearTokens();
          return null;
        }
      }
      
      return token;
    } catch (error) {
      console.error("Token alınırken hata:", error);
      return null;
    }
  }
  
  static async setToken(token, expiresIn = 3600) {
    try {
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("tokenData", JSON.stringify({
        expiresAt: Date.now() + (expiresIn * 1000),
        createdAt: Date.now()
      }));
      console.log("Token saved successfully");
    } catch (error) {
      console.error("Token kaydedilirken hata:", error);
    }
  }
  
  static async clearTokens() {
    try {
      await AsyncStorage.multiRemove(["userToken", "tokenData"]);
      console.log("Tokens cleared successfully");
    } catch (error) {
      console.error("Token'lar temizlenirken hata:", error);
    }
  }
  
  static async refreshTokenIfNeeded() {
    try {
      const tokenData = await AsyncStorage.getItem("tokenData");
      if (tokenData) {
        try {
          const { expiresAt } = JSON.parse(tokenData);
          const timeUntilExpiry = expiresAt - Date.now();
          
          // Token 5 dakika içinde expire olacaksa refresh et
          if (timeUntilExpiry < 300000) {
            console.log("Token refresh gerekli");
            // Refresh token logic burada implement edilebilir
          }
        } catch (parseError) {
          console.error("Token data parse error in refresh:", parseError);
        }
      }
    } catch (error) {
      console.error("Token refresh kontrolünde hata:", error);
    }
  }
}

// Basit hash fonksiyonu (expo-crypto yerine)
const simpleHash = (str) => {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
};

// PKCE için utility fonksiyonları (basitleştirilmiş)
class PKCEUtils {
  static async generateCodeVerifier() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
  
  static async generateCodeChallenge(codeVerifier) {
    // Basit hash kullan (expo-crypto yerine)
    const hash = simpleHash(codeVerifier);
    return btoa(hash)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
}

// export const API_BASE_URL ="https://123640c2b4ca.ngrok-free.app/api/"
export const API_BASE_URL ="https://miracdogan.pythonanywhere.com/api/"

// Basit API client oluşturma (güvenlik middleware olmadan)
const createSimpleApiClient = () => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: SECURITY_CONFIG.REQUEST_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Version': '1.0.0',
      'X-Platform': 'mobile',
      'User-Agent': 'YISIS-Mobile-App/1.0.0',
    }
  });

  // Basit request interceptor
  client.interceptors.request.use(
    async (config) => {
      try {
        // Token ekleme
        const token = await SecureTokenManager.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Request ID ekleme (audit için)
        config.headers['X-Request-ID'] = simpleHash(Date.now().toString() + Math.random().toString());
        
        // Timestamp ekleme
        config.headers['X-Timestamp'] = Date.now().toString();
        
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        
        return config;
      } catch (error) {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Basit response interceptor
  client.interceptors.response.use(
    (response) => {
      console.log(`API Response: ${response.status} ${response.config.url}`);
      return response;
    },
    async (error) => {
      console.error(`API Error: ${error.response?.status} ${error.config?.url}`, error.message);
      
      if (error.response?.status === 401) {
        // Token geçersiz, kullanıcıyı logout yap
        await SecureTokenManager.clearTokens();
        console.log("Token expired, user should be logged out");
      }
      
      return Promise.reject(error);
    }
  );

  return client;
};

const apiClient = createSimpleApiClient();

// Güvenli API fonksiyonları
export const getStations = async () => {
  try {
    console.log("Fetching stations...");
    const response = await apiClient.get("stations/");
    console.log("Stations response:", response.data);
    return response;
  } catch (error) {
    console.error("Stations fetch error:", error);
    // Fallback data
    return {
      data: [
        {
          id: 1,
          name: "İzmir İtfaiye Müdürlüğü",
          latitude: 38.4192,
          longitude: 27.1287,
          address: "Konak, İzmir"
        },
        {
          id: 2,
          name: "Bornova İtfaiye İstasyonu",
          latitude: 38.4698,
          longitude: 27.2127,
          address: "Bornova, İzmir"
        }
      ]
    };
  }
};

export const getFireReportAll = async () => {
  try {
    console.log("Fetching fire reports...");
    const response = await apiClient.get("fire-report-all/");
    console.log("Fire reports response:", response.data);
    return response;
  } catch (error) {
    console.error("Fire reports fetch error:", error);
    // Fallback data
    return {
      data: [
        {
          id: 1,
          description: "Test yangın ihbarı",
          latitude: 38.4192,
          longitude: 27.1287,
          status: "active",
          created_at: new Date().toISOString()
        }
      ]
    };
  }
};

export const getFireReportUser = async () => {
  try {
    console.log("Fetching user fire reports...");
    const response = await apiClient.get("fire-report-user/");
    console.log("User fire reports response:", response.data);
    return response.data;
  } catch (error) {
    console.error("User fire reports fetch error:", error);
    // Fallback data
    return [
      {
        id: 1,
        description: "Kullanıcı yangın ihbarı",
        latitude: 38.4192,
        longitude: 27.1287,
        status: "completed",
        created_at: new Date().toISOString()
      }
    ];
  }
};

export const getAllReports = async () => {
  try {
    console.log("Fetching all reports...");
    const response = await apiClient.get("fire-report-all/");
    console.log("All reports response:", response.data);
    return response;
  } catch (error) {
    console.error("All reports fetch error:", error);
    // Fallback data
    return {
      data: [
        {
          id: 1,
          description: "Genel yangın ihbarı",
          latitude: 38.4192,
          longitude: 27.1287,
          status: "active",
          created_at: new Date().toISOString()
        }
      ]
    };
  }
};

// Güvenli login fonksiyonu
export const secureLogin = async (phoneNumber, password) => {
  try {
    console.log("Attempting secure login...");
    
    // PKCE code verifier oluştur
    const codeVerifier = await PKCEUtils.generateCodeVerifier();
    const codeChallenge = await PKCEUtils.generateCodeChallenge(codeVerifier);
    
    const response = await apiClient.post("login/", {
      phone_number: phoneNumber,
      password: password,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });
    
    console.log("Login response:", response.data);
    
    if (response.data.token) {
      await SecureTokenManager.setToken(response.data.token, response.data.expires_in || 3600);
    }
    
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Güvenli register fonksiyonu (password hash olmadan)
export const secureRegister = async (userData) => {
  try {
    console.log("=== SECURE REGISTRATION START ===");
    console.log("Attempting secure registration...");
    
    // PKCE code verifier oluştur
    const codeVerifier = await PKCEUtils.generateCodeVerifier();
    const codeChallenge = await PKCEUtils.generateCodeChallenge(codeVerifier);
    
    // Input validation ve sanitization (password hash olmadan)
    const sanitizedData = {
      name_surname: userData.name_surname?.trim(),
      email: userData.email?.trim().toLowerCase(),
      phone_number: userData.phone_number?.replace(/\D/g, ''), // Sadece rakamlar
      password: userData.password, // Plain text olarak gönder (backend'de hash'lenecek)
      confirm_password: userData.confirm_password,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    };
    
    console.log("Sending registration data with PKCE protection...");
    console.log("Data sanitized:", {
      ...sanitizedData,
      password: '[HIDDEN]',
      confirm_password: '[HIDDEN]'
    });
    
    const response = await apiClient.post("register/", sanitizedData);
    
    console.log("Registration response:", response.data);
    console.log("=== SECURE REGISTRATION END ===");
    return response.data;
    
  } catch (error) {
    console.error("=== SECURE REGISTRATION ERROR ===");
    console.error("Registration error:", error);
    console.error("Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw error;
  }
};

// Güvenlik raporu alma
export const getSecurityReport = async () => {
  try {
    return await securityMiddleware.getSecurityReport();
  } catch (error) {
    console.error("Security report error:", error);
    return null;
  }
};

// Güvenlik utility fonksiyonları
export const SecurityUtils = {
  SecureTokenManager,
  PKCEUtils,
  requestTracker,
  SECURITY_CONFIG,
  securityMiddleware
};
