import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, timeout, catchError, of, retry, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AnalysisResult {
  is_ai_generated: boolean;
  confidence: number;
  analysis_time: number;
  model_version: string;
  details?: {
    artifacts?: string[];
    probability_scores?: { [key: string]: number };
    reasoning?: string;
    analysis_timestamp?: string;
  };
}

export interface ApiResponse {
  success: boolean;
  result?: AnalysisResult;
  error?: string;
  message?: string;
}

export interface SupportedFormats {
  images: string[];
  videos: string[];
  max_file_size: { images: number; videos: number };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;
  private readonly healthUrl = environment.healthUrl;
  private readonly defaultTimeout = 30000; // 30 saniye

  constructor(private http: HttpClient) {}

  // Dosya analizi
  analyzeFile(file: File): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ApiResponse>(`${this.apiUrl}/analyze/file`, formData).pipe(
      timeout(this.defaultTimeout),
      retry(1),
      catchError(this.handleError)
    );
  }

  // URL analizi
  analyzeUrl(url: string): Observable<ApiResponse> {
    const body = { url };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<ApiResponse>(`${this.apiUrl}/analyze/url`, body, { headers }).pipe(
      timeout(this.defaultTimeout),
      retry(1),
      catchError(this.handleError)
    );
  }

  // Sistem durumu kontrolü
  getHealthStatus(): Observable<{ status: string; message: string }> {
    return this.http.get<{ status: string; message: string }>(this.healthUrl, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    }).pipe(
      timeout(5000),
      catchError(() => of({ status: 'error', message: 'Backend connection failed' }))
    );
  }

  // Desteklenen dosya türlerini getir
  getSupportedFormats(): Observable<SupportedFormats> {
    return this.http.get<SupportedFormats>(`${this.apiUrl}/formats`).pipe(
      timeout(10000),
      retry(1),
      catchError(this.handleError)
    );
  }

  // Merkezi hata yönetimi
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Bilinmeyen bir hata oluştu.';

    if (error.status === 0) {
      errorMessage = 'Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.';
    } else if (error.status === 413) {
      errorMessage = 'Dosya boyutu çok büyük.';
    } else if (error.status === 415) {
      errorMessage = 'Desteklenmeyen dosya türü.';
    } else if (error.status >= 500) {
      errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}