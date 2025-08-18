// Güvenlik konfigürasyonu
export const SecurityConfig = {
  // Authentication
  AUTH: {
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 dakika
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 dakika
    TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 dakika
  },

  // Rate Limiting
  RATE_LIMITING: {
    MAX_REQUESTS_PER_MINUTE: 60,
    MAX_REQUESTS_PER_HOUR: 1000,
    MAX_REQUESTS_PER_DAY: 10000,
  },

  // Network Security
  NETWORK: {
    REQUEST_TIMEOUT: 10000,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    ALLOWED_DOMAINS: ['miracdogan.pythonanywhere.com'],
    ALLOWED_PROTOCOLS: ['https'],
  },

  // Certificate Pinning (Development için devre dışı)
  CERTIFICATE_PINNING: {
    ENABLED: false, // Expo Go için false
    ALLOWED_CERTIFICATES: [
      // Production'da gerçek sertifika hash'leri eklenecek
    ],
  },

  // Input Validation
  INPUT_VALIDATION: {
    MAX_STRING_LENGTH: 1000,
    MAX_PHONE_LENGTH: 15,
    MAX_PASSWORD_LENGTH: 50,
    ALLOWED_CHARACTERS: /^[a-zA-Z0-9@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]+$/,
  },

  // Encryption
  ENCRYPTION: {
    ALGORITHM: 'SHA-256',
    KEY_SIZE: 256,
    IV_SIZE: 16,
  },

  // Logging
  LOGGING: {
    MAX_LOG_ENTRIES: 1000,
    LOG_RETENTION_DAYS: 30,
    SENSITIVE_FIELDS: ['password', 'token', 'secret', 'key', 'authorization'],
  },

  // Device Security
  DEVICE: {
    CHECK_EMULATOR: true,
    CHECK_ROOT: true,
    REQUIRE_SECURE_ENCLAVE: false, // Expo Go için false
    BIOMETRIC_AUTH: false, // Expo Go için false
  },

  // API Security
  API: {
    VERSION: '1.0.0',
    CLIENT_ID: 'YISIS-Mobile-App',
    REQUIRED_HEADERS: ['Content-Type', 'User-Agent', 'X-Request-ID', 'X-Timestamp'],
    FORBIDDEN_HEADERS: ['X-Forwarded-For', 'X-Real-IP'],
  },

  // Error Handling
  ERROR_HANDLING: {
    SHOW_DETAILED_ERRORS: false, // Production'da false
    LOG_ERRORS: true,
    MAX_ERROR_LOG_SIZE: 100,
  },

  // Development vs Production
  ENVIRONMENT: {
    IS_DEVELOPMENT: __DEV__,
    IS_EXPO_GO: true, // Expo Go kullanımında true
    ENABLE_DEBUG_LOGS: __DEV__,
  },
};

// Güvenlik seviyeleri
export const SecurityLevels = {
  LOW: {
    name: 'Low',
    description: 'Basic security measures',
    features: ['Basic input validation', 'HTTPS only', 'Session timeout'],
  },
  MEDIUM: {
    name: 'Medium',
    description: 'Enhanced security measures',
    features: ['Rate limiting', 'Token validation', 'Input sanitization', 'Security logging'],
  },
  HIGH: {
    name: 'High',
    description: 'Advanced security measures',
    features: ['Certificate pinning', 'Biometric auth', 'Device integrity', 'Advanced encryption'],
  },
  MAXIMUM: {
    name: 'Maximum',
    description: 'Maximum security measures',
    features: ['All security features', 'Real-time threat detection', 'Advanced monitoring'],
  },
};

// Güvenlik event tipleri
export const SecurityEventTypes = {
  AUTHENTICATION: {
    LOGIN_SUCCESS: 'login_success',
    LOGIN_FAILED: 'login_failed',
    LOGOUT: 'logout',
    TOKEN_EXPIRED: 'token_expired',
    TOKEN_REFRESH: 'token_refresh',
  },
  NETWORK: {
    REQUEST_SENT: 'request_sent',
    REQUEST_BLOCKED: 'request_blocked',
    RESPONSE_SUCCESS: 'response_success',
    RESPONSE_ERROR: 'response_error',
    RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  },
  VALIDATION: {
    INPUT_VALIDATION_FAILED: 'input_validation_failed',
    XSS_DETECTED: 'xss_detected',
    SQL_INJECTION_DETECTED: 'sql_injection_detected',
    PATH_TRAVERSAL_DETECTED: 'path_traversal_detected',
  },
  DEVICE: {
    EMULATOR_DETECTED: 'emulator_detected',
    ROOT_DETECTED: 'root_detected',
    SECURE_ENCLAVE_UNAVAILABLE: 'secure_enclave_unavailable',
    BIOMETRIC_UNAVAILABLE: 'biometric_unavailable',
  },
  SYSTEM: {
    SECURITY_CHECK: 'security_check',
    CONFIGURATION_CHANGE: 'configuration_change',
    ERROR_OCCURRED: 'error_occurred',
  },
};

