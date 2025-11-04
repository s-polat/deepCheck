import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface PWAInstallPrompt {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private deferredPrompt: PWAInstallPrompt | null = null;
  private installPromptSubject = new BehaviorSubject<boolean>(false);
  public installPromptEvent$ = this.installPromptSubject.asObservable();

  private updateAvailableSubject = new BehaviorSubject<boolean>(false);
  public updateAvailable$ = this.updateAvailableSubject.asObservable();

  constructor() {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.installPromptSubject.next(true);
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      this.installPromptSubject.next(false);
      this.deferredPrompt = null;
      this.showInstallSuccessMessage();
    });

    // Check if app is running in standalone mode
    this.checkStandaloneMode();

    // Monitor online/offline status
    this.monitorNetworkStatus();
    
    // Note: Install prompt will only be available in production with HTTPS
  }

  // Check if app can be installed
  get canInstall(): boolean {
    return !!this.deferredPrompt;
  }

  // Check if app is installed (running in standalone mode)
  get isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  // Trigger install prompt
  async installApp(): Promise<boolean> {
    // Development mode - no install available on localhost
    if (!window.location.href.startsWith('https://') && !this.deferredPrompt) {
      return false;
    }

    if (!this.deferredPrompt) {
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    } finally {
      this.deferredPrompt = null;
      this.installPromptSubject.next(false);
    }
  }

  // Check network status
  get isOnline(): boolean {
    return navigator.onLine;
  }

  // Monitor network status changes
  private monitorNetworkStatus() {
    const online$ = fromEvent(window, 'online').pipe(map(() => true));
    const offline$ = fromEvent(window, 'offline').pipe(map(() => false));
    
    merge(online$, offline$).subscribe((isOnline) => {
      this.handleNetworkChange(isOnline);
    });
  }

  private handleNetworkChange(isOnline: boolean) {
    if (isOnline) {
      this.showNetworkStatusMessage('You are back online!', 'success');
    } else {
      this.showNetworkStatusMessage('You are offline. Some features may not be available.', 'warning');
    }
  }

  private checkStandaloneMode() {
    if (this.isInstalled) {
      document.body.classList.add('pwa-standalone');
    }
  }

  private showInstallSuccessMessage() {
    this.showMessage('DeepCheck has been installed successfully!', 'success');
  }

  private showNetworkStatusMessage(message: string, type: 'success' | 'warning' | 'error') {
    // This could be integrated with a toast/notification service
  }

  private showMessage(message: string, type: 'success' | 'warning' | 'error') {
    // This could be integrated with a toast/notification service
  }

  // Share API for sharing analysis results
  async shareResult(data: {title: string, text: string, url?: string}): Promise<boolean> {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: data.text,
          url: data.url || window.location.href
        });
        return true;
      } catch (error) {
        // Error sharing
        return false;
      }
    } else {
      // Fallback to clipboard
      try {
        const shareText = `${data.title}\n${data.text}\n${data.url || window.location.href}`;
        await navigator.clipboard.writeText(shareText);
        this.showMessage('Result copied to clipboard!', 'success');
        return true;
      } catch (error) {
        // Error copying to clipboard
        return false;
      }
    }
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Show local notification
  showNotification(title: string, options?: NotificationOptions) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/icon-192x192.png',
        ...options
      });

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    }
    return null;
  }

  // Update service worker
  async updateServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        this.updateAvailableSubject.next(true);
      }
    }
  }

  // Get app info for about/settings page
  getAppInfo() {
    return {
      name: 'DeepCheck',
      version: '1.0.0',
      description: 'AI-powered photo and video verification tool',
      isInstalled: this.isInstalled,
      canInstall: this.canInstall,
      isOnline: this.isOnline,
      hasNotificationPermission: 'Notification' in window && Notification.permission === 'granted',
      hasShareAPI: 'share' in navigator,
      serviceWorkerSupported: 'serviceWorker' in navigator
    };
  }
}
