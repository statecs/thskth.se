import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces-and-classes/appConfig';
import { CookieService } from 'ngx-cookie';
import { Slide } from '../../interfaces-and-classes/slide';

@Injectable()
export class PrimarySlidesService {
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

  getAllPrimarySlides(lang: string): Observable<Slide[]> {
    return this.http
        .get(this.config.PRIMARY_SLIDES_URL + '?per_page=5&order=desc&lang=' + lang)
        .map((res: Response) => res.json())
        // Cast response data to FAQ Category type
        .map((res: any) => { return this.castResTo_SlideType(res); })
        .map((cards: Array<Slide>) => cards.sort(this.sortArrayBySlideOrder));
  }

  castResTo_SlideType(res) {
    const slides: Slide[] = [];
    res.forEach((slide) => {
      let bg_image = '';
      if (slide.acf.background_image) {
        bg_image = slide.acf.background_image.sizes;
      }
      slides.push({
        title: slide.title.rendered,
        description: slide.content.rendered,
        template: slide.acf.template,
        link_to_page: slide.acf.link_to_page,
        image: slide.acf.image.sizes,
        video: slide.acf.video,
        slide_order: slide.acf.slide_order,
        bg_image: bg_image
      });
    });
    return slides;
  }

  sortArrayBySlideOrder(a, b) {
    a = a.slide_order;
    b = b.slide_order;
    return a > b ? 1 : a < b ? -1 : 0;
  };

}
