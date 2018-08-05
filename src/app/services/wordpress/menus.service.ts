import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces-and-classes/appConfig';
import {MenuItem, MenuItem2} from '../../interfaces-and-classes/menu';
import { CookieService } from 'ngx-cookie';
import {DataFetcherService} from '../utility/data-fetcher.service';
import {WordpressBaseDataService} from '../abstract-services/wordpress-base-data.service';

@Injectable()
export class MenusService extends WordpressBaseDataService<MenuItem2> {
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

  get_secondarySubMenu(subMenu_slug: string, secondary_subMenu_slug: string, lang: string): Observable<MenuItem2[]> {
    //if (typeof this.menus_meta === 'undefined') {
      return this.getTopLevel_mainMenu(lang).map((res) => {
        return this.castResToSecondarySubMenu(subMenu_slug, secondary_subMenu_slug);
      });
    //}else {
    //  return Observable.of(this.castResToSecondarySubMenu(subMenu_slug, secondary_subMenu_slug));
    //}
  }

  castResToSecondarySubMenu(subMenu_slug, secondary_subMenu_slug) {
    const secondary_sub_menu: MenuItem2[] = [];
    if (this.menus_meta.items) {
      for (const item of this.menus_meta.items) {
        if (item.object_slug === subMenu_slug) {
          item.children.forEach(i_child => {
            if (i_child.object_slug === secondary_subMenu_slug && i_child.children) {
              i_child.children.forEach(i_grandchild => {
                secondary_sub_menu.push({
                    id: i_grandchild.id,
                  object_slug : i_grandchild.object_slug,
                  title : i_grandchild.title,
                  url : i_grandchild.url,
                  type_label : i_grandchild.object,
                  children: i_grandchild.children
                });
              });
            }
          });
          return secondary_sub_menu;
        }
      }
    }
    return secondary_sub_menu;
  }

  get_mainSubMenu(object_slug: string, lang: string): Observable<MenuItem2[]> {
    this.language = lang;
    /*if (typeof this.menus_meta === 'undefined') {*/
      return this.getTopLevel_mainMenu(this.language).map((res) => {
        return this.castResToMainSubMenu(object_slug);
      });
    /*}else {
      return Observable.of(this.castResToMainSubMenu(object_slug));
    }*/
  }

  castResToMainSubMenu(object_slug) {
    const sub_menu: MenuItem2[] = [];
    if (this.menus_meta.items) {
      for (const item of this.menus_meta.items) {
        if (item.object_slug === object_slug) {
          item.children.forEach(i_child => {
            sub_menu.push({
                id: i_child.id,
              object_slug : i_child.object_slug,
              title : i_child.title,
              url : i_child.url,
              type_label : i_child.object,
              children: i_child.children
            });
          });
          return sub_menu;
        }
      }
    }
    return sub_menu;
  }

  getTopLevel_mainMenu(lang: string): Observable<MenuItem2[]>  {
    if (lang === 'sv') {
      this.menus_meta = localStorage.getItem('menus_meta_sv');
    }else {
      this.menus_meta = localStorage.getItem('menus_meta_en');
    }
    if (this.menus_meta) {
      return Observable.of(this.castToplevelToMenuType(JSON.parse(this.menus_meta)));
    }else {
      return this.getData(null,'order=desc&lang=' + lang)
          // Cast response data to card type
          .map((res: Array<any>) => {
              return this.handleResponse(res, lang);
          });
    }
  }

  handleResponse(res: any, lang) {
    if (lang === 'sv') {
      localStorage.setItem('menus_meta_sv', JSON.stringify(res));
    }else {
      localStorage.setItem('menus_meta_en', JSON.stringify(res));
    }
    return this.castToplevelToMenuType(res);
  }

  castToplevelToMenuType(res) {
    this.menus_meta = res;
    const topLevel_menu: Array<MenuItem2> = [];
    if (res.items) {
      for (const item of res.items) {
        topLevel_menu.push({
            id: item.id,
          object_slug : item.object_slug,
          title : item.title,
          url : item.url,
          type_label : item.object,
          children: item.children
        });
      }
    }
    return topLevel_menu;
  }

  // Get Menu
  getMenu(param, lang: string): Observable<MenuItem[]>  {
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
        return Observable.of(this.castResDataToMenuType(JSON.parse(this.sections_menu)));
      }
    }else if (param === 'footer') {
      menu_url = this.config.FOOTER_MENU_URL;
      if (lang === 'sv') {
        this.footer_menu = localStorage.getItem('footer_menu_sv');
      }else {
        this.footer_menu = localStorage.getItem('footer_menu_en');
      }
      if (this.footer_menu) {
        return Observable.of(this.castResDataToMenuType(JSON.parse(this.footer_menu)));
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
          return this.castResDataToMenuType(res);
        });
  }

  // Cast response data to MenuItem type
  castResDataToMenuType(res) {
    const menu: Array<MenuItem> = [];
    if (res.items) {
      for (const item of res.items) {
        const menu_item_children = [];
        if (item.children) {
          item.children.forEach(i_child => {
            const menu_item_grandchildren = [];
            if (i_child.children) {
              i_child.children.forEach(i_grandchild => {
                menu_item_grandchildren.push({
                  title : i_grandchild.title,
                  url : i_grandchild.url
                });
              });
            }
            menu_item_children.push({
              title : i_child.title,
              url : i_child.url,
              children : menu_item_grandchildren
            });
          });
        }

        const menuItem = new MenuItem(
            item.title,
            item.url,
            menu_item_children
        );
        menu.push(menuItem);
      }
    }
    return menu;
  }

}
