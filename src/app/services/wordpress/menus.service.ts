import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces-and-classes/appConfig';
import {MenuItem} from '../../interfaces-and-classes/menu';
import { CookieService } from 'ngx-cookie';
import {DataFetcherService} from '../utility/data-fetcher.service';
import {WordpressBaseDataService} from '../abstract-services/wordpress-base-data.service';

@Injectable()
export class MenusService extends WordpressBaseDataService<MenuItem> {
  protected config: AppConfig;
  protected language: string;
  public menus_meta: any;

    constructor(protected dataFetcherService: DataFetcherService,
                private injector: Injector,
                private _cookieService: CookieService) {
        super(dataFetcherService, injector.get(APP_CONFIG).PRIMARY_MENU_URL);
    this.config = injector.get(APP_CONFIG);

    if (typeof this._cookieService.get('language') === 'undefined') {
      this.language = 'en';
    }else {
      this.language = this._cookieService.get('language');
    }

  }

  get_secondarySubMenu(subMenu_slug: string, secondary_subMenu_slug: string, lang: string): Observable<MenuItem[]> {
      return this.getTopLevel_mainMenu(lang).map((res) => {
        return MenuItem.convertToSecondarySubMenu(res, subMenu_slug, secondary_subMenu_slug);
      });
  }

  get_mainSubMenu(object_slug: string, lang: string): Observable<MenuItem[]> {
    this.language = lang;
      return this.getTopLevel_mainMenu(this.language).map((res) => {
        return MenuItem.convertToMainSubMenu(res, object_slug);
      });
  }

  getTopLevel_mainMenu(lang: string): Observable<MenuItem[]>  {
    if (lang === 'sv') {
      this.menus_meta = localStorage.getItem('menus_meta_sv');
    }else {
      this.menus_meta = localStorage.getItem('menus_meta_en');
    }
    if (this.menus_meta) {
      return Observable.of(JSON.parse(this.menus_meta));
    }else {
      return this.getData(null, 'order=desc&lang=' + lang)
          // Cast response data to card type
          .map((res: any) => {
              return this.handleResponse(res.items, lang);
          });
    }
  }

  handleResponse(res: any, lang): MenuItem[] {
      res = MenuItem.convertToplevelToMenuItem2Type(res);
      if (lang === 'sv') {
        localStorage.setItem('menus_meta_sv', JSON.stringify(res));
      }else {
        localStorage.setItem('menus_meta_en', JSON.stringify(res));
      }
      return res;
  }
}
