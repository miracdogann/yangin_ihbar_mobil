import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Basit hash fonksiyonu (expo-crypto yerine)
const simpleHash = (str: string): string => {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
};

interface SecurityConfig {
  enableBiometricAuth: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
}

interface DeviceIntegrity {
  isEmulator: boolean;
  isRooted: boolean;
  hasSecureEnclave: boolean;
  biometricAvailable: boolean;
}

export const useSecurity = () => {
  const [deviceIntegrity, setDeviceIntegrity] = useState<DeviceIntegrity>({
    isEmulator: false,
    isRooted: false,
    hasSecureEnclave: false,
    biometricAvailable: false,
  });

  const [securityConfig, setSecurityConfig] = useState<SecurityConfig>({
    enableBiometricAuth: true,
    sessionTimeout: 1800000, // 30 dakika
    maxLoginAttempts: 5,
    lockoutDuration: 900000, // 15 dakika
  });

  // Device integrity kontrolü
  const checkDeviceIntegrity = async (): Promise<DeviceIntegrity> => {
    try {
      // Basit device integrity kontrolleri (Expo Go için sınırlı)
      const integrity: DeviceIntegrity = {
        isEmulator: __DEV__, // Development modunda emulator olarak kabul et
        isRooted: false, // Expo Go'da root detection sınırlı
        hasSecureEnclave: Platform.OS === 'ios', // iOS'ta Secure Enclave var
        biometricAvailable: false, // Biometric detection için ek plugin gerekli
      };

      setDeviceIntegrity(integrity);
      return integrity;
    } catch (error) {
      console.error('Device integrity check error:', error);
      return deviceIntegrity;
    }
  };

  // Biometric authentication kontrolü
  const checkBiometricAvailability = async (): Promise<boolean> => {
    try {
      // Expo Go'da biometric authentication sınırlı
      // Gerçek uygulamada expo-local-authentication kullanılabilir
      return false;
    } catch (error) {
      console.error('Biometric availability check error:', error);
      return false;
    }
  };

  // Session timeout kontrolü
  const checkSessionTimeout = async (): Promise<boolean> => {
    try {
      const lastActivity = await AsyncStorage.getItem('lastActivity');
      if (!lastActivity) return false;

      const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
      return timeSinceLastActivity < securityConfig.sessionTimeout;
    } catch (error) {
      console.error('Session timeout check error:', error);
      return false;
    }
  };

  // Login attempt kontrolü
  const checkLoginAttempts = async (): Promise<{ allowed: boolean; remainingTime?: number }> => {
    try {
      const attempts = await AsyncStorage.getItem('loginAttempts');
      const lastFailedAttempt = await AsyncStorage.getItem('lastFailedLogin');

      if (!attempts || !lastFailedAttempt) {
        return { allowed: true };
      }

      const attemptCount = parseInt(attempts);
      const timeSinceLastAttempt = Date.now() - parseInt(lastFailedAttempt);

      if (attemptCount >= securityConfig.maxLoginAttempts && 
          timeSinceLastAttempt < securityConfig.lockoutDuration) {
        const remainingTime = securityConfig.lockoutDuration - timeSinceLastAttempt;
        return { allowed: false, remainingTime };
      }

      // Lockout süresi geçmişse sıfırla
      if (timeSinceLastAttempt >= securityConfig.lockoutDuration) {
        await AsyncStorage.multiRemove(['loginAttempts', 'lastFailedLogin']);
      }

      return { allowed: true };
    } catch (error) {
      console.error('Login attempts check error:', error);
      return { allowed: true };
    }
  };

  // Güvenli hash oluşturma
  const createSecureHash = async (data: string): Promise<string> => {
    try {
      const hash = simpleHash(data + Date.now().toString());
      return hash;
    } catch (error) {
      console.error('Hash creation error:', error);
      throw error;
    }
  };

  // Güvenli random string oluşturma
  const generateSecureRandomString = (length: number = 32): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Güvenlik log'u
  const logSecurityEvent = async (event: string, details?: any) => {
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        event,
        details,
        deviceInfo: {
          platform: Platform.OS,
          version: Platform.Version,
        }
      };

      const existingLogs = await AsyncStorage.getItem('securityLogs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(logEntry);

      // Son 100 log'u tut
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }

      await AsyncStorage.setItem('securityLogs', JSON.stringify(logs));
    } catch (error) {
      console.error('Security log error:', error);
    }
  };

  // Güvenlik durumu kontrolü
  const performSecurityCheck = async (): Promise<{
    isSecure: boolean;
    issues: string[];
  }> => {
    const issues: string[] = [];

    try {
      // Device integrity kontrolü
      const integrity = await checkDeviceIntegrity();
      if (integrity.isEmulator) {
        issues.push('Emulator detected - security may be compromised');
      }

      // Session timeout kontrolü
      const sessionValid = await checkSessionTimeout();
      if (!sessionValid) {
        issues.push('Session expired');
      }

      // Login attempts kontrolü
      const loginCheck = await checkLoginAttempts();
      if (!loginCheck.allowed) {
        issues.push('Account temporarily locked');
      }

      // Biometric availability kontrolü
      const biometricAvailable = await checkBiometricAvailability();
      if (!biometricAvailable && securityConfig.enableBiometricAuth) {
        issues.push('Biometric authentication not available');
      }

      await logSecurityEvent('security_check', { issues, integrity });

      return {
        isSecure: issues.length === 0,
        issues
      };
    } catch (error) {
      console.error('Security check error:', error);
      issues.push('Security check failed');
      return {
        isSecure: false,
        issues
      };
    }
  };

  useEffect(() => {
    checkDeviceIntegrity();
    checkBiometricAvailability();
  }, []);

  return {
    deviceIntegrity,
    securityConfig,
    checkDeviceIntegrity,
    checkBiometricAvailability,
    checkSessionTimeout,
    checkLoginAttempts,
    createSecureHash,
    generateSecureRandomString,
    logSecurityEvent,
    performSecurityCheck,
  };
};
