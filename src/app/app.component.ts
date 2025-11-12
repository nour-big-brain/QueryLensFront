import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './comp/dashboard/dashboard.component';
import { NavbarComponent } from './comp/navbar/navbar.component';
import { ThemesService } from './services/themes.service';

// ✅ Import TranslateService and module
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent, NavbarComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'querylens_frontend_angular';
  private themeService = inject(ThemesService);
  private renderer = inject(Renderer2);

  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.translate.addLangs(['en', 'fr', 'ar']);
    this.translate.setDefaultLang('en');

    const savedLang = localStorage.getItem('lang');
    const browserLang = this.translate.getBrowserLang();

    this.translate.use(savedLang || (browserLang?.match(/en|fr|ar/) ? browserLang : 'en'));

    this.themeService.currentTheme$.subscribe(theme => {
      this.renderer.setAttribute(document.documentElement, 'data-theme', theme.name);
    });
  }

  switchLanguage(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('lang', lang); // persist choice
  }
}
