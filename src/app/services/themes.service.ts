import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DARK_THEME, LIGHT_THEME } from '../charts/chart-themes';

@Injectable({
  providedIn: 'root'
})
export class ThemesService {
  private theme = new BehaviorSubject(LIGHT_THEME);//a specific type of observable that holds a value and emits it to every subscribed component when it changes
  currentTheme$ = this.theme.asObservable();//make it readonly for other componants so that only tis service can modify it
  
  toggleTheme(isDark: boolean) {
    this.theme.next(isDark ? DARK_THEME : LIGHT_THEME);//next updates the value of the observable and emits it to all subscribed components
    //necessary for the variable of style.css

    document.body.classList.add('theme-transitioning');
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

  }
  constructor() { }
}
