# 🔒 YISIS Mobil Uygulama Güvenlik Dokümantasyonu

## 📋 Genel Bakış

Bu dokümantasyon, YISIS mobil uygulamasında implement edilen güvenlik önlemlerini detaylandırır. Uygulama, Expo Go ile geliştirme aşamasında olduğu için, güvenlik önlemleri bu platform ile uyumlu olacak şekilde tasarlanmıştır.

## 🛡️ Implement Edilen Güvenlik Önlemleri

### 1. **OAuth2/PKCE (Proof Key for Code Exchange)**
- **Amaç**: Authorization code interception saldırılarına karşı koruma
- **Implementasyon**: 
  - Code verifier ve challenge oluşturma
  - SHA-256 hash algoritması (basitleştirilmiş)
  - Secure token exchange

### 2. **Güvenli Token Yönetimi**
- **Token Expiration**: 30 dakika otomatik timeout
- **Secure Storage**: AsyncStorage ile güvenli depolama
- **Auto Refresh**: Token expire olmadan 5 dakika önce otomatik yenileme
- **Token Validation**: Her request'te token geçerliliği kontrolü

### 3. **Rate Limiting & WAF (Web Application Firewall)**
- **Request Limits**:
  - Dakika: 60 istek
  - Saat: 1000 istek
  - Gün: 10000 istek
- **Login Protection**: 5 başarısız deneme sonrası 15 dakika lockout
- **IP Blocking**: Şüpheli IP'lerin otomatik bloklanması

### 4. **Input Validation & Sanitization**
- **XSS Koruması**: `<script>`, `javascript:`, `on*` pattern'leri engellenir
- **SQL Injection Koruması**: SQL komutları ve tehlikeli karakterler tespit edilir
- **Path Traversal Koruması**: `../` ve `//` pattern'leri engellenir
- **HTML Encoding**: Özel karakterler güvenli şekilde encode edilir

### 5. **Network Security**
- **HTTPS Zorunluluğu**: Sadece güvenli bağlantılara izin
- **Domain Whitelist**: Sadece `miracdogan.pythonanywhere.com` domain'ine izin
- **Request Timeout**: 10 saniye maksimum response süresi
- **Certificate Validation**: SSL sertifika doğrulaması

### 6. **Security Headers**
- **X-Request-ID**: Her request için unique identifier
- **X-Timestamp**: Request zaman damgası
- **User-Agent**: Client bilgisi
- **Content-Type**: MIME type validation

### 7. **Session Management**
- **Activity Tracking**: Kullanıcı aktivite takibi
- **Inactivity Timeout**: 30 dakika inaktivite sonrası otomatik logout
- **Secure Logout**: Token'ların güvenli temizlenmesi

### 8. **Device Security**
- **Emulator Detection**: Development modunda emulator tespiti
- **Root Detection**: Root'lu cihaz tespiti (Expo Go'da sınırlı)
- **Secure Enclave**: iOS Secure Enclave kontrolü

## 🔧 Konfigürasyon

### Development vs Production
```json
{
  "extra": {
    "security": {
      "enableCertificatePinning": false,  // Expo Go için false
      "enableBiometricAuth": true,        // Production'da aktif
      "sessionTimeout": 1800000,          // 30 dakika
      "maxLoginAttempts": 5,              // Maksimum login denemesi
      "lockoutDuration": 900000           // 15 dakika lockout
    }
  }
}
```

### Security Levels
- **LOW**: Temel güvenlik (HTTPS, session timeout)
- **MEDIUM**: Gelişmiş güvenlik (rate limiting, validation)
- **HIGH**: Yüksek güvenlik (certificate pinning, biometric)
- **MAXIMUM**: Maksimum güvenlik (tüm özellikler aktif)

## 📱 Expo Go Uyumluluğu

### Aktif Özellikler
- ✅ OAuth2/PKCE
- ✅ Token management
- ✅ Rate limiting
- ✅ Input validation
- ✅ Network security
- ✅ Security headers
- ✅ Session management

### Devre Dışı Özellikler
- ❌ Certificate pinning (Expo Go kısıtlamaları)
- ❌ Biometric authentication (Plugin gerekli)
- ❌ Advanced device integrity (Native API gerekli)

## 🚀 Kullanım

### Güvenli Login
```javascript
import { secureLogin } from '@/services/api';

const loginData = await secureLogin(phoneNumber, password);
```

### Güvenlik Raporu
```javascript
import { getSecurityReport } from '@/services/api';

const report = await getSecurityReport();
console.log(report);
```

### Security Hook
```javascript
import { useSecurity } from '@/hooks/useSecurity';

const { performSecurityCheck, deviceIntegrity } = useSecurity();
```

## 📊 Güvenlik Monitoring

### Log Events
- `login_success`: Başarılı giriş
- `login_failed`: Başarısız giriş
- `request_blocked`: Engellenen request
- `rate_limit_exceeded`: Rate limit aşımı
- `xss_detected`: XSS pattern tespiti
- `sql_injection_detected`: SQL injection tespiti

### Security Reports
- Request sayıları
- Engellenen istekler
- Son güvenlik olayları
- Rate limit durumu

## 🔍 Test & Validation

### Otomatik Testler
```bash
# Güvenlik testleri
npm run security-check

# Dependency güvenlik taraması
npm audit
```

### Manuel Testler
- Login attempt limit
- Rate limiting
- Input validation
- Session timeout
- Network security

## 🚨 Güvenlik Uyarıları

### Development
- Emulator kullanımı güvenlik riski oluşturabilir
- Debug logging aktif
- Certificate pinning devre dışı

### Production
- Certificate pinning aktif edilmeli
- Biometric authentication aktif edilmeli
- Debug logging kapatılmalı
- Source maps kaldırılmalı

## 📈 Performans Etkisi

### Minimal Impact
- **Memory**: ~2-5MB ek kullanım
- **CPU**: %1-3 ek yük
- **Network**: ~100-200 byte ek header
- **Storage**: ~1-2MB log dosyaları

### Optimization
- Log rotation (1000 entry limit)
- Request caching
- Efficient pattern matching
- Minimal crypto operations

## 🔄 Güncelleme & Maintenance

### Regular Updates
- Security patches
- Dependency updates
- Pattern updates
- Configuration tuning

### Monitoring
- Security logs review
- Performance metrics
- Threat detection
- User feedback

## 📞 Destek & İletişim

Güvenlik ile ilgili sorular veya öneriler için:
- **Email**: security@yisis.com
- **Issue Tracker**: GitHub Issues
- **Documentation**: Bu README dosyası

## 📝 Changelog

### v1.0.0 (Current)
- ✅ OAuth2/PKCE implementation
- ✅ Token security
- ✅ Rate limiting
- ✅ Input validation
- ✅ Network security
- ✅ Security monitoring
- ✅ Expo Go compatibility

### v1.1.0 (Planned)
- 🔄 Certificate pinning
- 🔄 Biometric auth
- 🔄 Advanced device integrity
- 🔄 Real-time threat detection

---

**⚠️ Önemli**: Bu güvenlik önlemleri development ortamında test edilmiştir. Production'a geçmeden önce kapsamlı güvenlik testleri yapılmalıdır.
