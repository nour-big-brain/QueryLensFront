import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
ngOnInit() {
  const videoPath = 'assets/bg.mp4';
  fetch(videoPath)
    .then(res => console.log('Video loaded', res.status))
    .catch(err => console.error('Video failed', err));
}
}
