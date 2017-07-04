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
        .map((res: Array<any>) => {
          const result: Array<Card> = [];
          if (res) {
            res.forEach((c) => {
              const cardData: Card = {
                id: c.id,
                date: c.date,
                slug: c.slug,
                title: c.title.rendered,
                content: c.content.rendered,
                card_number: c.card_number,
                excerpt: c.excerpt.rendered,
                link: c.link,
              };
              result.push(cardData);
            });
          }
          return result;
        });
  }
}
