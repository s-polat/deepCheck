import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, AnalysisResult } from '../../services/api.service';
import { SimpleLanguageService } from '../../services/simple-language.service';
import { ResultService } from '../../services/result.service';

@Component({
  selector: 'app-upload-area',
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-area.component.html',
  styleUrl: './upload-area.component.scss'
})
export class UploadAreaComponent implements OnInit {
  selectedFile: File | null = null;
  fileName: string = '';
  mediaUrl: string = '';
  loading: boolean = false;
  result: any = null;
  errorMessage: string = '';
  linkErrorMessage: string = '';
  isValidUrl: boolean = false;
  backendAvailable: boolean = false;

  // Dosya kısıtlamaları
  private readonly MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly MAX_VIDEO_SIZE = 30 * 1024 * 1024; // 30MB
  private readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  private readonly ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'];

  // URL kısıtlamaları
  private readonly ALLOWED_DOMAINS = [
    'youtube.com', 'www.youtube.com', 'youtu.be',
    'instagram.com', 'www.instagram.com',
    'tiktok.com', 'www.tiktok.com',
    'twitter.com', 'www.twitter.com', 'x.com', 'www.x.com',
    'facebook.com', 'www.facebook.com',
    'vimeo.com', 'www.vimeo.com',
    'dailymotion.com', 'www.dailymotion.com'
  ];
  
  private readonly ALLOWED_EXTENSIONS = [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp',
    '.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'
  ];

  constructor(
    private apiService: ApiService,
    public langService: SimpleLanguageService,
    private resultService: ResultService
  ) {}

  ngOnInit() {
    // Backend durumunu kontrol et
    this.checkBackendStatus();
  }

