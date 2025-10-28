import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

interface Translations {
  [key: string]: {
    [langCode: string]: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SimpleLanguageService {
  
  public readonly languages: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
  ];

  private currentLanguageSubject = new BehaviorSubject<Language>(this.languages[0]);
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private translations: Translations = {
    // Header
    'app.title': {
      'en': 'DeepCheck',
      'de': 'DeepCheck', 
      'tr': 'DeepCheck'
    },
    'app.description': {
      'en': 'AI-powered photo and video verification tool',
      'de': 'KI-gestütztes Tool zur Foto- und Videoverifizierung',
      'tr': 'AI destekli fotoğraf ve video doğrulama aracı'
    },
    'select.language': {
      'en': 'Select Language',
      'de': 'Sprache auswählen',
      'tr': 'Dil Seç'
    },
    
    // Status
    'status.ai.active': {
      'en': 'AI Analysis Active',
      'de': 'KI-Analyse aktiv',
      'tr': 'AI Analiz Aktif'
    },
    'status.demo.mode': {
      'en': 'Demo Mode',
      'de': 'Demo-Modus',
      'tr': 'Demo Modu'
    },
    'status.backend.offline': {
      'en': 'No backend connection, running simulation',
      'de': 'Keine Backend-Verbindung, Simulation läuft',
      'tr': 'Backend bağlantısı yok, simülasyon çalışıyor'
    },
    
    // Tabs
    'tab.upload.file': {
      'en': '📁 Upload File',
      'de': '📁 Datei hochladen',
      'tr': '📁 Dosya Yükle'
    },
    'tab.enter.link': {
      'en': '🔗 Enter Link',
      'de': '🔗 Link eingeben',
      'tr': '🔗 Link Gir'
    },
    
    // Upload
    'upload.dragdrop': {
      'en': 'Drag & drop or click to upload',
      'de': 'Ziehen & ablegen oder klicken zum Hochladen',
      'tr': 'Sürükle & bırak veya tıklayarak yükle'
    },
    'upload.photos': {
      'en': '📷 Photos: JPEG, PNG, GIF, WebP',
      'de': '📷 Fotos: JPEG, PNG, GIF, WebP',
      'tr': '📷 Fotoğraflar: JPEG, PNG, GIF, WebP'
    },
    'upload.videos': {
      'en': '🎥 Videos: MP4, AVI, MOV, WMV, FLV, WebM',
      'de': '🎥 Videos: MP4, AVI, MOV, WMV, FLV, WebM',
      'tr': '🎥 Videolar: MP4, AVI, MOV, WMV, FLV, WebM'
    },
    'file.label': {
      'en': 'File:',
      'de': 'Datei:',
      'tr': 'Dosya:'
    },
    'size.label': {
      'en': 'Size:',
      'de': 'Größe:',
      'tr': 'Boyut:'
    },
    'button.clear': {
      'en': 'Clear',
      'de': 'Löschen',
      'tr': 'Temizle'
    },
    
    // Platforms
    'platforms.supported': {
      'en': '🌐 Supported Platforms:',
      'de': '🌐 Unterstützte Plattformen:',
      'tr': '🌐 Desteklenen Platformlar:'
    },
    'platforms.direct.media': {
      'en': '📁 Direct media files',
      'de': '📁 Direkte Mediendateien',
      'tr': '📁 Direkt medya dosyaları'
    },
    'examples.urls': {
      'en': 'Example URLs:',
      'de': 'Beispiel-URLs:',
      'tr': 'Örnek URL\'ler:'
    },
    'input.placeholder': {
      'en': 'Enter media link (e.g.: https://www.youtube.com/watch?v=...)',
      'de': 'Medienlink eingeben (z.B.: https://www.youtube.com/watch?v=...)',
      'tr': 'Medya bağlantısı girin (örneğin: https://www.youtube.com/watch?v=...)'
    },
    'security.info': {
      'en': 'Security: Only links from trusted platforms and HTTPS protocol are accepted.',
      'de': 'Sicherheit: Nur Links von vertrauenswürdigen Plattformen und HTTPS-Protokoll werden akzeptiert.',
      'tr': 'Güvenlik: Sadece güvenilir platformlardan ve HTTPS protokolü ile bağlantılar kabul edilir.'
    },
    
    // Analysis
    'button.analyze': {
      'en': '🚀 Analyze',
      'de': '🚀 Analysieren',
      'tr': '🚀 Analiz Et'
    },
    'error.no.file.url': {
      'en': 'Select a valid file or enter a media link',
      'de': 'Wählen Sie eine gültige Datei oder geben Sie einen Medienlink ein',
      'tr': 'Geçerli bir dosya seçin veya medya bağlantısı girin'
    },
    'error.file.error': {
      'en': 'File error exists',
      'de': 'Dateifehler vorhanden',
      'tr': 'Dosya hatası var'
    },
    'error.url.error': {
      'en': 'URL error exists',
      'de': 'URL-Fehler vorhanden',
      'tr': 'URL hatası var'
    },
    'analyzing.ai': {
      'en': '🤖 AI Analyzing',
      'de': '🤖 KI analysiert',
      'tr': '🤖 AI Analiz Ediliyor'
    },
    'analyzing.wait': {
      'en': 'This may take a few seconds...',
      'de': 'Dies kann einige Sekunden dauern...',
      'tr': 'Bu işlem birkaç saniye sürebilir...'
    },
    
    // Result View
    'result.analysis.result': {
      'en': 'Analysis Result',
      'de': 'Analyseergebnis',
      'tr': 'Analiz Sonucu'
    },
    'result.ai.generated': {
      'en': 'AI Generated Content',
      'de': 'KI-generierter Inhalt',
      'tr': 'AI Üretimi İçerik'
    },
    'result.real.content': {
      'en': 'Real Content',
      'de': 'Echter Inhalt',
      'tr': 'Gerçek İçerik'
    },
    'confidence.high': {
      'en': 'High Confidence',
      'de': 'Hohe Konfidenz',
      'tr': 'Yüksek Güven'
    },
    'confidence.medium': {
      'en': 'Medium Confidence',
      'de': 'Mittlere Konfidenz',
      'tr': 'Orta Güven'
    },
    'confidence.low': {
      'en': 'Low Confidence',
      'de': 'Niedrige Konfidenz',
      'tr': 'Düşük Güven'
    },
    'confidence.ratio': {
      'en': 'Confidence Level',
      'de': 'Konfidenzgrad',
      'tr': 'Güven Oranı'
    },
    'analysis.time': {
      'en': 'Analysis Time',
      'de': 'Analysezeit',
      'tr': 'Analiz Süresi'
    },
    'model.version': {
      'en': 'Model Version',
      'de': 'Modellversion',
      'tr': 'Model Versiyonu'
    },
    'detailed.scores': {
      'en': 'Detailed Scores',
      'de': 'Detaillierte Bewertungen',
      'tr': 'Detaylı Skorlar'
    },
    'detected.features': {
      'en': 'Detected Features',
      'de': 'Erkannte Merkmale',
      'tr': 'Tespit Edilen Özellikler'
    },
    'result.attention': {
      'en': 'Attention!',
      'de': 'Achtung!',
      'tr': 'Dikkat!'
    },
    'result.conclusion': {
      'en': 'Result:',
      'de': 'Ergebnis:',
      'tr': 'Sonuç:'
    },
    'result.ai.warning': {
      'en': 'This content may have been generated by AI. Detected with {confidence} confidence.',
      'de': 'Dieser Inhalt könnte von KI generiert worden sein. Mit {confidence} Konfidenz erkannt.',
      'tr': 'Bu içerik AI tarafından üretilmiş olabilir. {confidence} ile tespit edildi.'
    },
    'result.real.confirmation': {
      'en': 'This content appears to be real. Verified with {confidence} confidence.',
      'de': 'Dieser Inhalt scheint echt zu sein. Mit {confidence} Konfidenz verifiziert.',
      'tr': 'Bu içerik gerçek görünüyor. {confidence} ile doğrulandı.'
    },
    'unit.seconds': {
      'en': 'seconds',
      'de': 'Sekunden',
      'tr': 'saniye'
    },

    // File validation errors
    'error.file.type.invalid': {
      'en': 'Only photo (JPEG, PNG, GIF, WebP) and video (MP4, AVI, MOV, WMV, FLV, WebM) files are allowed.',
      'de': 'Nur Foto- (JPEG, PNG, GIF, WebP) und Video-Dateien (MP4, AVI, MOV, WMV, FLV, WebM) sind erlaubt.',
      'tr': 'Sadece fotoğraf (JPEG, PNG, GIF, WebP) ve video (MP4, AVI, MOV, WMV, FLV, WebM) dosyaları yükleyebilirsiniz.'
    },
    'error.image.size.limit': {
      'en': 'Photo files can be maximum 5MB.',
      'de': 'Foto-Dateien können maximal 5MB groß sein.',
      'tr': 'Fotoğraf dosyaları en fazla 5MB olabilir.'
    },
    'error.video.size.limit': {
      'en': 'Video files can be maximum 30MB.',
      'de': 'Video-Dateien können maximal 30MB groß sein.',
      'tr': 'Video dosyaları en fazla 30MB olabilir.'
    },
    'file.type.photo': {
      'en': '📷 Photo',
      'de': '📷 Foto',
      'tr': '📷 Fotoğraf'
    },
    'file.type.video': {
      'en': '🎥 Video',
      'de': '🎥 Video',
      'tr': '🎥 Video'
    },
    'file.type.file': {
      'en': '📄 File',
      'de': '📄 Datei',
      'tr': '📄 Dosya'
    },

    // URL validation errors
    'error.url.protocol.invalid': {
      'en': 'URL can only use HTTP or HTTPS protocol.',
      'de': 'URL kann nur HTTP- oder HTTPS-Protokoll verwenden.',
      'tr': 'URL sadece HTTP veya HTTPS protokolü kullanabilir.'
    },
    'error.url.too.long': {
      'en': 'URL is too long (maximum 2048 characters).',
      'de': 'URL ist zu lang (maximal 2048 Zeichen).',
      'tr': 'URL çok uzun (maksimum 2048 karakter).'
    },
    'error.url.unsafe.content': {
      'en': 'URL contains unsafe content.',
      'de': 'URL enthält unsichere Inhalte.',
      'tr': 'URL güvenli olmayan içerik barındırıyor.'
    },
    'error.url.invalid.format': {
      'en': 'Invalid URL format. Example: https://www.youtube.com/watch?v=...',
      'de': 'Ungültiges URL-Format. Beispiel: https://www.youtube.com/watch?v=...',
      'tr': 'Geçersiz URL formatı. Örnek: https://www.youtube.com/watch?v=...'
    },

    // Platform-specific error messages  
    'error.platform.unsupported': {
      'en': 'This domain is not supported. Supported platforms: YouTube, Instagram, TikTok, Twitter/X, Facebook, Vimeo, DailyMotion',
      'de': 'Diese Domain wird nicht unterstützt. Unterstützte Plattformen: YouTube, Instagram, TikTok, Twitter/X, Facebook, Vimeo, DailyMotion',
      'tr': 'Bu domain desteklenmiyor. Desteklenen platformlar: YouTube, Instagram, TikTok, Twitter/X, Facebook, Vimeo, DailyMotion'
    },
    'error.youtube.homepage': {
      'en': 'YouTube homepage is not accepted. Please enter a specific video link.',
      'de': 'YouTube-Startseite wird nicht akzeptiert. Bitte geben Sie einen spezifischen Videolink ein.',
      'tr': 'YouTube ana sayfası kabul edilmiyor. Lütfen belirli bir video bağlantısı girin.'
    },
    'error.youtube.video.invalid': {
      'en': 'Please enter a valid YouTube video link. Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'de': 'Bitte geben Sie einen gültigen YouTube-Videolink ein. Beispiel: https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'tr': 'Geçerli bir YouTube video bağlantısı girin. Örnek: https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    'error.youtube.shorts.invalid': {
      'en': 'Please enter a valid YouTube Shorts link.',
      'de': 'Bitte geben Sie einen gültigen YouTube Shorts-Link ein.',
      'tr': 'Geçerli bir YouTube Shorts bağlantısı girin.'
    },
    'error.youtube.embed.invalid': {
      'en': 'Please enter a valid YouTube embed link.',
      'de': 'Bitte geben Sie einen gültigen YouTube-Embed-Link ein.',
      'tr': 'Geçerli bir YouTube embed bağlantısı girin.'
    },
    'error.youtube.format.invalid': {
      'en': 'Only YouTube video, shorts or embed links are accepted.',
      'de': 'Nur YouTube-Video-, Shorts- oder Embed-Links werden akzeptiert.',
      'tr': 'Sadece YouTube video, shorts veya embed bağlantıları kabul edilir.'
    },
    'error.youtu.be.invalid': {
      'en': 'Please enter a valid YouTube short link. Example: https://youtu.be/dQw4w9WgXcQ',
      'de': 'Bitte geben Sie einen gültigen YouTube-Kurzlink ein. Beispiel: https://youtu.be/dQw4w9WgXcQ',  
      'tr': 'Geçerli bir YouTube kısa bağlantısı girin. Örnek: https://youtu.be/dQw4w9WgXcQ'
    }
  };

  constructor() {
    // Tarayıcıdan dil tercihini al
    const savedLang = localStorage.getItem('deepcheck-language');
    if (savedLang) {
      const lang = this.languages.find(l => l.code === savedLang);
      if (lang) {
        this.currentLanguageSubject.next(lang);
      }
    } else {
      // Tarayıcı dilini kontrol et
      const browserLang = navigator.language.substring(0, 2);
      const lang = this.languages.find(l => l.code === browserLang);
      if (lang) {
        this.currentLanguageSubject.next(lang);
      }
    }
  }

  changeLanguage(languageCode: string): void {
    const language = this.languages.find(lang => lang.code === languageCode);
    if (language) {
      this.currentLanguageSubject.next(language);
      localStorage.setItem('deepcheck-language', languageCode);
    }
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  translate(key: string, params?: { [key: string]: string }): string {
    const currentLang = this.getCurrentLanguage().code;
    let translation = this.translations[key]?.[currentLang] || key;
    
    // Replace parameters if provided
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
      });
    }
    
    return translation;
  }

  isCurrentLanguage(code: string): boolean {
    return this.getCurrentLanguage().code === code;
  }
}
