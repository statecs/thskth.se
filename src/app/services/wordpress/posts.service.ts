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

  getPosts(amount): Observable<Post[]> {
    return this.http
        .get(this.config.POSTS_PAGE + '?_embed&per_page=' + amount)
        .map((res: Response) => res.json())
        // Cast response data to FAQ Category type
        .map((res: any) => { return this.castResTo_PostType(res); });
  }

  castResTo_PostType(data: any) {
    const posts: Post[] = [];
    data.forEach(p => {
      let image = '';
      if (p.featured_image_thumbnail_url) {
        image = p.featured_image_thumbnail_url;
      }
      posts.push({
        title: p.title.rendered,
        slug: p.slug,
        content: p.content.rendered,
        image: image,
        published_date: p.date,
        last_modified: p.modified,
        author: this.castDataToAuthorType(p._embedded.author),
      });
    });
    return posts;
  }

  castDataToAuthorType(data: any): Author {
    const author: Author = {
      name: '',
      email: ''
    };
    if (data.length > 0) {
      author.name = data[0].name;
    }
    return author;
  }

}
