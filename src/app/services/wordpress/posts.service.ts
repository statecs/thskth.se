import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces-and-classes/appConfig';
import { CookieService } from 'ngx-cookie';
import { Post, Author } from '../../interfaces-and-classes/post';
import {DataFetcherService} from '../utility/data-fetcher.service';
import {WordpressBaseDataService} from '../abstract-services/wordpress-base-data.service';

@Injectable()
export class PostsService extends WordpressBaseDataService<Post> {
  protected config: AppConfig;
  protected language: string;

    constructor(protected dataFetcherService: DataFetcherService,
                private injector: Injector,
                private _cookieService: CookieService) {
        super(dataFetcherService, injector.get(APP_CONFIG).POSTS_PAGE);
    this.config = injector.get(APP_CONFIG);

    if (typeof this._cookieService.get('language') === 'undefined') {
      this.language = 'en';
    }else {
      this.language = this._cookieService.get('language');
    }
  }

  getPosts(amount, lang: string): Observable<Post[]> {
    this.language = lang;
    return this.getData(null, '_embed&per_page=' + amount + '&lang=' + this.language)
        // Cast response data to FAQ Category type
        .map((res: any) => { return this.castResTo_PostType(res); });
  }

  getOffers(amount, lang: string): Observable<Post[]> {
    this.language = lang;
    return this.searchData('_embed&sticky=true&per_page=' + amount + '&lang=' + this.language)
        // Cast response data to FAQ Category type
        .map((res: any) => { return this.castResTo_PostType(res); });
  }

  getPostBySlug(slug, lang: string): Observable<Post> {
    this.language = lang;
    return this.getDataBySlug('_embed&slug=' + slug + '&lang=' + this.language)
        // Cast response data to FAQ Category type
        .map((res: any) => { return this.castResTo_PostType(res)[0]; });
  }
  castResTo_PostType(data: any) {
    const posts: Post[] = [];
    data.forEach(p => {
      const image: any = {};
      if (p['_embedded']['wp:featuredmedia']) {
        if (p['_embedded']['wp:featuredmedia'][0]) {
          if (p['_embedded']['wp:featuredmedia'][0].media_details.sizes) {
            if (p['_embedded']['wp:featuredmedia'][0].media_details.sizes.thumbnail) {
              image.thumbnail = p['_embedded']['wp:featuredmedia'][0].media_details.sizes.thumbnail.source_url;
            }
            if (p['_embedded']['wp:featuredmedia'][0].media_details.sizes.medium) {
              image.medium = p['_embedded']['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
            }
            if (p['_embedded']['wp:featuredmedia'][0].media_details.sizes.large) {
              image.large = p['_embedded']['wp:featuredmedia'][0].media_details.sizes.large.source_url;
            }
          }
        }
      }
      posts.push({
          id: p.id,
        title: p.title.rendered,
        slug: p.slug,
        content: p.content.rendered,
        image: image,
        published_date: p.date,
        last_modified: p.modified,
        author: this.castDataToAuthorType(p),
      });
    });
    return posts;
  }

  castDataToAuthorType(data: any): Author {
    const author: Author = {
      name: data['_embedded'].author[0].name,
      email: data.author.user_email,
      avatar_url: {
        thumbnail: data['_embedded'].author[0].avatar_urls['24'],
        medium: data['_embedded'].author[0].avatar_urls['48'],
        large: data['_embedded'].author[0].avatar_urls['96'],
      }
    };
    if (data.length > 0) {
      author.name = data[0].name;
    }
    return author;
  }

}
