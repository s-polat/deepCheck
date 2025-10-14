import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResultViewComponent } from '../result-view/result-view.component';

@Component({
  selector: 'app-upload-area',
  imports: [CommonModule, FormsModule, ResultViewComponent],
  templateUrl: './upload-area.component.html',
  styleUrl: './upload-area.component.scss'
})
export class UploadAreaComponent {
  selectedFile: File | null = null;
  fileName: string = '';
  mediaUrl: string = '';
  loading: boolean = false;
  result: any = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.fileName = this.selectedFile ? this.selectedFile.name : '';
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.fileName = this.selectedFile.name;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  analyzeFile() {
    if (this.selectedFile || this.mediaUrl) {
      this.loading = true;
      // Simüle et - gerçekte backend'e istek göndereceğiz
      setTimeout(() => {
        this.result = {
          is_ai_generated: Math.random() > 0.5,
          confidence: Math.random()
        };
        this.loading = false;
      }, 2000);
    }
  }

  analyzeLink() {
    if (this.mediaUrl) {
      this.analyzeFile();
    }
  }
}
