import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/forkJoin';
import { AppConfig } from '../../interfaces-and-classes/appConfig';
import { APP_CONFIG } from '../../app.config';
import { SocialMediaPost } from '../../interfaces-and-classes/social_media_post';

@Injectable()
export class SocialMediaPostService {
  protected config: AppConfig;
  public all_posts: SocialMediaPost[];
  public facebook_posts: SocialMediaPost[];
  public instagram_posts: SocialMediaPost[];

  constructor(private http: Http, private injector: Injector) {
    this.config = injector.get(APP_CONFIG);
    this.all_posts = [];
    this.facebook_posts = [];
    this.instagram_posts = [];
  }

  fetchAllPosts(): Observable<SocialMediaPost[]> {
    this.all_posts = [];
    return this.fetchFacebookPosts().flatMap(() => {
      return this.fetchInstagramPosts();
    }).map(() => {
      this.all_posts = this.all_posts.concat(this.facebook_posts);
      this.all_posts = this.all_posts.concat(this.instagram_posts);
      return this.all_posts.sort(this.sortArrayByTime);
    });
  };

  fetchFacebookPosts(): Observable<SocialMediaPost[]> {
    this.facebook_posts = [];
    return this.http
        .get(this.config.FACEBOOK_POST_URL + '?lang=en')
        .map((res: Response) => res.json())
        // Cast response data to SocialMediaPost type
        .map((res: any) => {
          this.castFBResSMPType(res[this.config.THS_FACEBOOK_USER_ID]['data']);
          this.castFBResSMPType(res[this.config.ARMADA_FACEBOOK_USER_ID]['data']);
          this.facebook_posts.sort(this.sortArrayByTime);
          return this.facebook_posts;
        });
  }

  fetchInstagramPosts(): Observable<SocialMediaPost[]> {
    this.instagram_posts = [];
    return this.http
        .get(this.config.INSTAGRAM_POST_URL + '?lang=en')
        .map((res: Response) => res.json())
        // Cast response data to SocialMediaPost type
        .map((res: any) => {
          this.castInstaResSMPType(res.data);
          return this.instagram_posts;
        });
  }

  sortArrayByTime(a, b) {
    a = new Date(parseInt(a.created_time, 10));
    b = new Date(parseInt(b.created_time, 10));
    return a > b ? -1 : a < b ? 1 : 0;
  };

  getPostId(arg): string {
    return arg.split('_')[1];
  }

  castFBResSMPType(post_list) {
    post_list.forEach((post) => {
      const user = {
        name: post.from.name,
        profile_image: 'http://graph.facebook.com/' + post.from.id + '/picture?type=square',
        link: 'https://www.facebook.com/' + post.from.id,
      };
      this.facebook_posts.push({
        created_time: post.created_time.toString(),
        message: post.message,
        full_picture: post.full_picture,
        link: post.link,
        host: 'Facebook',
        user: user,
      });
    });
  }

  castInstaResSMPType(post_list) {
    post_list.forEach((post) => {
      if (!(post instanceof Array)) {
        const user = {
          name: post.user.full_name,
          profile_image: post.user.profile_picture,
          link: 'https://www.instagram.com/' + post.user.username,
        };
        let message = '';
        if (post.caption) {
          message = post.caption.text;
        }
        this.instagram_posts.push({
          created_time: post.created_time.toString(),
          message: message,
          full_picture: post.images.standard_resolution.url,
          link: post.link,
          host: 'Instagram',
          user: user,
        });
      }
    });
  }

}
