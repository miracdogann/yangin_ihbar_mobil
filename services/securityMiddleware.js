import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Güvenlik middleware sınıfı
class SecurityMiddleware {
  constructor() {
    this.requestCount = new Map();
    this.blockedIPs = new Set();
    this.suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /document\./i,
      /window\./i,
    ];
  }

  // Request validation
  async validateRequest(request) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: []
    };

    try {
      // Rate limiting kontrolü
      if (this.isRateLimited(request)) {
        validation.isValid = false;
        validation.errors.push('Rate limit exceeded');
        return validation;
      }

      // Input sanitization
      if (request.data) {
        const sanitizationResult = this.sanitizeInput(request.data);
        if (!sanitizationResult.isValid) {
          validation.isValid = false;
          validation.errors.push(...sanitizationResult.errors);
        }
        if (sanitizationResult.warnings.length > 0) {
          validation.warnings.push(...sanitizationResult.warnings);
        }
      }

      // Headers validation
      const headerValidation = this.validateHeaders(request.headers);
      if (!headerValidation.isValid) {
        validation.isValid = false;
        validation.errors.push(...headerValidation.errors);
      }

      // URL validation
      if (request.url) {
        const urlValidation = this.validateURL(request.url);
        if (!urlValidation.isValid) {
          validation.isValid = false;
          validation.errors.push(...urlValidation.errors);
        }
      }

      return validation;
    } catch (error) {
      console.error('Request validation error:', error);
      validation.isValid = false;
      validation.errors.push('Validation failed');
      return validation;
    }
  }

  // Rate limiting
  isRateLimited(request) {
    const clientId = this.getClientId(request);
    const now = Date.now();
    const windowMs = 60000; // 1 dakika

    if (!this.requestCount.has(clientId)) {
      this.requestCount.set(clientId, []);
    }

    const requests = this.requestCount.get(clientId);
    const recentRequests = requests.filter(time => now - time < windowMs);

    // 60 request/dakika limit
    if (recentRequests.length >= 60) {
      return true;
    }

    recentRequests.push(now);
    this.requestCount.set(clientId, recentRequests);
    return false;
  }

  // Input sanitization
  sanitizeInput(data) {
    const result = {
      isValid: true,
      errors: [],
      warnings: []
    };

    const sanitizeValue = (value) => {
      if (typeof value === 'string') {
        // XSS pattern kontrolü
        for (const pattern of this.suspiciousPatterns) {
          if (pattern.test(value)) {
            result.isValid = false;
            result.errors.push('Potentially malicious input detected');
            return null;
          }
        }

        // Advanced SQL injection pattern kontrolü
        const sqlPatterns = [
          // Temel SQL komutları
          /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|TRUNCATE|REPLACE)\b)/i,
          
          // SQL comment patterns
          /(--|\/\*|\*\/|#)/,
          
          // Quote patterns
          /('|"|`|%27|%22|%60)/,
          
          // Boolean-based blind SQL injection
          /(\b(OR|AND)\b\s*[\(\s]*\d+\s*[\)\s]*\s*[=<>!]+\s*[\(\s]*\d+)/i,
          /(\b(OR|AND)\b\s*[\(\s]*['"]\w*['"]\s*[=<>!]+\s*['"]\w*['"])/i,
          
          // Time-based blind SQL injection
          /(\b(WAITFOR|DELAY|SLEEP|BENCHMARK)\b)/i,
          /(\b(pg_sleep|dbms_pipe\.receive_message)\b)/i,
          
          // Union-based SQL injection
          /(\bUNION\b\s*(\bALL\b)?\s*\bSELECT\b)/i,
          /(\bUNION\b[\s\/\*]+\bSELECT\b)/i,
          
          // Error-based SQL injection
          /(\b(CAST|CONVERT|EXTRACTVALUE|UPDATEXML|XMLTYPE)\b)/i,
          /(\b(EXP|FLOOR|RAND|COUNT)\b\s*\()/i,
          
          // Stacked queries
          /(;\s*\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC)\b)/i,
          
          // Information schema attacks
          /(\binformation_schema\b)/i,
          /(\bsys\.(tables|columns|databases)\b)/i,
          /(\bmysql\.(user|db)\b)/i,
          
          // File operations
          /(\b(INTO\s+OUTFILE|LOAD_FILE|DUMPFILE)\b)/i,
          /(\b(xp_cmdshell|sp_configure)\b)/i,
          
          // Database functions
          /(\b(VERSION|USER|DATABASE|SCHEMA|@@)\b)/i,
          /(\b(CURRENT_USER|SESSION_USER|SYSTEM_USER)\b)/i,
          
          // Encoded patterns
          /((%20|%09|%0a|%0d)+(OR|AND|UNION|SELECT))/i,
          /(0x[0-9a-f]+)/i,
          
          // Advanced bypass techniques
          /(\bSELECT\b[\s\/\*]+\*/i,
          /(\b(OR|AND)\b[\s\/\*]+\d+[\s\/\*]*[=<>!]+[\s\/\*]*\d+)/i,
          /(\/\*!?\d*\s*(SELECT|UNION|INSERT|UPDATE|DELETE)\b)/i,
          
          // NoSQL injection patterns
          /(\$where|\$ne|\$gt|\$lt|\$or|\$and)/i,
          /(this\s*\.\s*\w+)/,
          
          // LDAP injection
          /(\*|\)\(|\)\)|&|\|)/,
          
          // Command injection in SQL context
          /(\|\||&&|;|`|\$\(|\$\{)/
        ];

        for (const pattern of sqlPatterns) {
          if (pattern.test(value)) {
            result.warnings.push('Advanced SQL injection pattern detected');
            // Kritik SQL injection pattern'leri için daha sıkı kontrol
            const criticalPatterns = [
              /(\b(DROP|TRUNCATE|DELETE)\b)/i,
              /(\bxp_cmdshell\b)/i,
              /(\bINTO\s+OUTFILE\b)/i,
              /(\/\*!?\d*\s*(SELECT|UNION|INSERT|UPDATE|DELETE)\b)/i
            ];
            
            for (const criticalPattern of criticalPatterns) {
              if (criticalPattern.test(value)) {
                result.isValid = false;
                result.errors.push('Critical SQL injection attempt detected');
                return null;
              }
            }
          }
        }

        // Advanced input sanitization
        let sanitizedValue = value
          // HTML encoding
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/`/g, '&#x60;')
          
          // SQL specific encoding
          .replace(/;/g, '&#x3B;')
          .replace(/--/g, '&#x2D;&#x2D;')
          .replace(/\/\*/g, '&#x2F;&#x2A;')
          .replace(/\*\//g, '&#x2A;&#x2F;')
          .replace(/#/g, '&#x23;')
          
          // Encoded character normalization
          .replace(/%27/gi, '&#x27;')
          .replace(/%22/gi, '&quot;')
          .replace(/%60/gi, '&#x60;')
          .replace(/%3B/gi, '&#x3B;')
          
          // Advanced bypass prevention
          .replace(/\x00/g, '') // Null bytes
          .replace(/\r\n/g, ' ') // CRLF injection
          .replace(/\n/g, ' ')
          .replace(/\r/g, ' ')
          .replace(/\t/g, ' ')
          
          // Multiple spaces to single space
          .replace(/\s+/g, ' ')
          .trim();

        return sanitizedValue;
      }

      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          return value.map(sanitizeValue);
        } else {
          const sanitized = {};
          for (const [key, val] of Object.entries(value)) {
            sanitized[key] = sanitizeValue(val);
          }
          return sanitized;
        }
      }

      return value;
    };

    const sanitizedData = sanitizeValue(data);
    return { ...result, sanitizedData };
  }

  // Headers validation
  validateHeaders(headers) {
    const result = {
      isValid: true,
      errors: []
    };

    const requiredHeaders = ['Content-Type', 'User-Agent'];
    const forbiddenHeaders = ['X-Forwarded-For', 'X-Real-IP'];

    for (const header of requiredHeaders) {
      if (!headers[header]) {
        result.errors.push(`Missing required header: ${header}`);
        result.isValid = false;
      }
    }

    for (const header of forbiddenHeaders) {
      if (headers[header]) {
        result.errors.push(`Forbidden header detected: ${header}`);
        result.isValid = false;
      }
    }

    return result;
  }

  // URL validation
  validateURL(url) {
    const result = {
      isValid: true,
      errors: []
    };

    try {
      const urlObj = new URL(url);
      
      // Protocol kontrolü
      if (urlObj.protocol !== 'https:') {
        result.errors.push('Only HTTPS protocol allowed');
        result.isValid = false;
      }

      // Domain kontrolü
      const allowedDomains = ['miracdogan.pythonanywhere.com'];
      if (!allowedDomains.includes(urlObj.hostname)) {
        result.errors.push('Unauthorized domain');
        result.isValid = false;
      }

      // Path traversal kontrolü
      if (urlObj.pathname.includes('..') || urlObj.pathname.includes('//')) {
        result.errors.push('Path traversal detected');
        result.isValid = false;
      }

    } catch (error) {
      result.errors.push('Invalid URL format');
      result.isValid = false;
    }

    return result;
  }

  // Client ID oluşturma
  getClientId(request) {
    // Basit client identification (gerçek uygulamada daha gelişmiş olabilir)
    const userAgent = request.headers?.['User-Agent'] || '';
    const timestamp = Math.floor(Date.now() / 60000); // 1 dakikalık window
    return `${userAgent}-${timestamp}`;
  }

  // Response validation
  async validateResponse(response) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: []
    };

    try {
      // Status code kontrolü
      if (response.status < 200 || response.status >= 600) {
        validation.warnings.push(`Unexpected status code: ${response.status}`);
      }

      // Content-Type kontrolü
      const contentType = response.headers?.['content-type'];
      if (contentType && !contentType.includes('application/json')) {
        validation.warnings.push('Unexpected content type');
      }

      // Response size kontrolü
      const contentLength = response.headers?.['content-length'];
      if (contentLength && parseInt(contentLength) > 10485760) { // 10MB
        validation.warnings.push('Response too large');
      }

      // Response data validation
      if (response.data) {
        const dataValidation = this.validateResponseData(response.data);
        if (!dataValidation.isValid) {
          validation.isValid = false;
          validation.errors.push(...dataValidation.errors);
        }
      }

      return validation;
    } catch (error) {
      console.error('Response validation error:', error);
      validation.isValid = false;
      validation.errors.push('Response validation failed');
      return validation;
    }
  }

  // Response data validation
  validateResponseData(data) {
    const result = {
      isValid: true,
      errors: []
    };

    // Sensitive data kontrolü
    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    const checkSensitiveData = (obj, path = '') => {
      if (typeof obj === 'object' && obj !== null) {
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key;
          
          if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
            if (typeof value === 'string' && value.length > 0) {
              result.warnings.push(`Sensitive data in response: ${currentPath}`);
            }
          }
          
          if (typeof value === 'object') {
            checkSensitiveData(value, currentPath);
          }
        }
      }
    };

    checkSensitiveData(data);
    return result;
  }

  // Güvenlik log'u
  async logSecurityEvent(event, details) {
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        event,
        details,
        requestId: simpleHash(Date.now().toString() + Math.random().toString())
      };

      const existingLogs = await AsyncStorage.getItem('securityMiddlewareLogs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(logEntry);

      // Son 1000 log'u tut
      if (logs.length > 1000) {
        logs.splice(0, logs.length - 1000);
      }

      await AsyncStorage.setItem('securityMiddlewareLogs', JSON.stringify(logs));
    } catch (error) {
      console.error('Security log error:', error);
    }
  }

  // Güvenlik durumu raporu
  async getSecurityReport() {
    try {
      const logs = await AsyncStorage.getItem('securityMiddlewareLogs');
      const parsedLogs = logs ? JSON.parse(logs) : [];

      const report = {
        totalRequests: this.requestCount.size,
        blockedRequests: this.blockedIPs.size,
        recentEvents: parsedLogs.slice(-10),
        rateLimitStatus: Array.from(this.requestCount.entries()).map(([client, requests]) => ({
          client,
          requestCount: requests.length
        }))
      };

      return report;
    } catch (error) {
      console.error('Security report error:', error);
      return null;
    }
  }
}

// Singleton instance
const securityMiddleware = new SecurityMiddleware();

export default securityMiddleware;
