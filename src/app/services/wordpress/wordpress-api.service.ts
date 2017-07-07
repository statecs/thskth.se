import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { Card } from '../../interfaces/card';
import { AppConfig } from '../../interfaces/appConfig';
import {MenuItem} from '../../interfaces/menu';

@Injectable()
export class WordpressApiService {
  protected _wpBaseUrl: string;
  protected config: AppConfig;

  constructor(private http: Http, injector: Injector) {
    this.config = injector.get(APP_CONFIG);
    this._wpBaseUrl = this.config.API_URL;
  }

  // Get cards
  getCards(): Observable<Card[]> {
    return this.http
        .get(this.config.CARDS_URL + '?order=desc')
        .map((res: Response) => res.json())
        // Cast response data to card type
        .map((res: Array<any>) => this.castResDataToCardType(res));
  }

  // Cast response data to Card type
  castResDataToCardType(res) {
    const result: Array<Card> = [];
    if (res) {
      res.forEach((c) => {
        const cardOrder = {
          order_id : c.acf.item_id,
          template : c.acf.template
        };

        const cardPrimaryButtons = [];

        if (c.acf.card_primary_buttons) {
          c.acf.card_primary_buttons.forEach(b => {
            cardPrimaryButtons.push({
              text : b.text,
              link : b.link
            });
          });
        }

        const cardData = new Card(
          c.id,
          c.date,
          c.slug,
          c.title.rendered,
          c.content.rendered,
          c.excerpt.rendered,
          c.link,
          c.acf.item_id,
          c.acf.background_color,
          c.acf.background_image,
          c.acf.card_type,
          c.acf.card_number,
          c.acf.flex_layout,
          cardOrder,
          cardPrimaryButtons
        );
        result.push(cardData);
      });
    }
    return result;
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
        .get(menu_url + '?order=desc')
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
