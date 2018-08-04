import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { Card, SubCard, CardCategory } from '../../interfaces-and-classes/card';
import { AppConfig } from '../../interfaces-and-classes/appConfig';
import { CookieService } from 'ngx-cookie';
import {WordpressBaseDataService} from '../abstract-services/wordpress-base-data.service';
import {Archive} from '../../interfaces-and-classes/archive';
import {DataFetcherService} from '../utility/data-fetcher.service';

@Injectable()
export class CardsService extends WordpressBaseDataService<Archive> {
  protected config: AppConfig;
  protected language: string;

  constructor(protected dataFetcherService: DataFetcherService,
              private injector: Injector,
              private _cookieService: CookieService) {
    super(dataFetcherService);
    this.config = injector.get(APP_CONFIG);

    if (typeof this._cookieService.get('language') === 'undefined') {
      this.language = 'en';
    }else {
      this.language = this._cookieService.get('language');
    }
  }

  getCardCategoryByID(id, type, lang): Observable<CardCategory> {
    let url = '';
    if (type === 'organization') {
      url = this.config.CARD_CATEGORY_ORG;
    }else if (type === 'profession') {
      url = this.config.CARD_CATEGORY_PRO;
    }else if (type === 'interest') {
      url = this.config.CARD_CATEGORY_INT;
    }
    return this.getDataById( 'lang=' + lang, url + '/' + id)
        // Cast response data to card type
        .map((res: any) => {
          return {
            id: res.id,
            name: res.name,
            order: 1
          };
        });
  }

  getCardCategory(type: string, lang: string): Observable<CardCategory[]> {
    let url = '';
    if (type === 'profession') {
      url = this.config.CARD_CATEGORY_PRO;
    }else if (type === 'interest') {
      url = this.config.CARD_CATEGORY_INT;
    }
    return this.getDataByURL('?order=desc&lang=' + lang, url)
        // Cast response data to card type
        .map((res: Array<any>) => {
          const cats: CardCategory[] = [];
          res.forEach(c => {
            cats.push({
              id: c.id,
              name: c.name,
              order: 1
            });
          });
          return cats; })
        .map((cats: Array<CardCategory>) => cats.sort(this.sortArrayByOrder));
  }

  // Get cards
  getCards(arg, lang: string): Observable<Card[]> {
    let filter = '';
    /*if (!arg.profession) {
      filter = '&organization_type=' + arg.organization_type + '&user_interest=' + arg.interest;
    }else {
      filter = '&profession=' + arg.profession + '&user_interest=' + arg.interest;
    }*/
    filter = '&profession=' + arg.profession + '&user_interest=' + arg.interest;
    return this.getData(this.config.CARDS_URL, 'order=asc&per_page=100' + filter + '&lang=' + lang)
        // Cast response data to card type
        .map((res: Array<any>) => this.castResDataToCardType(res))
        .map((cards: Array<Card>) => cards.sort(this.sortArrayByCardNumber));
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
        let oneSixthSubCards: SubCard[] = [];
        let oneThirdHalfSubCards: SubCard[] = [];

        if (c.acf.card_primary_buttons) {
          c.acf.card_primary_buttons.forEach(b => {
            cardPrimaryButtons.push({
              text : b.text,
              link : b.link
            });
          });
        }

        if (c.acf.one_sixth_sub_cards) {
          oneSixthSubCards = this.castDataToSubCardType(c.acf.one_sixth_sub_cards);
        }
        if (c.acf.one_third_half_sub_card) {
          oneThirdHalfSubCards = this.castDataToSubCardType(c.acf.one_third_half_sub_card);
        }
        let bg_img = '';
        if (c.acf.background_image) {
            bg_img = c.acf.background_image.sizes;
        }
        const cardData = new Card(
            c.id,
            c.date,
            c.slug,
            c.acf.slug_to_page,
            c.acf.window_type,
            c.title.rendered,
            c.content.rendered,
            c.link,
            c.acf.item_id,
            c.acf.background_color,
            bg_img,
            c.acf.card_type,
            c.acf.card_number,
            c.acf.flex_layout,
            cardOrder,
            cardPrimaryButtons,
            oneSixthSubCards,
            oneThirdHalfSubCards
        );
        result.push(cardData);
      });
    }
    return result;
  }

  castDataToSubCardType(data) {
    const subCards: SubCard[] = [];
    data.forEach(c => {
      let bg_image = '';
      if (c.background_image !== false ) {
        bg_image = c.background_image.sizes;
      }
      subCards.push({
        title: c.title,
        background_color: c.background_color,
        background_image: bg_image,
        slug: this.getSubCardSlug(c.slug_to_page),
        slug_to_page: c.slug_to_page,
        window_type: c.window_type,
        card_type: c.card_type,
        content: c.content
      });
    });
    return subCards;
  }

  getSubCardSlug(data): string {
    const array: [string] = data.split('/');
    return array[array.length - 1];
  }

  sortArrayByCardNumber(a, b) {
    a = a.card_number;
    b = b.card_number;
    return a > b ? 1 : a < b ? -1 : 0;
  };

  sortArrayByOrder(a, b) {
    a = a.order;
    b = b.order;
    return a > b ? 1 : a < b ? -1 : 0;
  };
}
