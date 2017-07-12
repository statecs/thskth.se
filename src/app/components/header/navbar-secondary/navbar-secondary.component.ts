import { Component, OnInit, Injectable, Injector} from '@angular/core';
import { AppConfig } from '../../../interfaces/appConfig';
import { APP_CONFIG } from '../../../app.config';
import { Router} from '@angular/router';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-navbar-secondary',
  templateUrl: './navbar-secondary.component.html',
  styleUrls: ['./navbar-secondary.component.scss']
})
export class NavbarSecondaryComponent implements OnInit {

  protected config: AppConfig;
  public language_text: string;
  public language_img: string;

  constructor(injector: Injector, private router: Router, private _cookieService: CookieService) {
    this.config = injector.get(APP_CONFIG);
  }

  changeLanguage() {
    if (this._cookieService.get('language') !== 'undefined') {
      this.config.LANGUAGE = this._cookieService.get('language');
    }
    if (this.config.LANGUAGE === 'en') {
      this.config.LANGUAGE = 'sv';
    }else if (this.config.LANGUAGE === 'sv') {
      this.config.LANGUAGE = 'en';
    }
    this._cookieService.put('language', this.config.LANGUAGE);
    location.reload();
  }

  displayActualLanguage() {
    if (this._cookieService.get('language') === 'en' || typeof this._cookieService.get('language') === 'undefined') {
      this.language_text = 'THS in swedish';
      this.language_img = '../../../../assets/images/sweden_flag.png';
    }else if (this._cookieService.get('language') === 'sv') {
      this.language_text = 'THS i engelska';
      this.language_img = '../../../../assets/images/British_flag.png';
    }
  }

  ngOnInit() {
    this.displayActualLanguage();
    console.log(this.config.LANGUAGE);
    console.log(this._cookieService.get('language'));
  }

}
