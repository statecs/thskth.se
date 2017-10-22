import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces/appConfig';
import { Restaurant, Dish, Menu } from '../../interfaces/restaurant';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class RestaurantService {
  protected config: AppConfig;
  protected language: string;

  constructor(private http: Http, private injector: Injector, private _cookieService: CookieService) {
    this.config = injector.get(APP_CONFIG);

    if (typeof this._cookieService.get('language') === 'undefined') {
      this.language = 'en';
    }else {
      this.language = this._cookieService.get('language');
    }
  }

  getRestaurants(lang: string): Observable<Restaurant[]> {
    this.language = lang;
    return this.http
        .get(this.config.RESTAURANT_URL + '?_embed&lang=' + this.language)
        .map((res: Response) => res.json())
        // Cast response data to FAQ Category type
        .map((res: any) => { return this.castPostsTo_SearchResultType(res); });
  }

  castPostsTo_SearchResultType(res) {
    const results: Restaurant[] = [];
    if (res) {
      res.forEach((p) => {
        let image = '';
        if (p._embedded['wp:featuredmedia']) {
          image = p._embedded['wp:featuredmedia'][0].source_url;
        }
        results.push({
          title: p.title.rendered,
          description: p.content.rendered,
          imageUrl: image,
          menu: this.castResTo_MenuType(p.acf.menu),
        });
      });
    }
    return results;
  }

  castResTo_MenuType(data) {
    const menus: Menu[] = [];
    if (data) {
      data.forEach((m) => {
        menus.push({
          weekday: m.weekday,
          lunch: {
            serving_time: m.lunch[0].serving_time,
            dishes: this.castResTo_DishType(m.lunch[0].dish)
          },
          a_la_carte: {
            serving_time: m.a_la_carte[0].serving_time,
            dishes: this.castResTo_DishType(m.a_la_carte[0].dish)
          },
        });
      });
    }
    return menus;
  }

  castResTo_DishType(data) {
    const dishes: Dish[] = [];
    if (data) {
      data.forEach((d) => {
        let image = '';
        if (d.image) {
          image = d.image.url;
        }
        dishes.push({
          title: d.title,
          description: d.description,
          price: d.price,
          image: image
        });
      });
    }
    return dishes;
  }

}
