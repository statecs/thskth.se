import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces-and-classes/appConfig';
import { CookieService } from 'ngx-cookie';
import {Author, Page, ImageGallery, TextGallery, ImageGalleryItem, TextGalleryItem, RelatedLink} from '../../interfaces-and-classes/page';

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

  getPageBySlug(slug, lang): Observable<Page> {
    return this.http
        .get(this.config.PAGES_URL + '?slug=' + slug + '&lang=' + lang)
        .map((res: Response) => res.json())
        .map((res: any) => { return this.castResTo_PageType(res[0]); });
  }

  castResTo_PageType(res) {
    let page: Page;
    let header_image = '';
    let text_gallery: TextGallery;
    let image_gallery: ImageGallery;
    let related_links: RelatedLink[];
    let author: Author = {
      name: '',
      email: ''
    };
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
      if (res.acf.related_links) {
        related_links = this.getRelatedLinks(res);
      }
      if (res.author) {
        author = {
          name: res.author.display_name,
          email: res.author.user_email
        };
      }
      page = {
        name: res.title.rendered,
        slug: res.slug,
        last_modifiled: res.modified,
        content: res.content.rendered,
        header: {
          header_image: header_image,
          header_color: res.acf.header_color
        },
        template: res.acf.template,
        image_gallery: image_gallery,
        text_gallery: text_gallery,
        related_links: related_links,
        author: author
      };
    }
    return page;
  }

  getRelatedLinks(res) {
    const items: RelatedLink[] = [];
    res.acf.related_links.forEach((item) => {
      items.push({
        name: item.name,
        url: item.url,
      });
    });
    return items;
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
    let number_of_columns = 0;
    if (res.acf.ths_text_gallery[0].gallery_items) {
      res.acf.ths_text_gallery[0].gallery_items.forEach((item) => {
        items.push({
          title: item.title,
          url: item.url,
          description: item.description,
        });
      });
    }

    if (res.acf.ths_text_gallery[0]) {
      number_of_columns = res.acf.ths_text_gallery[0].number_of_columns;
    }
    return {
      number_of_columns: number_of_columns,
      items: items,
    };
  }

}
