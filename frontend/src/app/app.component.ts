import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UploadAreaComponent } from './components/upload-area/upload-area.component';
import { ResultViewComponent } from './components/result-view/result-view.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UploadAreaComponent, ResultViewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
