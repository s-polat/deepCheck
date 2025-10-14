import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisResult } from '../../services/api.service';

@Component({
  selector: 'app-result-view',
  imports: [CommonModule],
  templateUrl: './result-view.component.html',
  styleUrl: './result-view.component.scss'
})
export class ResultViewComponent {
  @Input() result: AnalysisResult | null = null;

  getConfidenceColor(): string {
    if (!this.result) return 'secondary';
    
    if (this.result.confidence >= 0.8) return 'success';
    if (this.result.confidence >= 0.6) return 'warning';
    return 'danger';
  }

  getConfidenceText(): string {
    if (!this.result) return '';
    
    if (this.result.confidence >= 0.8) return 'Yüksek güven';
    if (this.result.confidence >= 0.6) return 'Orta güven';
    return 'Düşük güven';
  }

  getResultIcon(): string {
    if (!this.result) return '';
    return this.result.is_ai_generated ? '🤖' : '📸';
  }

  getResultText(): string {
    if (!this.result) return '';
    return this.result.is_ai_generated ? 'AI Üretimi' : 'Gerçek İçerik';
  }

  getResultClass(): string {
    if (!this.result) return '';
    return this.result.is_ai_generated ? 'ai-generated' : 'real-content';
  }
}
