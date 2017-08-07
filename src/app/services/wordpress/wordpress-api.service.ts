import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { Card } from '../../interfaces/card';
import { AppConfig } from '../../interfaces/appConfig';
import {MenuItem} from '../../interfaces/menu';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class WordpressApiService {
  protected _wpBaseUrl: string;
  protected config: AppConfig;
  protected language: string;

  constructor(private http: Http, private injector: Injector, private _cookieService: CookieService) {
    this.config = injector.get(APP_CONFIG);
    this._wpBaseUrl = this.config.API_URL;

    if (typeof this._cookieService.get('language') === 'undefined') {
      this.language = 'en';
    }else {
      this.language = this._cookieService.get('language');
    }
  }

  // Get Page
  getPage(slug): Observable<any[]> {
    return this.http
        .get(this.config.PAGES_URL + '?slug=' + slug + '&lang=' + this.language)
        .map((res: Response) => res.json())
        // Cast response data to card type
        .map((res: Array<any>) => { return res; });
  }

  // Get cards
  getCards(arg): Observable<Card[]> {
    let filter: string = '';
    if (!arg.profession) {
      filter = '&organization_type=' + arg.organization_type + '&user_interest=' + arg.interest;
    }else {
      filter = '&profession=' + arg.profession + '&user_interest=' + arg.interest;
    }
    //console.log(this.config.CARDS_URL + '?order=asc&lang=' + this.language + filter);
    return this.http
        .get(this.config.CARDS_URL + '?order=asc&lang=' + this.language + filter)
        .map((res: Response) => res.json())
        // Cast response data to card type
        .map((res: Array<any>) => this.castResDataToCardType(res));
  }

  // Cast response data to Card type
  castResDataToCardType(res) {
    //console.log(res);
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
          c.acf.slug_to_page,
          c.acf.window_type,
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

}
