import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
 
//using a library for translation called ngx-translate has predefined service: TranslateService
export class LanguageService {

  constructor(private translate: TranslateService) {
    const savedLanguage = localStorage.getItem('lang'); //gets the language var from localstorage
    const browserLang = translate.getBrowserLang();
    translate.setDefaultLang('en');//sets language to default english 
    translate.use(savedLanguage || (browserLang?.match(/en|fr|ar/) ? browserLang : 'en'));
  }

  switchLanguage(lang: string) {//gets the language value and sets the language var in localstorage
    this.translate.use(lang);
    localStorage.setItem('lang', lang); 
  }

  get currentLang() {//gets the currentlanguage
    return this.translate.currentLang;
  }
}
