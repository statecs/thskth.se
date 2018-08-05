import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces-and-classes/appConfig';
import { CookieService } from 'ngx-cookie';
import { Slide } from '../../interfaces-and-classes/slide';
import {DataFetcherService} from '../utility/data-fetcher.service';
import {WordpressBaseDataService} from '../abstract-services/wordpress-base-data.service';

@Injectable()
export class PrimarySlidesService extends WordpressBaseDataService<Slide> {
  protected config: AppConfig;
  protected language: string;

    constructor(protected dataFetcherService: DataFetcherService,
                private injector: Injector,
                private _cookieService: CookieService) {
        super(dataFetcherService, injector.get(APP_CONFIG).PRIMARY_SLIDES_URL);
    this.config = injector.get(APP_CONFIG);

    if (typeof this._cookieService.get('language') === 'undefined') {
      this.language = 'en';
    }else {
      this.language = this._cookieService.get('language');
    }
  }

  getAllPrimarySlides(lang: string): Observable<Slide[]> {
    return this.getData(null, 'per_page=5&order=desc&lang=' + lang)
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
          id: slide.id,
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
