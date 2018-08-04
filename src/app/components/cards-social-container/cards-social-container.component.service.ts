import {Injectable} from '@angular/core';
import {SocialMediaPostService} from '../../services/social-media-post/social-media-post.service';
import {Observable} from 'rxjs/Observable';
import {SocialMediaPost} from '../../interfaces-and-classes/social_media_post';

@Injectable()
export class CardsSocialContainerComponentService {
    viewModel: CardsSocialContainerViewModel = new CardsSocialContainerViewModel();

    constructor(private socialMediaPostService: SocialMediaPostService) {
    }

    getData(): Observable<CardsSocialContainerViewModel> {
        return this.socialMediaPostService.fetchAllPosts().map((res) => {
            this.viewModel.meta_data = res;
            this.viewModel.thirdCard = res[2];
            const first_six_posts = res.slice(0, this.viewModel.displayedCards_amount + 1);
            first_six_posts.splice(2, 1);
            this.viewModel.socialMediaPosts = first_six_posts;
            this.viewModel.fetching = false;
            return this.viewModel;
        });
    }
}

export class CardsSocialContainerViewModel {
    meta_data: SocialMediaPost[];
    fetching = true;
    thirdCard: SocialMediaPost;
    socialMediaPosts: SocialMediaPost[];
    displayedCards_amount = 6;
}
