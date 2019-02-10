import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import { SocialMediaPost } from '../../interfaces-and-classes/social_media_post';
import * as _ from 'lodash';
import {FacebookPostService} from './facebook-post.service';
import {InstagramPostService} from './instagram-post.service';

@Injectable()
export class SocialMediaPostService {

  constructor(private facebookPostService: FacebookPostService,
              private instagramPostService: InstagramPostService) {
  }

  fetchAllPosts(): Observable<SocialMediaPost[]> {
      const observables: Observable<any>[] = [];
      observables.push(this.facebookPostService.getPosts());
      observables.push(this.instagramPostService.getPosts());
      return Observable.combineLatest(observables).map(values => {
          let posts: SocialMediaPost[] = [];
          _.each(values, (value) => {
              posts = posts.concat(value);
          });
          return posts.sort(this.sortArrayByTime);
      });
  };

  private sortArrayByTime(a, b) {
    a = new Date(a.created_time);
    b = new Date(b.created_time);
    return a > b ? -1 : a < b ? 1 : 0;
  };
}
