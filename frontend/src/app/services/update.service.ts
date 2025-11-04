import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  private updateAvailableSubject = new BehaviorSubject<boolean>(false);
  public updateAvailable$ = this.updateAvailableSubject.asObservable();
  
  private updateProcessing = false;
  private registration: ServiceWorkerRegistration | null = null;

  constructor() {
    if ('serviceWorker' in navigator) {
      this.initializeServiceWorker();
    }
  }

  private async initializeServiceWorker() {
    try {
      this.registration = await navigator.serviceWorker.getRegistration();
      
      if (this.registration) {
        // Listen for updates
        this.registration.addEventListener('updatefound', () => {
          this.handleUpdateFound();
        });

        // Listen for controller changes
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!this.updateProcessing) {
            // New service worker has taken control
            window.location.reload();
          }
        });

        // Check for updates periodically (every 30 seconds)
        setInterval(() => {
          if (!this.updateProcessing) {
            this.registration?.update();
          }
        }, 30000);
      }
    } catch (error) {
      // Service worker not available
    }
  }

  private handleUpdateFound() {
    if (!this.registration?.installing || this.updateProcessing) {
      return;
    }

    const newWorker = this.registration.installing;
    
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // New content is available
        this.updateAvailableSubject.next(true);
      }
    });
  }

  public async applyUpdate(): Promise<void> {
    if (this.updateProcessing || !this.registration?.waiting) {
      return;
    }

    this.updateProcessing = true;

    try {
      // Tell the waiting service worker to skip waiting
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Wait a bit for the service worker to take control
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reload the page
      window.location.reload();
    } catch (error) {
      this.updateProcessing = false;
      throw error;
    }
  }

  public dismissUpdate(): void {
    this.updateAvailableSubject.next(false);
  }
}
