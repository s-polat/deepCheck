import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UploadAreaComponent } from './components/upload-area/upload-area.component';
import { ResultViewComponent } from './components/result-view/result-view.component';
import { SimpleLanguageService, Language } from './services/simple-language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UploadAreaComponent, ResultViewComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
  
  constructor(public langService: SimpleLanguageService) {}

  changeLanguage(languageCode: string): void {
    this.langService.changeLanguage(languageCode);
  }
}
