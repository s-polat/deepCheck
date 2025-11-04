import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AnalysisResult } from '../../services/api.service';
import { SimpleLanguageService } from '../../services/simple-language.service';
import { ResultService } from '../../services/result.service';
import { PwaService } from '../../services/pwa.service';

@Component({
  selector: 'app-result-view',
  imports: [CommonModule],
  templateUrl: './result-view.component.html',
  styleUrl: './result-view.component.scss'
})
export class ResultViewComponent implements OnInit, OnDestroy {
  @Input() result: AnalysisResult | null = null;
  private resultSubscription?: Subscription;
  
  constructor(
    public langService: SimpleLanguageService,
    private resultService: ResultService,
    private pwaService: PwaService
  ) {}

  ngOnInit() {
    // ResultService'den gelen sonuçları dinle
    this.resultSubscription = this.resultService.result$.subscribe(result => {
      this.result = result;
    });
  }

  ngOnDestroy() {
    if (this.resultSubscription) {
      this.resultSubscription.unsubscribe();
    }
  }

  getConfidenceColor(): string {
    if (!this.result) return 'secondary';
    
    if (this.result.confidence >= 0.8) return 'success';
    if (this.result.confidence >= 0.6) return 'warning';
    return 'danger';
  }

  getConfidenceText(): string {
    if (!this.result) return '';
    
    if (this.result.confidence >= 0.8) return this.langService.translate('confidence.high');
    if (this.result.confidence >= 0.6) return this.langService.translate('confidence.medium');
    return this.langService.translate('confidence.low');
  }

  getResultIcon(): string {
    if (!this.result) return '';
    return this.result.is_ai_generated ? '🤖' : '📸';
  }

  getResultText(): string {
    if (!this.result) return '';
    return this.result.is_ai_generated ? 
      this.langService.translate('result.ai.generated') : 
      this.langService.translate('result.real.content');
  }

  getResultClass(): string {
    if (!this.result) return '';
    return this.result.is_ai_generated ? 'ai-generated' : 'real-content';
  }

  getAiWarningText(): string {
    return this.langService.translate('result.ai.warning', {
      confidence: this.getConfidenceText().toLowerCase()
    });
  }

  getRealConfirmationText(): string {
    return this.langService.translate('result.real.confirmation', {
      confidence: this.getConfidenceText().toLowerCase()
    });
  }

  // PWA Share functionality
  async shareResult(): Promise<void> {
    if (!this.result) return;
    
    const shareData = {
      title: 'DeepCheck Analysis Result',
      text: `${this.langService.translate('result.analysis.result')}: ${
        this.result.is_ai_generated ? 
        this.langService.translate('result.ai.generated') : 
        this.langService.translate('result.real.content')
      } (${Math.round(this.result.confidence * 100)}% ${this.langService.translate('confidence.ratio').toLowerCase()})`,
      url: window.location.href
    };
    
    const shared = await this.pwaService.shareResult(shareData);
    if (shared && this.pwaService.isInstalled) {
      // Show notification if app is installed
      this.pwaService.showNotification(
        'Result Shared!',
        { 
          body: 'Analysis result has been shared successfully.',
          tag: 'share-success'
        }
      );
    }
  }

  // Copy result to clipboard
  async copyToClipboard(): Promise<void> {
    if (!this.result) return;
    
    const resultText = `DeepCheck Analysis Result:
${this.result.is_ai_generated ? 'AI Generated' : 'Real Content'}
Confidence: ${Math.round(this.result.confidence * 100)}%
Analysis Time: ${this.result.analysis_time.toFixed(2)} seconds
Model: ${this.result.model_version}`;

    try {
      await navigator.clipboard.writeText(resultText);
      // Result copied to clipboard
    } catch (error) {
      // Failed to copy to clipboard
    }
  }
}