// Güvenlik mesajları
export const SecurityMessages = {
  ERRORS: {
    RATE_LIMIT_EXCEEDED: 'Çok fazla istek gönderildi. Lütfen bekleyin.',
    INVALID_INPUT: 'Geçersiz giriş verisi.',
    AUTHENTICATION_FAILED: 'Kimlik doğrulama başarısız.',
    SESSION_EXPIRED: 'Oturum süresi doldu.',
    DEVICE_NOT_SECURE: 'Cihaz güvenlik gereksinimlerini karşılamıyor.',
    NETWORK_ERROR: 'Ağ bağlantısı hatası.',
    VALIDATION_FAILED: 'Veri doğrulama başarısız.',
  },
  WARNINGS: {
    SUSPICIOUS_ACTIVITY: 'Şüpheli aktivite tespit edildi.',
    WEAK_PASSWORD: 'Zayıf şifre kullanılıyor.',
    OLD_APP_VERSION: 'Eski uygulama versiyonu kullanılıyor.',
    INSECURE_CONNECTION: 'Güvensiz bağlantı tespit edildi.',
  },
  SUCCESS: {
    LOGIN_SUCCESS: 'Giriş başarılı.',
    LOGOUT_SUCCESS: 'Çıkış başarılı.',
    SECURITY_CHECK_PASSED: 'Güvenlik kontrolü geçildi.',
    TOKEN_REFRESHED: 'Token yenilendi.',
  },
};

// Güvenlik kontrolleri
export const SecurityChecks = {
  // Input validation patterns
  PATTERNS: {
    PHONE: /^0[5][0-9]{9}$/,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
    NUMERIC: /^[0-9]+$/,
  },

  // Suspicious patterns
  SUSPICIOUS: {
    XSS: [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /document\./i,
      /window\./i,
    ],
    SQL_INJECTION: [
      // Temel SQL komutları
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|TRUNCATE|REPLACE)\b)/i,
      
      // SQL comment ve quote patterns
      /(--|\/\*|\*\/|#|'|"|`|%27|%22|%60)/,
      
      // Boolean-based blind SQL injection
      /(\b(OR|AND)\b\s*[\(\s]*\d+\s*[\)\s]*\s*[=<>!]+\s*[\(\s]*\d+)/i,
      /(\b(OR|AND)\b\s*[\(\s]*['"]\w*['"]\s*[=<>!]+\s*['"]\w*['"])/i,
      
      // Time-based blind SQL injection
      /(\b(WAITFOR|DELAY|SLEEP|BENCHMARK|pg_sleep)\b)/i,
      
      // Union-based SQL injection
      /(\bUNION\b\s*(\bALL\b)?\s*\bSELECT\b)/i,
      /(\bUNION\b[\s\/\*]+\bSELECT\b)/i,
      
      // Error-based SQL injection
      /(\b(CAST|CONVERT|EXTRACTVALUE|UPDATEXML|XMLTYPE|EXP|FLOOR|RAND|COUNT)\b)/i,
      
      // Information schema attacks
      /(\binformation_schema\b|\bsys\.(tables|columns|databases)\b|\bmysql\.(user|db)\b)/i,
      
      // File operations
      /(\b(INTO\s+OUTFILE|LOAD_FILE|DUMPFILE|xp_cmdshell|sp_configure)\b)/i,
      
      // Database functions
      /(\b(VERSION|USER|DATABASE|SCHEMA|@@|CURRENT_USER|SESSION_USER|SYSTEM_USER)\b)/i,
      
      // Advanced bypass techniques
      /(\/\*!?\d*\s*(SELECT|UNION|INSERT|UPDATE|DELETE)\b)/i,
      /(\|\||&&|;|`|\$\(|\$\{)/,
      
      // NoSQL injection patterns
      /(\$where|\$ne|\$gt|\$lt|\$or|\$and)/i,
    ],
    PATH_TRAVERSAL: [
      /\.\./,
      /\/\//,
      /\\/,
    ],
  },

  // Validation functions
  VALIDATORS: {
    isPhoneValid: (phone: string): boolean => {
      return SecurityChecks.PATTERNS.PHONE.test(phone);
    },
    
    isEmailValid: (email: string): boolean => {
      return SecurityChecks.PATTERNS.EMAIL.test(email);
    },
    
    isPasswordStrong: (password: string): boolean => {
      return SecurityChecks.PATTERNS.PASSWORD.test(password);
    },
    
    containsSuspiciousPattern: (input: string): boolean => {
      const allPatterns = [
        ...SecurityChecks.SUSPICIOUS.XSS,
        ...SecurityChecks.SUSPICIOUS.SQL_INJECTION,
        ...SecurityChecks.SUSPICIOUS.PATH_TRAVERSAL,
      ];
      
      return allPatterns.some(pattern => pattern.test(input));
    },
    
    sanitizeInput: (input: string): string => {
      return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    },
  },
};

export default SecurityConfig;
