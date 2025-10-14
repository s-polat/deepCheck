import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AnalysisResult {
  is_ai_generated: boolean;
  confidence: number;
  analysis_time: number;
  model_version: string;
  details?: {
    artifacts?: string[];
    probability_scores?: { [key: string]: number };
  };
}

export interface ApiResponse {
  success: boolean;
  result?: AnalysisResult;
  error?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api'; // Backend URL'i

  constructor(private http: HttpClient) { }

  // Dosya analizi
  analyzeFile(file: File): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ApiResponse>(`${this.apiUrl}/analyze/file`, formData);
  }

  // URL analizi
  analyzeUrl(url: string): Observable<ApiResponse> {
    const body = { url: url };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ApiResponse>(`${this.apiUrl}/analyze/url`, body, { headers });
  }

  // Sistem durumu kontrolü
  getHealthStatus(): Observable<{ status: string; message: string }> {
    return this.http.get<{ status: string; message: string }>(`${this.apiUrl}/health`);
  }

  // Desteklenen dosya türlerini getir
  getSupportedFormats(): Observable<{ 
    images: string[]; 
    videos: string[];
    max_file_size: { images: number; videos: number };
  }> {
    return this.http.get<{ 
      images: string[]; 
      videos: string[];
      max_file_size: { images: number; videos: number };
    }>(`${this.apiUrl}/formats`);
  }
}
