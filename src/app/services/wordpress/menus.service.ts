import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces-and-classes/appConfig';
import {MainMenuItem, MenuItem} from '../../interfaces-and-classes/menu';
import { CookieService } from 'ngx-cookie';
import {DataFetcherService} from '../utility/data-fetcher.service';
import {WordpressBaseDataService} from '../abstract-services/wordpress-base-data.service';

@Injectable()
export class MenusService extends WordpressBaseDataService<MenuItem> {
  protected config: AppConfig;
  protected language: string;
  public menus_meta: any;
  public sections_menu: any;
  public footer_menu: any;

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
        return MenuItem.convertToSecondarySubMenu(this.menus_meta.items, subMenu_slug, secondary_subMenu_slug);
      });
  }

  get_mainSubMenu(object_slug: string, lang: string): Observable<MenuItem[]> {
    this.language = lang;
      return this.getTopLevel_mainMenu(this.language).map((res) => {
        return MenuItem.convertToMainSubMenu(this.menus_meta.items, object_slug);
      });
  }

  getTopLevel_mainMenu(lang: string): Observable<MenuItem[]>  {
    if (lang === 'sv') {
      this.menus_meta = localStorage.getItem('menus_meta_sv');
    }else {
      this.menus_meta = localStorage.getItem('menus_meta_en');
    }
    if (this.menus_meta) {
      return Observable.of(MenuItem.convertToplevelToMenuItem2Type(JSON.parse(this.menus_meta)));
    }else {
      return this.getData(null, 'order=desc&lang=' + lang)
          // Cast response data to card type
          .map((res: Array<any>) => {
              return this.handleResponse(res, lang);
          });
    }
  }

  handleResponse(res: any, lang): MenuItem[] {
    if (lang === 'sv') {
      localStorage.setItem('menus_meta_sv', JSON.stringify(res));
    }else {
      localStorage.setItem('menus_meta_en', JSON.stringify(res));
    }
    return MenuItem.convertToplevelToMenuItem2Type(res);
  }

  // Get Menu
  getMenu(param, lang: string): Observable<MainMenuItem[]>  {
    this.language = lang;
    let menu_url: string;
    if (param === 'sections') {
      menu_url = this.config.SECTIONS_MENU_URL;
      if (lang === 'sv') {
        this.sections_menu = localStorage.getItem('sections_menu_sv');
      }else {
        this.sections_menu = localStorage.getItem('sections_menu_en');
      }
      if (this.sections_menu) {
        return Observable.of(MainMenuItem.convertToMenuItemType(JSON.parse(this.sections_menu)));
      }
    }else if (param === 'footer') {
      menu_url = this.config.FOOTER_MENU_URL;
      if (lang === 'sv') {
        this.footer_menu = localStorage.getItem('footer_menu_sv');
      }else {
        this.footer_menu = localStorage.getItem('footer_menu_en');
      }
      if (this.footer_menu) {
        return Observable.of(MainMenuItem.convertToMenuItemType(JSON.parse(this.footer_menu)));
      }
    }
    return this.dataFetcherService
        .get(menu_url + '?order=desc&lang=' + this.language)
        // Cast response data to card type
        .map((res: Array<any>) => {
          if (param === 'sections') {
            if (lang === 'sv') {
              localStorage.setItem('sections_menu_sv', JSON.stringify(res));
            }else {
              localStorage.setItem('sections_menu_en', JSON.stringify(res));
            }
          }else if (param === 'footer') {
            if (lang === 'sv') {
              localStorage.setItem('footer_menu_sv', JSON.stringify(res));
            }else {
              localStorage.setItem('footer_menu_en', JSON.stringify(res));
            }
          }
          return MainMenuItem.convertToMenuItemType(res);
        });
  }



}
