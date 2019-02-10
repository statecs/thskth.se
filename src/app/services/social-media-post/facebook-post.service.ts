import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { SocialMediaPost } from '../../interfaces-and-classes/social_media_post';
import {BaseDataService} from '../abstract-services/base-data.service';
import {DataFetcherService} from '../utility/data-fetcher.service';
import * as _ from 'lodash';

@Injectable()
export class FacebookPostService extends BaseDataService<SocialMediaPost> {

    constructor(protected dataFetcherService: DataFetcherService, private injector: Injector) {
        super(dataFetcherService, injector.get(APP_CONFIG).FACEBOOK_POST_URL + '?lang=en');
    }

    getPosts(): Observable<SocialMediaPost[]> {
        return this.getData().map((res: any) => {
            let posts: SocialMediaPost[] = [];
            _.each(res, (data) => {
                posts = posts.concat(this.castFBResSMPType(data.data));
            });
            return posts;
        });
    }

    private castFBResSMPType(post_list): SocialMediaPost[] {
        const posts: SocialMediaPost[] = [];
        _(post_list).each((post) => {
            const user = {
                name: post.from.name,
                profile_image: 'http://graph.facebook.com/' + post.from.id + '/picture?type=square',
                link: 'https://www.facebook.com/' + post.from.id,
            };
            posts.push({
                id: post.id,
                created_time: post.created_time.toString(),
                message: post.message,
                full_picture: post.full_picture,
                link: post.link,
                host: 'Facebook',
                user: user,
            });
        });
        return posts;
    }
}
