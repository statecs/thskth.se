import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces/appConfig';
import {MenuItem, MenuItem2} from '../../interfaces/menu';
import { CookieService } from 'ngx-cookie';
import {of} from 'rxjs/observable/of';

@Injectable()
export class MenusService {
  protected config: AppConfig;
  protected language: string;
  public menus_meta: any;

  constructor(private http: Http, private injector: Injector, private _cookieService: CookieService) {
    this.config = injector.get(APP_CONFIG);

    if (typeof this._cookieService.get('language') === 'undefined') {
      this.language = 'en';
    }else {
      this.language = this._cookieService.get('language');
    }
  }

  get_secondarySubMenu(subMenu_slug: string, secondary_subMenu_slug: string): Observable<MenuItem2[]> {
    if (typeof this.menus_meta === 'undefined') {
      return this.getTopLevel_mainMenu(this.language).map((res) => {
        return this.castResToSecondarySubMenu(subMenu_slug, secondary_subMenu_slug);
      });
    }else {
      return Observable.of(this.castResToSecondarySubMenu(subMenu_slug, secondary_subMenu_slug));
    }
  }

  castResToSecondarySubMenu(subMenu_slug, secondary_subMenu_slug) {
    const secondary_sub_menu: MenuItem2[] = [];
    if (this.menus_meta.items) {
      for (const item of this.menus_meta.items) {
        if (item.object_slug === subMenu_slug) {
          item.children.forEach(i_child => {
            if (i_child.object_slug === secondary_subMenu_slug) {
              i_child.children.forEach(i_grandchild => {
                secondary_sub_menu.push({
                  object_slug : i_grandchild.object_slug,
                  title : i_grandchild.title,
                  slug : i_grandchild.url
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

  get_mainSubMenu(object_slug: string): Observable<MenuItem2[]> {
    if (typeof this.menus_meta === 'undefined') {
      return this.getTopLevel_mainMenu(this.language).map((res) => {
        return this.castResToMainSubMenu(object_slug);
      });
    }else {
      return Observable.of(this.castResToMainSubMenu(object_slug));
    }
  }

  castResToMainSubMenu(object_slug) {
    const sub_menu: MenuItem2[] = [];
    if (this.menus_meta.items) {
      for (const item of this.menus_meta.items) {
        if (item.object_slug === object_slug) {
          item.children.forEach(i_child => {
            sub_menu.push({
              object_slug : i_child.object_slug,
              title : i_child.title,
              slug : i_child.url
            });
          });
          return sub_menu;
        }
      }
    }
    return sub_menu;
  }

  getTopLevel_mainMenu(lang: string): Observable<MenuItem2[]>  {
    return this.http
        .get(this.config.PRIMARY_MENU_URL + '?order=desc&lang=' + lang)
        .map((res: Response) => res.json())
        // Cast response data to card type
        .map((res: Array<any>) => this.castToplevelToMenuType(res));
  }

  castToplevelToMenuType(res) {
    this.menus_meta = res;
    const topLevel_menu: Array<MenuItem2> = [];
    if (res.items) {
      for (const item of res.items) {
        topLevel_menu.push({
          object_slug : item.object_slug,
          title : item.title,
          slug : item.url
        });
      }
    }
    return topLevel_menu;
  }

  // Get Menu
  getMenu(param): Observable<MenuItem[]>  {
    let menu_url: string;
    if (param === 'primary') {
      menu_url = this.config.PRIMARY_MENU_URL;
    }else if (param === 'secondary') {
      menu_url = this.config.SECONDARY_MENU_URL;
    }else if (param === 'sections') {
      menu_url = this.config.SECTIONS_MENU_URL;
    }else if (param === 'footer') {
      menu_url = this.config.FOOTER_MENU_URL;
    }
    return this.http
        .get(menu_url + '?order=desc&lang=' + this.language)
        .map((res: Response) => res.json())
        // Cast response data to card type
        .map((res: Array<any>) => this.castResDataToMenuType(res));
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
