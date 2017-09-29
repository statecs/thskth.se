import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces/appConfig';
import { CookieService } from 'ngx-cookie';
import { Page, ImageGallery, TextGallery, ImageGalleryItem, TextGalleryItem } from '../../interfaces/page';

@Injectable()
export class PagesService {
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

  getPageBySlug(slug): Observable<Page> {
    console.log(slug);
    return this.http
        .get(this.config.PAGES_URL + '?slug=' + slug)
        .map((res: Response) => res.json())
        // Cast response data to FAQ Category type
        .map((res: any) => { return this.castResTo_PageType(res[0]); });
  }

  castResTo_PageType(res) {
    console.log(res);
    let page: Page;
    let header_image = '';
    let text_gallery: TextGallery;
    let image_gallery: ImageGallery;
    if (res) {
      if (res.acf.header_image) {
        header_image = res.acf.header_image.url;
      }
      if (res.acf.ths_text_gallery) {
        text_gallery = this.castResToTextGalleryType(res);
      }
      if (res.acf.ths_image_gallery) {
        image_gallery = this.castResToImageGalleryType(res);
      }

      page = {
        name: res.title.rendered,
        slug: res.slug,
        content: res.content.rendered,
        header: {
          header_image: header_image,
          header_color: res.acf.header_color
        },
        template: res.acf.template,
        image_gallery: image_gallery,
        text_gallery: text_gallery,
      };
    }
    console.log(page);
    return page;
  }

  castResToImageGalleryType(res) {
    const items: ImageGalleryItem[] = [];
    res.acf.ths_image_gallery[0].gallery_items.forEach((item) => {
      items.push({
        image: item.image.url,
        title: item.title,
        url: item.url,
        description: item.description,
      });
    });
    return {
      number_of_columns: res.acf.ths_image_gallery[0].number_of_columns,
      items: items,
    };
  }

  castResToTextGalleryType(res) {
    const items: TextGalleryItem[] = [];
    res.acf.ths_text_gallery[0].gallery_items.forEach((item) => {
      items.push({
        title: item.title,
        url: item.url,
        description: item.description,
      });
    });
    return {
      number_of_columns: res.acf.ths_text_gallery[0].number_of_columns,
      items: items,
    };
  }

}
