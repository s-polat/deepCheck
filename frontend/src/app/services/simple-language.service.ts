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
    },

    // Cache and Analysis Status Messages
    'analysis.cached': {
      'en': 'Analysis cached - no additional API costs',
      'de': 'Analyse gecacht - keine zusätzlichen API-Kosten',
      'tr': 'Analiz önbelleğe alındı - ek API maliyeti yok'
    },
    'button.analyzed': {
      'en': 'Analyzed ✓',
      'de': 'Analysiert ✓',
      'tr': 'Analiz Edildi ✓'
    },
    'analyzing.progress': {
      'en': 'Analyzing...',
      'de': 'Analysiert...',
      'tr': 'Analiz ediliyor...'
    },
    'backend.connection.issue': {
      'en': 'Backend connection issue detected. Using demo mode.',
      'de': 'Backend-Verbindungsproblem erkannt. Demo-Modus wird verwendet.',
      'tr': 'Backend bağlantı sorunu tespit edildi. Demo modu kullanılıyor.'
    },
    'analysis.file.already.analyzed': {
      'en': 'File already analyzed (cached result)',
      'de': 'Datei bereits analysiert (gecachtes Ergebnis)',
      'tr': 'Dosya zaten analiz edildi (önbelleğe alınmış sonuç)'
    },

    // Platform Names
    'platform.youtube': {
      'en': '📺 YouTube',
      'de': '📺 YouTube',
      'tr': '📺 YouTube'
    },
    'platform.instagram': {
      'en': '📷 Instagram',
      'de': '📷 Instagram', 
      'tr': '📷 Instagram'
    },
    'platform.tiktok': {
      'en': '🎵 TikTok',
      'de': '🎵 TikTok',
      'tr': '🎵 TikTok'
    },
    'platform.twitter': {
      'en': '🐦 Twitter/X',
      'de': '🐦 Twitter/X',
      'tr': '🐦 Twitter/X'
    },
    'platform.facebook': {
      'en': '👥 Facebook',
      'de': '👥 Facebook',
      'tr': '👥 Facebook'
    },
    'platform.vimeo': {
      'en': '🎬 Vimeo',
      'de': '🎬 Vimeo',
      'tr': '🎬 Vimeo'
    },
    'platform.dailymotion': {
      'en': '📹 DailyMotion',
      'de': '📹 DailyMotion',
      'tr': '📹 DailyMotion'
    },
    'platform.direct.image': {
      'en': '🖼️ Direct Image',
      'de': '🖼️ Direktes Bild',
      'tr': '🖼️ Direkt Görsel'
    },
    'platform.direct.video': {
      'en': '🎥 Direct Video',
      'de': '🎥 Direktes Video',
      'tr': '🎥 Direkt Video'
    },
    'platform.webpage': {
      'en': '🌐 Webpage',
      'de': '🌐 Webseite',
      'tr': '🌐 Web Sayfası'
    },

    // Instagram Error Messages
    'error.instagram.homepage': {
      'en': 'Instagram homepage is not accepted. Please enter a specific post link.',
      'de': 'Instagram-Startseite wird nicht akzeptiert. Bitte geben Sie einen spezifischen Beitragslink ein.',
      'tr': 'Instagram ana sayfası kabul edilmiyor. Lütfen belirli bir gönderi bağlantısı girin.'
    },
    'error.instagram.post.invalid': {
      'en': 'Only Instagram posts, reels, stories or IGTV links are accepted.',
      'de': 'Nur Instagram-Beiträge, Reels, Storys oder IGTV-Links werden akzeptiert.',
      'tr': 'Sadece Instagram gönderi, reel, hikaye veya IGTV bağlantıları kabul edilir.'
    },
    'error.instagram.link.invalid': {
      'en': 'Please enter a valid Instagram post link.',
      'de': 'Bitte geben Sie einen gültigen Instagram-Beitragslink ein.',
      'tr': 'Geçerli bir Instagram gönderi bağlantısı girin.'
    },

    // TikTok Error Messages
    'error.tiktok.homepage': {
      'en': 'TikTok homepage is not accepted. Please enter a specific video link.',
      'de': 'TikTok-Startseite wird nicht akzeptiert. Bitte geben Sie einen spezifischen Videolink ein.',
      'tr': 'TikTok ana sayfası kabul edilmiyor. Lütfen belirli bir video bağlantısı girin.'
    },
    'error.tiktok.video.invalid': {
      'en': 'Only TikTok video links are accepted.',
      'de': 'Nur TikTok-Videolinks werden akzeptiert.',
      'tr': 'Sadece TikTok video bağlantıları kabul edilir.'
    },

    // Twitter/X Error Messages
    'error.twitter.homepage': {
      'en': 'Twitter homepage is not accepted. Please enter a specific tweet link.',
      'de': 'Twitter-Startseite wird nicht akzeptiert. Bitte geben Sie einen spezifischen Tweet-Link ein.',
      'tr': 'Twitter ana sayfası kabul edilmiyor. Lütfen belirli bir tweet bağlantısı girin.'
    },
    'error.twitter.tweet.invalid': {
      'en': 'Please enter a valid tweet link. Example: https://twitter.com/username/status/123456789',
      'de': 'Bitte geben Sie einen gültigen Tweet-Link ein. Beispiel: https://twitter.com/username/status/123456789',
      'tr': 'Geçerli bir tweet bağlantısı girin. Örnek: https://twitter.com/username/status/123456789'
    },

    // Facebook Error Messages
    'error.facebook.homepage': {
      'en': 'Facebook homepage is not accepted. Please enter a specific post link.',
      'de': 'Facebook-Startseite wird nicht akzeptiert. Bitte geben Sie einen spezifischen Beitragslink ein.',
      'tr': 'Facebook ana sayfası kabul edilmiyor. Lütfen belirli bir gönderi bağlantısı girin.'
    },
    'error.facebook.post.invalid': {
      'en': 'Only Facebook posts, photos or video links are accepted.',
      'de': 'Nur Facebook-Beiträge, Foto- oder Videolinks werden akzeptiert.',
      'tr': 'Sadece Facebook gönderi, fotoğraf veya video bağlantıları kabul edilir.'
    },

    // Vimeo Error Messages
    'error.vimeo.homepage': {
      'en': 'Vimeo homepage is not accepted. Please enter a specific video link.',
      'de': 'Vimeo-Startseite wird nicht akzeptiert. Bitte geben Sie einen spezifischen Videolink ein.',
      'tr': 'Vimeo ana sayfası kabul edilmiyor. Lütfen belirli bir video bağlantısı girin.'
    },
    'error.vimeo.video.invalid': {
      'en': 'Please enter a valid Vimeo video link. Example: https://vimeo.com/123456789',
      'de': 'Bitte geben Sie einen gültigen Vimeo-Videolink ein. Beispiel: https://vimeo.com/123456789',
      'tr': 'Geçerli bir Vimeo video bağlantısı girin. Örnek: https://vimeo.com/123456789'
    },

    // DailyMotion Error Messages
    'error.dailymotion.homepage': {
      'en': 'DailyMotion homepage is not accepted. Please enter a specific video link.',
      'de': 'DailyMotion-Startseite wird nicht akzeptiert. Bitte geben Sie einen spezifischen Videolink ein.',
      'tr': 'DailyMotion ana sayfası kabul edilmiyor. Lütfen belirli bir video bağlantısı girin.'
    },
    'error.dailymotion.video.invalid': {
      'en': 'Please enter a valid DailyMotion video link.',
      'de': 'Bitte geben Sie einen gültigen DailyMotion-Videolink ein.',
      'tr': 'Geçerli bir DailyMotion video bağlantısı girin.'
    },

    // Artlist Error Messages  
    'error.artlist.homepage': {
      'en': 'Artlist homepage is not accepted. Please enter a specific image link.',
      'de': 'Artlist-Startseite wird nicht akzeptiert. Bitte geben Sie einen spezifischen Bildlink ein.',
      'tr': 'Artlist ana sayfası kabul edilmiyor. Lütfen belirli bir görsel bağlantısı girin.'
    },
    'error.artlist.link.invalid': {
      'en': 'Only Artlist image examples or AI-generated content links are accepted.',
      'de': 'Nur Artlist-Bildbeispiele oder KI-generierte Inhaltslinks werden akzeptiert.',
      'tr': 'Sadece Artlist görsel örnekleri veya AI üretimi bağlantıları kabul edilir.'
    },

    // PWA Install Messages
    'pwa.install.app': {
      'en': 'Install App',
      'de': 'App installieren',
      'tr': 'Uygulamayı Yükle'
    },
    'pwa.install.title': {
      'en': 'Install DeepCheck as an app',
      'de': 'DeepCheck als App installieren',
      'tr': 'DeepCheck\'i uygulama olarak yükle'
    },
    'pwa.share.result': {
      'en': 'Share Result',
      'de': 'Ergebnis teilen',
      'tr': 'Sonucu Paylaş'
    },
    'pwa.copy.result': {
      'en': 'Copy',
      'de': 'Kopieren',
      'tr': 'Kopyala'
    },
    'pwa.share.title': {
      'en': 'Share result',
      'de': 'Ergebnis teilen',
      'tr': 'Sonucu paylaş'
    },
    'pwa.copy.title': {
      'en': 'Copy to clipboard',
      'de': 'In Zwischenablage kopieren',
      'tr': 'Panoya kopyala'
    },
    'pwa.update.message': {
      'en': 'A new version of DeepCheck is available. Would you like to update now?',
      'de': 'Eine neue Version von DeepCheck ist verfügbar. Möchten Sie jetzt aktualisieren?',
      'tr': 'DeepCheck\'in yeni bir sürümü mevcut. Şimdi güncellemek ister misiniz?'
    },
    'pwa.update.failed': {
      'en': 'Update failed. Please try again later.',
      'de': 'Update fehlgeschlagen. Bitte versuchen Sie es später erneut.',
      'tr': 'Güncelleme başarısız. Lütfen daha sonra tekrar deneyin.'
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
