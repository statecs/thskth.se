import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { Card } from '../../interfaces/card';

@Injectable()
export class WordpressApiService {
  protected _wpBaseUrl: string;

  constructor(private http: Http, injector: Injector) {
    const config = injector.get(APP_CONFIG);
    this._wpBaseUrl = config.API_URL;
  }

  // Get cards
  getCards(): Observable<Card[]> {
    return this.http
        .get(this._wpBaseUrl + 'cards?order=desc')
        .map((res: Response) => res.json())
        // Cast response data to card type
        .map((res: Array<any>) => this.castResDataToCardType(res));
  }

  // Cast response data to card type
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

        const cardData: Card = {
          id: c.id,
          date: c.date,
          slug: c.slug,
          title: c.title.rendered,
          content: c.content.rendered,
          excerpt: c.excerpt.rendered,
          link: c.link,
          item_id: c.acf.item_id,
          background_color: c.acf.background_color,
          background_image: c.acf.background_image,
          card_type: c.acf.card_type,
          card_number: c.acf.card_number,
          flex_layout: c.acf.flex_layout,
          card_order: cardOrder,
          card_primary_buttons: cardPrimaryButtons
        };
        result.push(cardData);
      });
    }
    return result;
  }
}
