import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { APP_CONFIG } from "../../app.config";
import { Card, SubCard, CardCategory } from "../../interfaces-and-classes/card";
import { AppConfig } from "../../interfaces-and-classes/appConfig";
import { CookieService } from "ngx-cookie";
import { WordpressBaseDataService } from "../abstract-services/wordpress-base-data.service";
import { DataFetcherService } from "../utility/data-fetcher.service";

@Injectable()
export class CardsService extends WordpressBaseDataService<Card> {
  protected config: AppConfig;
  protected language: string;

  constructor(
    protected dataFetcherService: DataFetcherService,
    private injector: Injector,
    private _cookieService: CookieService
  ) {
    super(dataFetcherService, injector.get(APP_CONFIG).CARDS_URL);
    this.config = injector.get(APP_CONFIG);

    if (typeof this._cookieService.get("language") === "undefined") {
      this.language = "en";
    } else {
      this.language = this._cookieService.get("language");
    }
  }

  getCardCategoryByID(id, type, lang): Observable<CardCategory> {
    let url = "";
    if (type === "organization") {
      url = this.config.CARD_CATEGORY_ORG;
    } else if (type === "profession") {
      url = this.config.CARD_CATEGORY_PRO;
    } else if (type === "interest") {
      url = this.config.CARD_CATEGORY_INT;
    }
    return (
      this.getDataById("lang=" + lang, url + "/" + id)
        // Cast response data to card type
        .map((res: any) => {
          return {
            id: res.id,
            name: res.name,
            order: 1
          };
        })
    );
  }

  getCardCategory(type: string, lang: string): Observable<CardCategory[]> {
    let url = "";
    if (type === "profession") {
      url = this.config.CARD_CATEGORY_PRO;
    } else if (type === "interest") {
      url = this.config.CARD_CATEGORY_INT;
    }
    return (
      this.getDataByURL("order=desc&lang=" + lang, url)
        // Cast response data to card type
        .map((res: Array<any>) => {
          const cats: CardCategory[] = [];
          res.forEach(c => {
            let order = 100;
            if (
              c.meta["wpcf-category-order"] &&
              c.meta["wpcf-category-order"][0]
            ) {
              order = parseInt(c.meta["wpcf-category-order"][0], 10);
            }
            cats.push({
              id: c.id,
              name: c.name,
              order: order
            });
          });
          return cats;
        })
        .map((cats: Array<CardCategory>) => cats.sort(this.sortArrayByOrder))
    );
  }

  // Get cards
  getCards(arg, lang: string): Observable<Card[]> {
    let filter = "";
    /*if (!arg.profession) {
      filter = '&organization_type=' + arg.organization_type + '&user_interest=' + arg.interest;
    }else {
      filter = '&profession=' + arg.profession + '&user_interest=' + arg.interest;
    }*/
    filter = "&profession=" + arg.profession + "&user_interest=" + arg.interest;
    return (
      this.getData(null, "order=asc&per_page=100" + filter + "&lang=" + lang)
        // Cast response data to card type
        .map((res: Array<any>) => Card.convertToCardType(res))
        .map((cards: Array<Card>) => cards.sort(this.sortArrayByCardNumber))
    );
  }

  sortArrayByCardNumber(a, b) {
    a = a.menu_order;
    b = b.menu_order;
    return a > b ? 1 : a < b ? -1 : 0;
  }

  sortArrayByOrder(a, b) {
    a = a.order;
    b = b.order;
    return a > b ? 1 : a < b ? -1 : 0;
  }
}
