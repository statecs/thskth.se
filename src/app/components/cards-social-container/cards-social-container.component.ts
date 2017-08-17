import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WordpressApiService } from '../../services/wordpress/wordpress-api.service';
import { Card } from '../../interfaces/card';
import { SocialMediaPostService } from '../../services/social-media-post/social-media-post.service';
import { SocialMediaPost } from '../../interfaces/social_media_post';
import format from 'date-fns/format/index';
import { GoogleCalendarService } from '../../services/google-calendar/google-calendar.service';
import { Event } from '../../interfaces/event';
import { PopupWindowCommunicationService } from '../../services/component-communicators/popup-window-communication.service';
import { ths_calendars } from '../../utils/ths-calendars';

@Component({
  selector: 'app-cards-social-container',
  templateUrl: './cards-social-container.component.html',
  styleUrls: ['./cards-social-container.component.scss']
})
export class CardsSocialContainerComponent implements OnInit {
  public cards: Card[];
  public socialMediaPosts: SocialMediaPost[];
  private meta_data: SocialMediaPost[];
  public displayedCards_amount: number;
  public showEventCalendar: boolean;
  public events: Event[];

  public selected_event_title: string;
  public selected_event_text: string;
  public selected_event_index: number;
  public ths_calendars: any[];

  constructor( private socialMediaPostService: SocialMediaPostService,
               private googleCalendarService: GoogleCalendarService,
               private popupWindowCommunicationService: PopupWindowCommunicationService) {
    this.displayedCards_amount = 4;
    this.showEventCalendar = false;
    this.ths_calendars = ths_calendars;
  }

  fetchMorePosts(): void {
    this.socialMediaPosts = this.meta_data.slice(0, this.displayedCards_amount + 4);
    this.displayedCards_amount += 4;
  }

  displayEventInPopup() {
    this.popupWindowCommunicationService.showEventInPopup(this.events[this.selected_event_index]);
  }

  selectEvent(i) {
    this.selected_event_title = this.events[i].title;
    this.selected_event_text = this.events[i].description;
    this.selected_event_index = i;
  }

  getMonth(date): string {
    return format(date, 'MMM');
  }

  getDay(date): string {
    return format(date, 'DD');
  }

  formatDate(created_time): string {
    const date = new Date(created_time * 1000);
    return format(date, 'DD MMM YYYY') + ' at ' + format(date, 'hh:mma');
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
    this.selected_event_index = 0;
    this.socialMediaPostService.fetchAllPosts().subscribe(res => {
      this.meta_data = res;
      this.socialMediaPosts = res.slice(0, this.displayedCards_amount);
    });

    this.googleCalendarService.getUpcomingEvents(this.ths_calendars[0].calendarId, 3).subscribe(res => {
      this.events = res;
      if (res.length !== 0) {
        this.selected_event_title = res[0].title;
        this.selected_event_text = res[0].description;
      }
    });
  }
}