  private checkBackendStatus() {
    this.apiService.getHealthStatus().subscribe({
      next: (response) => {
        this.backendAvailable = response.status === 'healthy';
        console.log('Backend durum:', response);
      },
      error: (error) => {
        this.backendAvailable = false;
        console.log('Backend bağlantısı yok, demo modda çalışılıyor');
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.validateAndSetFile(file);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.validateAndSetFile(files[0]);
    }
  }

  private validateAndSetFile(file: File) {
    this.errorMessage = '';
    
    // Dosya türü kontrolü
    const isImage = this.ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = this.ALLOWED_VIDEO_TYPES.includes(file.type);
    
    if (!isImage && !isVideo) {
      this.errorMessage = this.langService.translate('error.file.type.invalid');
      this.selectedFile = null;
      this.fileName = '';
      return;
    }

    // Dosya boyutu kontrolü
    if (isImage && file.size > this.MAX_IMAGE_SIZE) {
      this.errorMessage = this.langService.translate('error.image.size.limit');
      this.selectedFile = null;
      this.fileName = '';
      return;
    }

    if (isVideo && file.size > this.MAX_VIDEO_SIZE) {
      this.errorMessage = this.langService.translate('error.video.size.limit');
      this.selectedFile = null;
      this.fileName = '';
      return;
    }

    // Dosya geçerli
    this.selectedFile = file;
    this.fileName = file.name;
    this.errorMessage = '';
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // URL doğrulama
  validateUrl() {
    this.linkErrorMessage = '';
    this.isValidUrl = false;

    if (!this.mediaUrl.trim()) {
      return;
    }

    try {
      const url = new URL(this.mediaUrl);
      
      // Protokol kontrolü
      if (!['http:', 'https:'].includes(url.protocol)) {
        this.linkErrorMessage = this.langService.translate('error.url.protocol.invalid');
        return;
      }

      // Domain kontrolü
      const hostname = url.hostname.toLowerCase();
      const pathname = url.pathname.toLowerCase();
      const searchParams = url.searchParams;

      // Direkt medya dosyası kontrolü
      const isDirectMedia = this.ALLOWED_EXTENSIONS.some(ext => 
        pathname.endsWith(ext)
      );

      // Platform spesifik içerik kontrolü
      const contentValidation = this.validatePlatformContent(hostname, pathname, searchParams);
      
      if (!contentValidation.isValid && !isDirectMedia) {
        this.linkErrorMessage = contentValidation.errorMessage;
        return;
      }

      // URL uzunluk kontrolü
      if (this.mediaUrl.length > 2048) {
        this.linkErrorMessage = this.langService.translate('error.url.too.long');
        return;
      }

      // Güvenli karakter kontrolü
      const dangerousPatterns = [
        /javascript:/i,
        /data:/i,
        /vbscript:/i,
        /<script/i,
        /onload=/i,
        /onerror=/i
      ];

      if (dangerousPatterns.some(pattern => pattern.test(this.mediaUrl))) {
        this.linkErrorMessage = this.langService.translate('error.url.unsafe.content');
        return;
      }

      this.isValidUrl = true;
    } catch (error) {
      this.linkErrorMessage = this.langService.translate('error.url.invalid.format');
    }
  }

  onUrlInput() {
    this.validateUrl();
  }

  setExampleUrl(url: string) {
    this.mediaUrl = url;
    this.validateUrl();
  }

  clearFile() {
    this.selectedFile = null;
    this.fileName = '';
    this.errorMessage = '';
    this.result = null;
    
    // File input'u temizle
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  clearUrl() {
    this.mediaUrl = '';
    this.linkErrorMessage = '';
    this.isValidUrl = false;
    this.result = null;
  }

  // Ana analiz metodunu - dosya veya URL'ye göre uygun metodu çağırır
  startAnalysis() {
    if (this.selectedFile && !this.errorMessage) {
      this.analyzeFile();
    } else if (this.mediaUrl && this.isValidUrl && !this.linkErrorMessage) {
      this.analyzeLink();
    }
  }

  analyzeFile() {
    if (this.selectedFile && !this.errorMessage) {
      this.loading = true;
      this.result = null;
      this.errorMessage = '';

      if (this.backendAvailable) {
        // Gerçek backend API çağrısı
        this.apiService.analyzeFile(this.selectedFile).subscribe({
          next: (response) => {
            this.loading = false;
            if (response.success && response.result) {
              this.result = response.result;
              this.resultService.setResult(response.result);
            } else {
              this.errorMessage = response.error || 'Analiz sırasında bir hata oluştu.';
            }
          },
          error: (error) => {
            this.loading = false;
            console.error('API Hatası:', error);
            this.errorMessage = 'Backend bağlantı hatası. Lütfen daha sonra tekrar deneyin.';
            // Backend hata durumunda demo modu
            this.runDemoAnalysis();
          }
        });
      } else {
        // Demo modu - backend yok
        this.runDemoAnalysis();
      }
    }
  }

  private runDemoAnalysis() {
    // Demo analiz simülasyonu
    setTimeout(() => {
      this.result = {
        is_ai_generated: Math.random() > 0.5,
        confidence: Math.random() * 0.4 + 0.6, // 0.6-1.0 arası güven skoru
        analysis_time: Math.random() * 2 + 1, // 1-3 saniye arası
        model_version: 'Demo v1.0',
        details: {
          artifacts: Math.random() > 0.5 ? ['Pixel artifacts detected', 'Unusual compression patterns'] : [],
          probability_scores: {
            'AI Generated': Math.random(),
            'Real Image': Math.random(),
            'Edited Image': Math.random()
          }
        }
      };
      this.resultService.setResult(this.result);
      this.loading = false;
    }, 2000);
  }

  analyzeLink() {
    if (this.mediaUrl && this.isValidUrl && !this.linkErrorMessage) {
      this.loading = true;
      this.result = null;
      this.linkErrorMessage = '';

      if (this.backendAvailable) {
        // Gerçek backend API çağrısı
        this.apiService.analyzeUrl(this.mediaUrl).subscribe({
          next: (response) => {
            this.loading = false;
            if (response.success && response.result) {
              this.result = response.result;
              this.resultService.setResult(response.result);
            } else {
              this.linkErrorMessage = response.error || 'URL analizi sırasında bir hata oluştu.';
            }
          },
          error: (error) => {
            this.loading = false;
            console.error('API Hatası:', error);
            this.linkErrorMessage = 'Backend bağlantı hatası. Lütfen daha sonra tekrar deneyin.';
            // Backend hata durumunda demo modu
            this.runDemoAnalysis();
          }
        });
      } else {
        // Demo modu - backend yok
        this.runDemoAnalysis();
      }
    }
  }

  // Dosya boyutunu okunabilir formatta göster
  getFileSize(): string {
    if (!this.selectedFile) return '';
    
    const bytes = this.selectedFile.size;
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Dosya türünü kontrol et
  getFileType(): string {
    if (!this.selectedFile) return '';
    
    if (this.ALLOWED_IMAGE_TYPES.includes(this.selectedFile.type)) {
      return this.langService.translate('file.type.photo');
    } else if (this.ALLOWED_VIDEO_TYPES.includes(this.selectedFile.type)) {
      return this.langService.translate('file.type.video');
    }
    return this.langService.translate('file.type.file');
  }

  // URL'den platform bilgisini çıkar
  getPlatformInfo(): string {
    if (!this.mediaUrl || !this.isValidUrl) return '';
    
    try {
      const url = new URL(this.mediaUrl);
      const hostname = url.hostname.toLowerCase();
      
      if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        return '📺 YouTube';
      } else if (hostname.includes('instagram.com')) {
        return '📱 Instagram';
      } else if (hostname.includes('tiktok.com')) {
        return '🎵 TikTok';
      } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
        return '🐦 Twitter/X';
      } else if (hostname.includes('facebook.com')) {
        return '📘 Facebook';
      } else if (hostname.includes('vimeo.com')) {
        return '🎬 Vimeo';
      } else if (hostname.includes('dailymotion.com')) {
        return '📹 DailyMotion';
      } else {
        // Direkt medya dosyası kontrolü
        const pathname = url.pathname.toLowerCase();
        if (this.ALLOWED_EXTENSIONS.some(ext => pathname.endsWith(ext))) {
          return '📁 Direkt Medya';
        }
      }
    } catch (error) {
      return '';
    }
    
    return '🌐 Web Bağlantısı';
  }

  // Platform-spesifik URL içerik doğrulaması
  private validatePlatformContent(hostname: string, pathname: string, searchParams: URLSearchParams): {isValid: boolean, errorMessage: string} {
    
    // YouTube kontrolleri
    if (hostname.includes('youtube.com')) {
      // Ana sayfa kontrolü
      if (pathname === '/' || pathname === '') {
        return {
          isValid: false,
          errorMessage: this.langService.translate('error.youtube.homepage')
        };
      }
      
      // Video ID kontrolleri
      if (pathname.startsWith('/watch')) {
        const videoId = searchParams.get('v');
        if (!videoId || videoId.length !== 11) {
          return {
            isValid: false,
            errorMessage: this.langService.translate('error.youtube.video.invalid')
          };
        }
      } else if (pathname.startsWith('/shorts/')) {
        const shortId = pathname.split('/shorts/')[1];
        if (!shortId || shortId.length < 10) {
          return {
            isValid: false,
            errorMessage: this.langService.translate('error.youtube.shorts.invalid')
          };
        }
      } else if (pathname.startsWith('/embed/')) {
        const embedId = pathname.split('/embed/')[1];
        if (!embedId || embedId.length !== 11) {        return {
          isValid: false,
          errorMessage: this.langService.translate('error.youtube.embed.invalid')
        };
        }
      } else {
        return {
          isValid: false,
          errorMessage: this.langService.translate('error.youtube.format.invalid')
        };
      }
    }
    
    // YouTube kısa bağlantı (youtu.be) kontrolleri
    else if (hostname.includes('youtu.be')) {
      const videoId = pathname.substring(1); // İlk '/' karakterini çıkar
      if (!videoId || videoId.length !== 11) {
        return {
          isValid: false,
          errorMessage: this.langService.translate('error.youtu.be.invalid')
        };
      }
    }
    
    // Instagram kontrolleri
    else if (hostname.includes('instagram.com')) {
      if (pathname === '/' || pathname === '') {
        return {
          isValid: false,
          errorMessage: 'Instagram ana sayfası kabul edilmiyor. Lütfen belirli bir gönderi bağlantısı girin.'
        };
      }
      
      // Gönderi, reel veya hikaye kontrolleri
      if (!pathname.startsWith('/p/') && 
          !pathname.startsWith('/reel/') && 
          !pathname.startsWith('/stories/') &&
          !pathname.startsWith('/tv/')) {
        return {
          isValid: false,
          errorMessage: 'Sadece Instagram gönderi, reel, hikaye veya IGTV bağlantıları kabul edilir.'
        };
      }
      
      // Bağlantı uzunluk kontrolü (Instagram ID'leri genellikle 11 karakter)
      const segments = pathname.split('/').filter(s => s);
      if (segments.length < 2) {
        return {
          isValid: false,
          errorMessage: 'Geçerli bir Instagram gönderi bağlantısı girin.'
        };
      }
    }
    
    // TikTok kontrolleri
    else if (hostname.includes('tiktok.com')) {
      if (pathname === '/' || pathname === '') {
        return {
          isValid: false,
          errorMessage: 'TikTok ana sayfası kabul edilmiyor. Lütfen belirli bir video bağlantısı girin.'
        };
      }
      
      // TikTok video kontrolleri
      if (!pathname.includes('/video/') && !pathname.startsWith('/@')) {
        return {
          isValid: false,
          errorMessage: 'Sadece TikTok video bağlantıları kabul edilir.'
        };
      }
    }
    
    // Twitter/X kontrolleri
    else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      if (pathname === '/' || pathname === '') {
        return {
          isValid: false,
          errorMessage: 'Twitter ana sayfası kabul edilmiyor. Lütfen belirli bir tweet bağlantısı girin.'
        };
      }
      
      // Tweet kontrolleri - /username/status/tweet_id formatı
      const pathParts = pathname.split('/').filter(s => s);
      if (pathParts.length < 3 || pathParts[1] !== 'status') {
        return {
          isValid: false,
          errorMessage: 'Geçerli bir tweet bağlantısı girin. Örnek: https://twitter.com/username/status/123456789'
        };
      }
    }
    
    // Facebook kontrolleri
    else if (hostname.includes('facebook.com')) {
      if (pathname === '/' || pathname === '') {
        return {
          isValid: false,
          errorMessage: 'Facebook ana sayfası kabul edilmiyor. Lütfen belirli bir gönderi bağlantısı girin.'
        };
      }
      
      // Facebook gönderi kontrolleri
      if (!pathname.includes('/posts/') && 
          !pathname.includes('/photos/') && 
          !pathname.includes('/videos/') &&
          !pathname.includes('/watch/')) {
        return {
          isValid: false,
          errorMessage: 'Sadece Facebook gönderi, fotoğraf veya video bağlantıları kabul edilir.'
        };
      }
    }
    
    // Vimeo kontrolleri
    else if (hostname.includes('vimeo.com')) {
      if (pathname === '/' || pathname === '') {
        return {
          isValid: false,
          errorMessage: 'Vimeo ana sayfası kabul edilmiyor. Lütfen belirli bir video bağlantısı girin.'
        };
      }
      
      // Vimeo video ID kontrolleri (genellikle sadece rakamlar)
      const videoId = pathname.substring(1);
      if (!/^\d+$/.test(videoId)) {
        return {
          isValid: false,
          errorMessage: 'Geçerli bir Vimeo video bağlantısı girin. Örnek: https://vimeo.com/123456789'
        };
      }
    }
    
    // DailyMotion kontrolleri
    else if (hostname.includes('dailymotion.com')) {
      if (pathname === '/' || pathname === '') {
        return {
          isValid: false,
          errorMessage: 'DailyMotion ana sayfası kabul edilmiyor. Lütfen belirli bir video bağlantısı girin.'
        };
      }
      
      // DailyMotion video kontrolleri
      if (!pathname.startsWith('/video/')) {
        return {
          isValid: false,
          errorMessage: 'Geçerli bir DailyMotion video bağlantısı girin.'
        };
      }
    }
    
    // Diğer domain kontrolleri - sadece direkt medya dosyalarına izin ver
    else {
      const isDomainAllowed = this.ALLOWED_DOMAINS.some(domain => 
        hostname === domain || hostname.endsWith('.' + domain)
      );
      
      if (!isDomainAllowed) {
        return {
          isValid: false,
          errorMessage: this.langService.translate('error.platform.unsupported')
        };
      }
    }
    
    return { isValid: true, errorMessage: '' };
  }
}
