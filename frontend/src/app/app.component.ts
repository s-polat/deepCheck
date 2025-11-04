import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UploadAreaComponent } from './components/upload-area/upload-area.component';
import { ResultViewComponent } from './components/result-view/result-view.component';
import { SimpleLanguageService } from './services/simple-language.service';
import { PwaService } from './services/pwa.service';
// Update service removed for now

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UploadAreaComponent, ResultViewComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'DeepCheck';
  
  constructor(
    public langService: SimpleLanguageService,
    public pwaService: PwaService
  ) {}

  ngOnInit() {
    // Request notification permission on app start
    this.pwaService.requestNotificationPermission();
  }

  changeLanguage(languageCode: string): void {
    this.langService.changeLanguage(languageCode);
  }

  // PWA Install functionality
  async installApp(): Promise<void> {
    const installed = await this.pwaService.installApp();
    if (installed) {
      // App installed successfully
    }
  }

  // Share functionality for analysis results
  async shareResult(result: any): Promise<void> {
    const shareData = {
      title: 'DeepCheck Analysis Result',
      text: `Analysis result: ${result.is_ai_generated ? 'AI Generated' : 'Real Content'} (${Math.round(result.confidence * 100)}% confidence)`,
      url: window.location.href
    };
    
    await this.pwaService.shareResult(shareData);
  }

  // Update dialog functionality moved to main.ts for now
}
