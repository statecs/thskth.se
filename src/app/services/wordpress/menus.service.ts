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

  get_mainSubMenu(id: number): Observable<MenuItem2[]> {
    const sub_menu: MenuItem2[] = [];
    if (this.menus_meta.items) {
      console.log(this.menus_meta);
      for (const item of this.menus_meta.items) {
        if (item.id === id) {
          item.children.forEach(i_child => {
              sub_menu.push({
                id : i_child.id,
                title : i_child.title,
                slug : i_child.url
              });
          });
          return Observable.of(sub_menu);
        }
      }
    }
    return Observable.of(sub_menu);
  }

  getTopLevel_mainMenu(): Observable<MenuItem2[]>  {
    return this.http
        .get(this.config.PRIMARY_MENU_URL + '?order=desc&lang=' + this.language)
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
          id : item.id,
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
