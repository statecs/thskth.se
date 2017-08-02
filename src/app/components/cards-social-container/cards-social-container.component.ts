import { Component, OnInit } from '@angular/core';
import { WordpressApiService } from '../../services/wordpress/wordpress-api.service';
import { Card } from '../../interfaces/card';
import { SocialMediaPostService } from '../../services/social-media-post/social-media-post.service';
import { SocialMediaPost } from '../../interfaces/social_media_post';
import format from 'date-fns/format/index';

@Component({
  selector: 'app-cards-social-container',
  templateUrl: './cards-social-container.component.html',
  styleUrls: ['./cards-social-container.component.scss']
})
export class CardsSocialContainerComponent implements OnInit {
  public cards: Card[];
  public socialMediaPosts: SocialMediaPost[];
  public displayedCards_amount: number;
  public showEventCalendar: boolean;

  constructor( private socialMediaPostService: SocialMediaPostService ) {
    this.displayedCards_amount = 4;
    this.showEventCalendar = false;
  }

  formatDate(created_time): string {
    const date = new Date(created_time * 1000);
    console.log(created_time);
    console.log(date);
    return format(date, 'DD MMM YYYY');
  }

  goToUserProfile(url): void {
    console.log(url);
    window.open(url, '_blank');
  }

  updateEventCalendar(index) {
    console.log(index);
    if (index == 2) {
      this.showEventCalendar = true;
    }
  }

  ngOnInit() {
    this.socialMediaPostService.fetchAllPosts().subscribe(res => {
      console.log(res);
      this.socialMediaPosts = res.slice(0, this.displayedCards_amount);
      console.log(this.socialMediaPosts);
    });
  }

}
