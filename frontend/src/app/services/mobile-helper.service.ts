// PWA ve mobil özellikler için yardımcı servis

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MobileHelperService {
  private isMobileSubject = new BehaviorSubject<boolean>(false);
  public isMobile$ = this.isMobileSubject.asObservable();

  constructor() {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }

  private checkMobile() {
    const isMobile = window.innerWidth <= 768;
    this.isMobileSubject.next(isMobile);
  }

  isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  getViewportHeight(): number {
    return window.visualViewport?.height || window.innerHeight;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  vibrate(pattern: number | number[] = 50) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  // Dosya paylaşımı için Web Share API
  async shareFile(file: File, title: string = 'DeepCheck Sonucu') {
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title,
          text: 'AI analiz sonucu',
          files: [file]
        });
        return true;
      } catch (error) {
        console.log('Share cancelled or failed:', error);
        return false;
      }
    }
    return false;
  }

  // URL paylaşımı
  async shareUrl(url: string, title: string = 'DeepCheck - AI Verification', text: string = 'AI ile doğrulanmış içerik') {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return true;
      } catch (error) {
        console.log('Share cancelled or failed:', error);
        return false;
      }
    }
    // Fallback: clipboard
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch (error) {
      return false;
    }
  }
}
