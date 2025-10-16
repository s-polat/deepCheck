import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AnalysisResult } from '../../services/api.service';
import { SimpleLanguageService } from '../../services/simple-language.service';
import { ResultService } from '../../services/result.service';

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
    private resultService: ResultService
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

  // Consistency Check Helper Methods
  getConsistencyBadgeClass(consistencyScore?: string): string {
    switch(consistencyScore) {
      case 'HIGH': return 'bg-success';
      case 'MEDIUM': return 'bg-warning text-dark';
      case 'LOW': return 'bg-danger';
      default: return 'bg-info';
    }
  }

  getConsistencyAlertClass(consistencyScore?: string): string {
    switch(consistencyScore) {
      case 'HIGH': return 'alert-success';
      case 'MEDIUM': return 'alert-warning';
      case 'LOW': return 'alert-danger';
      default: return 'alert-info';
    }
  }

  getConsistencyDescription(consistencyScore?: string): string {
    switch(consistencyScore) {
      case 'HIGH': return 'Highly Reliable';
      case 'MEDIUM': return 'Moderately Reliable';
      case 'LOW': return 'Less Reliable - Conflicting Results';
      default: return 'Consistency Checked';
    }
  }

  getConsistencyExplanation(consistencyScore?: string, confidenceVariation?: string): string {
    switch(consistencyScore) {
      case 'HIGH': 
        return 'All analyses showed similar confidence levels. The result is highly reliable.';
      case 'MEDIUM': 
        return 'Some variation in confidence levels detected. Result is moderately reliable.';
      case 'LOW': 
        return `Significant variation in results detected (${confidenceVariation} variation). The AI model shows uncertainty about this image.`;
      default: 
        return 'Multiple analyses performed for increased reliability.';
    }
  }

  shouldShowIndividualResults(consistencyScore?: string): boolean {
    return consistencyScore === 'LOW' || consistencyScore === 'MEDIUM';
  }
}
