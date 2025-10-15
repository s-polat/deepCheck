import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AnalysisResult } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private resultSubject = new BehaviorSubject<AnalysisResult | null>(null);
  public result$ = this.resultSubject.asObservable();

  setResult(result: AnalysisResult | null): void {
    this.resultSubject.next(result);
  }

  clearResult(): void {
    this.resultSubject.next(null);
  }
}
