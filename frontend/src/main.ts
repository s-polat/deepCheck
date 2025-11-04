import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Simple PWA Service Worker Registration with update handling
let updatePromptShown = false;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        // Check for updates every 5 minutes
        setInterval(() => {
          registration.update();
        }, 5 * 60 * 1000);

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker && !updatePromptShown) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                updatePromptShown = true;
                setTimeout(() => {
                  if (confirm('Eine neue Version ist verfügbar. Jetzt aktualisieren?')) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                    setTimeout(() => window.location.reload(), 100);
                  }
                }, 1000); // Delay to prevent immediate prompts
              }
            });
          }
        });
      })
      .catch((registrationError) => {
        // Service worker registration failed
      });
  });

  // Listen for controller changes
  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    if (!updatePromptShown) {
      window.location.reload();
    }
  });
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => {
    // Application bootstrap failed
  });
