import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces/appConfig';
import { CookieService } from 'ngx-cookie';
import { Post, Author } from '../../interfaces/post';

@Injectable()
export class PostsService {
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

  getPosts(amount, lang: string): Observable<Post[]> {
    this.language = lang;
    return this.http
        .get(this.config.POSTS_PAGE + '?_embed&per_page=' + amount + '&lang=' + this.language)
        .map((res: Response) => res.json())
        // Cast response data to FAQ Category type
        .map((res: any) => { return this.castResTo_PostType(res); });
  }

  getOffers(amount, lang: string): Observable<Post[]> {
    this.language = lang;
    return this.http
        .get(this.config.POSTS_PAGE + '?_embed&sticky=true&per_page=' + amount + '&lang=' + this.language)
        .map((res: Response) => res.json())
        // Cast response data to FAQ Category type
        .map((res: any) => { return this.castResTo_PostType(res); });
  }

  getPostBySlug(slug, lang: string): Observable<Post> {
    this.language = lang;
    return this.http
        .get(this.config.POSTS_PAGE + '?_embed&slug=' + slug + '&lang=' + this.language)
        .map((res: Response) => res.json())
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
            image.thumbnail = p['_embedded']['wp:featuredmedia'][0].media_details.sizes.thumbnail.source_url;
            image.medium = p['_embedded']['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
            image.large = p['_embedded']['wp:featuredmedia'][0].media_details.sizes.large.source_url;
          }
        }
      }
      posts.push({
        title: p.title.rendered,
        slug: p.slug,
        content: p.content.rendered,
        image: image,
        published_date: p.date,
        last_modified: p.modified,
        author: this.castDataToAuthorType(p['_embedded']),
      });
    });
    return posts;
  }

  castDataToAuthorType(data: any): Author {
    const author: Author = {
      name: data.author[0].name,
      email: '',
      avatar_url: {
        thumbnail: data.author[0].avatar_urls['24'],
        medium: data.author[0].avatar_urls['48'],
        large: data.author[0].avatar_urls['96'],
      }
    };
    if (data.length > 0) {
      author.name = data[0].name;
    }
    return author;
  }

}
