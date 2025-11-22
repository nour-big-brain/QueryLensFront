import { Component, inject, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private readonly router:Router=inject(Router)
ngOnInit() {
  const videoPath = 'assets/bg.mp4';
  fetch(videoPath)
    .then(res => console.log('Video loaded', res.status))
    .catch(err => console.error('Video failed', err));
}
getStarted(){
  this.router.navigate(['/listDashboard']);
}
}
