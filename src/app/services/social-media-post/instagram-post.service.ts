import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { SocialMediaPost } from '../../interfaces-and-classes/social_media_post';
import {BaseDataService} from '../abstract-services/base-data.service';
import {DataFetcherService} from '../utility/data-fetcher.service';
import * as _ from 'lodash';

@Injectable()
export class InstagramPostService extends BaseDataService<SocialMediaPost> {

    constructor(protected dataFetcherService: DataFetcherService, private injector: Injector) {
        super(dataFetcherService, injector.get(APP_CONFIG).INSTAGRAM_POST_URL + '?lang=en');
    }

    getPosts(): Observable<SocialMediaPost[]> {
        return this.getData().map((res: any) => {
            return this.castInstaResSMPType(res.data);
        });
    }

    private castInstaResSMPType(post_list): SocialMediaPost[] {
        const posts: SocialMediaPost[] = [];
        _(post_list).each((post) => {
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
                posts.push({
                    id: post.id,
                    created_time: post.created_time.toString(),
                    message: message,
                    full_picture: post.images.standard_resolution.url,
                    link: post.link,
                    host: 'Instagram',
                    user: user,
                });
            }
        });
        return posts;
    }
}
