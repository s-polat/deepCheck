import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, AnalysisResult } from '../../services/api.service';
import { SimpleLanguageService } from '../../services/simple-language.service';
import { ResultService } from '../../services/result.service';
import { URL_TEMPLATES, getTemplateUrl, PlatformTemplate } from '../../config/url-templates.config';

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

  // Cache sistemi için
  private analysisCache = new Map<string, AnalysisResult>();
  private currentFileHash: string = '';
  public isAnalyzed: boolean = false;

  // Dosya kısıtlamaları
  private readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
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
    'dailymotion.com', 'www.dailymotion.com',
    // Image hosting sites
    'imgur.com', 'i.imgur.com',
    'images.unsplash.com', 'unsplash.com',
    'via.placeholder.com',
    'picsum.photos',
    'cdn.pixabay.com',
    'images.pexels.com',
    // AI Image platforms
    'artlist.io',
    'leonardo.ai',
    'midjourney.com',
    'openai.com'
  ];
  
  private readonly ALLOWED_EXTENSIONS = [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp',
    '.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'
  ];

  // URL Templates imported from config (best practice: centralized configuration)
  public readonly urlTemplates = URL_TEMPLATES;

  constructor(
    private apiService: ApiService,
    public langService: SimpleLanguageService,
    private resultService: ResultService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Check backend status on component initialization
    this.checkBackendStatus();
    
    // Retry after 2 seconds to ensure connection
    setTimeout(() => {
      this.checkBackendStatus();
    }, 2000);
  }

  public checkBackendStatus() {
    this.apiService.getHealthStatus().subscribe({
      next: (response) => {
        // Check if backend is healthy
        this.backendAvailable = response && response.status === 'healthy';
        
        // Trigger change detection
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.backendAvailable = false;
        this.cdr.detectChanges();
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
    
    // Update cache state for new file
    this.updateFileState(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // Cache & Hash Utility Methods
  private async generateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private getCacheKey(fileHash: string): string {
    return `analysis_${fileHash}_${this.fileName || 'unknown'}`;
  }

  private async updateFileState(file: File) {
    this.currentFileHash = await this.generateFileHash(file);
    
    // Check if this file has been analyzed before
    const analysisKey = this.getCacheKey(this.currentFileHash);
    
    this.isAnalyzed = this.analysisCache.has(analysisKey);

    // Show cached result if available
    if (this.isAnalyzed) {
      const cachedResult = this.analysisCache.get(analysisKey);
      if (cachedResult) {
        this.result = cachedResult;
        this.resultService.setResult(cachedResult);
      }
    }
  }

  private cacheAnalysisResult(result: AnalysisResult) {
    if (this.currentFileHash) {
      const cacheKey = this.getCacheKey(this.currentFileHash);
      
      this.analysisCache.set(cacheKey, result);
      this.isAnalyzed = true;
    }
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

      // Direkt medya dosyası kontrolü (öncelikli)
      // Query parametrelerini temizle ve sadece dosya yolunu kontrol et
      const cleanPathname = pathname.split('?')[0].split('#')[0].toLowerCase();
      const isDirectMedia = this.ALLOWED_EXTENSIONS.some(ext => 
        cleanPathname.endsWith(ext.toLowerCase())
      );

      if (isDirectMedia) {
        // Direkt medya dosyası ise diğer kontrolleri atla
        this.isValidUrl = true;
        return;
      }

      // Sosyal medya platform kontrolü (sadece direkt medya değilse)
      const contentValidation = this.validatePlatformContent(hostname, pathname, searchParams);
      
      if (!contentValidation.isValid) {
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

  setExampleUrl(templateKey: string) {
    // Get URL template based on key using centralized config
    const template = getTemplateUrl(templateKey);
    if (template) {
      this.mediaUrl = template;
      this.validateUrl();
    }
  }

  // Method to get example URL by key (for HTML template)
  getExampleUrl(templateKey: string): string {
    return getTemplateUrl(templateKey);
  }

  // Method to get template info for UI
  getTemplateInfo(templateKey: string): PlatformTemplate | undefined {
    return this.urlTemplates[templateKey];
  }

  clearFile() {
    this.selectedFile = null;
    this.fileName = '';
    this.errorMessage = '';
    this.result = null;
    
    // Reset cache state
    this.currentFileHash = '';
    this.isAnalyzed = false;
    
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
      // Check if file is already analyzed
      if (this.isAnalyzed && this.currentFileHash) {
        const cacheKey = this.getCacheKey(this.currentFileHash);
        const cachedResult = this.analysisCache.get(cacheKey);
        if (cachedResult) {
          this.result = cachedResult;
          this.resultService.setResult(cachedResult);
          return;
        }
      }

      this.loading = true;
      this.result = null;
      this.errorMessage = '';

      if (this.backendAvailable) {
        // Backend API çağrısı (demo veya production modu backend'de belirleniyor)
        this.apiService.analyzeFile(this.selectedFile).subscribe({
          next: (response) => {
            this.loading = false;
            if (response.success && response.result) {
              this.result = response.result;
              this.resultService.setResult(response.result);
              
              // Cache the result
              this.cacheAnalysisResult(response.result);
            } else {
              this.errorMessage = response.error || 'Analiz sırasında bir hata oluştu.';
            }
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = 'Backend bağlantı hatası. Lütfen daha sonra tekrar deneyin.';
            // Fallback olarak frontend demo
            this.runDemoAnalysis();
          }
        });
      } else {
        // Backend mevcut değil - frontend demo modu
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
      
      // Cache demo result too
      this.cacheAnalysisResult(this.result);
      this.loading = false;
    }, 2000);
  }

  analyzeLink() {
    if (this.mediaUrl && this.isValidUrl && !this.linkErrorMessage) {
      this.loading = true;
      this.result = null;
      this.linkErrorMessage = '';

      if (this.backendAvailable) {
        // Backend API çağrısı (demo veya production modu backend'de belirleniyor)
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
            this.linkErrorMessage = 'Backend bağlantı hatası. Lütfen daha sonra tekrar deneyin.';
            // Fallback olarak frontend demo
            this.runDemoAnalysis();
          }
        });
      } else {
        // Backend mevcut değil - frontend demo modu
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
        return this.langService.translate('platform.youtube');
      } else if (hostname.includes('instagram.com')) {
        return this.langService.translate('platform.instagram');
      } else if (hostname.includes('tiktok.com')) {
        return this.langService.translate('platform.tiktok');
      } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
        return this.langService.translate('platform.twitter');
      } else if (hostname.includes('facebook.com')) {
        return this.langService.translate('platform.facebook');
      } else if (hostname.includes('vimeo.com')) {
        return this.langService.translate('platform.vimeo');
      } else if (hostname.includes('dailymotion.com')) {
        return this.langService.translate('platform.dailymotion');
      } else if (hostname.includes('artlist.io')) {
        return '🤖 Artlist AI';
      } else {
        // Direkt medya dosyası kontrolü
        const cleanPathname = url.pathname.split('?')[0].split('#')[0].toLowerCase();
        if (this.ALLOWED_EXTENSIONS.some(ext => cleanPathname.endsWith(ext.toLowerCase()))) {
          // Dosya türüne göre ikon belirle
          if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'].some(ext => cleanPathname.endsWith(ext))) {
            return this.langService.translate('platform.direct.image');
          } else {
            return this.langService.translate('platform.direct.video');
          }
        }
      }
    } catch (error) {
      return '';
    }
    
    return this.langService.translate('platform.webpage');
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
          errorMessage: this.langService.translate('error.instagram.homepage')
        };
      }
      
      // Gönderi, reel veya hikaye kontrolleri
      if (!pathname.startsWith('/p/') && 
          !pathname.startsWith('/reel/') && 
          !pathname.startsWith('/stories/') &&
          !pathname.startsWith('/tv/')) {
        return {
          isValid: false,
          errorMessage: this.langService.translate('error.instagram.post.invalid')
        };
      }
      
      // Bağlantı uzunluk kontrolü (Instagram ID'leri genellikle 11 karakter)
      const segments = pathname.split('/').filter(s => s);
      if (segments.length < 2) {
        return {
          isValid: false,
          errorMessage: this.langService.translate('error.instagram.link.invalid')
        };
      }
    }
    
    // TikTok kontrolleri
    else if (hostname.includes('tiktok.com')) {
      if (pathname === '/' || pathname === '') {
        return {
          isValid: false,
          errorMessage: this.langService.translate('error.tiktok.homepage')
        };
      }
      
      // TikTok video kontrolleri
      if (!pathname.includes('/video/') && !pathname.startsWith('/@')) {
        return {
          isValid: false,
          errorMessage: this.langService.translate('error.tiktok.video.invalid')
        };
      }
    }
    
    // Twitter/X kontrolleri
    else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      if (pathname === '/' || pathname === '') {
        return {
          isValid: false,
          errorMessage: this.langService.translate('error.twitter.homepage')
        };
      }
      
      // Tweet kontrolleri - /username/status/tweet_id formatı
      const pathParts = pathname.split('/').filter(s => s);
      if (pathParts.length < 3 || pathParts[1] !== 'status') {
        return {
          isValid: false,
          errorMessage: this.langService.translate('error.twitter.tweet.invalid')
        };
      }
    }
    
    // Facebook kontrolleri
    else if (hostname.includes('facebook.com')) {
      if (pathname === '/' || pathname === '') {
        return {
          isValid: false,
          errorMessage: this.langService.translate('error.facebook.homepage')
        };
      }
      
      // Facebook gönderi kontrolleri
      if (!pathname.includes('/posts/') && 
          !pathname.includes('/photos/') && 
          !pathname.includes('/videos/') &&
          !pathname.includes('/watch/')) {
        return {
          isValid: false,
          errorMessage: this.langService.translate('error.facebook.post.invalid')
        };
      }
    }
    
    // Vimeo kontrolleri
    else if (hostname.includes('vimeo.com')) {
      if (pathname === '/' || pathname === '') {
        return {
          isValid: false,
          errorMessage: this.langService.translate('error.vimeo.homepage')
        };
      }
      
      // Vimeo video ID kontrolleri (genellikle sadece rakamlar)
      const videoId = pathname.substring(1);
      if (!/^\d+$/.test(videoId)) {
        return {
          isValid: false,
          errorMessage: this.langService.translate('error.vimeo.video.invalid')
        };
      }
    }
    
    // DailyMotion kontrolleri
    else if (hostname.includes('dailymotion.com')) {
      if (pathname === '/' || pathname === '') {
        return {
          isValid: false,
          errorMessage: this.langService.translate('error.dailymotion.homepage')
        };
      }
      
      // DailyMotion video kontrolleri
      if (!pathname.startsWith('/video/')) {
        return {
          isValid: false,
          errorMessage: this.langService.translate('error.dailymotion.video.invalid')
        };
      }
    }
    
    // AI Image Platform kontrolleri
    else if (hostname.includes('artlist.io')) {
      if (pathname === '/' || pathname === '') {
        return {
          isValid: false,
          errorMessage: this.langService.translate('error.artlist.homepage')
        };
      }
      
      // Artlist için daha esnek URL kontrolü - text-to-image ile başlıyorsa kabul et
      if (!pathname.includes('/text-to-image') && !pathname.includes('/examples/') && !pathname.includes('/image/')) {
        return {
          isValid: false,
          errorMessage: this.langService.translate('error.artlist.link.invalid')
        };
      }
    }
    
    // Diğer domain kontrolleri - direkt medya dosyası veya bilinen domain kontrolü
    else {
      // Önce direkt medya dosyası mı kontrol et
      const cleanPathname = pathname.split('?')[0].split('#')[0].toLowerCase();
      const isDirectMedia = this.ALLOWED_EXTENSIONS.some(ext => 
        cleanPathname.endsWith(ext.toLowerCase())
      );
      
      if (isDirectMedia) {
        // Direkt medya dosyası ise domain kontrolü yapmadan kabul et
        return { isValid: true, errorMessage: '' };
      }
      
      // Direkt medya dosyası değilse, bilinen domainleri kontrol et
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

  // Category-based platform getters for UI organization (returns arrays for *ngFor)
  getSocialPlatforms(): Array<{key: string, template: PlatformTemplate}> {
    return Object.entries(this.urlTemplates)
      .filter(([_, template]) => template.category === 'social')
      .map(([key, template]) => ({key, template}));
  }

  getVideoPlatforms(): Array<{key: string, template: PlatformTemplate}> {
    return Object.entries(this.urlTemplates)
      .filter(([_, template]) => template.category === 'video')
      .map(([key, template]) => ({key, template}));
  }

  getAIPlatforms(): Array<{key: string, template: PlatformTemplate}> {
    return Object.entries(this.urlTemplates)
      .filter(([_, template]) => template.category === 'ai')
      .map(([key, template]) => ({key, template}));
  }

  getDirectMediaPlatforms(): Array<{key: string, template: PlatformTemplate}> {
    return Object.entries(this.urlTemplates)
      .filter(([_, template]) => template.category === 'direct')
      .map(([key, template]) => ({key, template}));
  }
}
