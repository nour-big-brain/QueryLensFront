import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemesService } from '../../services/themes.service';
import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  public themeService = inject(ThemesService);
  private languageService = inject(LanguageService);
  private authService = inject(AuthService);
  private router:Router=inject(Router);

  public isDark: boolean = false;
  public menuOpen: boolean = false;
  public isLoggedIn: boolean = false;
  public currentUsername: string = '';

  ngOnInit() {
    // Check if user is logged in
    this.isLoggedIn = this.authService.isLoggedIn();
    
    // Get current user info
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentUsername = currentUser.username;
    }

    // Subscribe to user changes
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUsername = user?.username || '';
    });
  }

  // Theme toggle
  toggleTheme() {
    this.isDark = !this.isDark;
    this.themeService.toggleTheme(this.isDark);
  }

  // Menu toggle
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // Language change
  onLanguageChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const lang = select.value;
    this.languageService.switchLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  // Logout
  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
      this.menuOpen = false; // Close menu after logout
    }
  }

  // Get current language
  get currentLang(): string {
    return this.languageService.currentLang;
  }
  navigateToProfile(){
    this.router.navigate(['/profile']);
  }
}