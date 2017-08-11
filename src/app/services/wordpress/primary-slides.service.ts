import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces/appConfig';
import { CookieService } from 'ngx-cookie';
import { Slide } from '../../interfaces/slide';

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

  getAllPrimarySlides(): Observable<Slide[]> {
    return this.http
        .get(this.config.PRIMARY_SLIDES_URL + '?order=asc')
        .map((res: Response) => res.json())
        // Cast response data to FAQ Category type
        .map((res: any) => { return this.castResTo_SlideType(res); });
  }

  castResTo_SlideType(res) {
    const slides: Slide[] = [];
    res.forEach((slide) => {
      slides.push({
        title: slide.title.rendered,
        description: slide.content.rendered,
        template: slide.acf.template,
        link_to_page: slide.acf.link_to_page,
        image: slide.acf.image.url,
        video: slide.acf.video,
        slide_number: slide.acf.slide_number,
      });
    });
    return slides;
  }

}
