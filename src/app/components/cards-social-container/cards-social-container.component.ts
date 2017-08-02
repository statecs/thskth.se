import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WordpressApiService } from '../../services/wordpress/wordpress-api.service';
import { Card } from '../../interfaces/card';
import { SocialMediaPostService } from '../../services/social-media-post/social-media-post.service';
import { SocialMediaPost } from '../../interfaces/social_media_post';
import format from 'date-fns/format/index';
import { GoogleCalendarService } from '../../services/google-calendar/google-calendar.service';
import { Event } from '../../interfaces/event';

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
  public events: Event[];

  public selected_event_title: string;
  public selected_event_text: string;
  public selected_event_id: string;

  public event_arrow_index: number;

  constructor( private socialMediaPostService: SocialMediaPostService,
               private googleCalendarService: GoogleCalendarService ) {
    this.displayedCards_amount = 4;
    this.showEventCalendar = false;
    this.event_arrow_index = 0;
  }

  selectEvent(i) {
    this.selected_event_title = this.events[i].title;
    this.selected_event_text = this.events[i].description;
    this.selected_event_id = this.events[i].id;
    this.event_arrow_index = i;
  }

  getMonth(date): string {
    return format(date, 'MMM');
  }

  getDay(date): string {
    return format(date, 'DD');
  }

  formatDate(created_time): string {
    const date = new Date(created_time * 1000);
    return format(date, 'DD MMM YYYY');
  }

  goToUserProfile(url): void {
    window.open(url, '_blank');
  }

  updateEventCalendar(index) {
    if (index == 2) {
      this.showEventCalendar = true;
    }
  }

  ngOnInit() {
    this.selected_event_title = '';
    this.selected_event_text = '';
    this.selected_event_id = '';
    this.socialMediaPostService.fetchAllPosts().subscribe(res => {
      console.log(res);
      this.socialMediaPosts = res.slice(0, this.displayedCards_amount);
      console.log(this.socialMediaPosts);
    });

    this.googleCalendarService.getUpcomingEvents(3).subscribe(res => {
      console.log(res);
      this.events = res;
      if (res) {
        this.selected_event_title = res[0].title;
        this.selected_event_text = res[0].description;
        this.selected_event_id = res[0].id;
      }
    });
  }

}
