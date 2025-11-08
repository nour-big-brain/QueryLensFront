import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemesService } from '../../services/themes.service';
import { LanguageService } from '../../services/language.service'; 
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  public themeService = inject(ThemesService);
  private languageService = inject(LanguageService); 

  public isDark: boolean = false;
  public menuOpen: boolean = false;

  //theme
  toggleTheme() {
    this.isDark = !this.isDark;
    this.themeService.toggleTheme(this.isDark);
  }

//menu
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  onLanguageChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const lang = select.value;
    this.languageService.switchLanguage(lang);

    //handle right-to-left for Arabic
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  //send current language to template
  get currentLang(): string {
    return this.languageService.currentLang;
  }
}
