import {Component, OnInit, ViewChild, ElementRef, Input, HostListener} from '@angular/core';
import { WordpressApiService } from '../../services/wordpress/wordpress-api.service';
import { Card } from '../../interfaces/card';
import { SocialMediaPostService } from '../../services/social-media-post/social-media-post.service';
import { SocialMediaPost } from '../../interfaces/social_media_post';
import format from 'date-fns/format/index';
import { GoogleCalendarService } from '../../services/google-calendar/google-calendar.service';
import { Event } from '../../interfaces/event';
import { PopupWindowCommunicationService } from '../../services/component-communicators/popup-window-communication.service';
import { ths_calendars } from '../../utils/ths-calendars';
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-cards-social-container',
  templateUrl: './cards-social-container.component.html',
  styleUrls: ['./cards-social-container.component.scss']
})
export class CardsSocialContainerComponent implements OnInit {
  @Input() showFetchMoreBtn: boolean;
  public cards: Card[];
  public socialMediaPosts: SocialMediaPost[];
  public thirdCard: SocialMediaPost;
  private meta_data: SocialMediaPost[];
  public displayedCards_amount: number;
  public showEventCalendar: boolean;
  public events: Event[];

  public selected_event_title: string;
  public selected_event_text: string;
  public selected_event_index: number;
  public ths_calendars: any[];
  public existMorePosts: boolean;
  public fetching: boolean;
  public lang: string;
  public read_more: string;

  constructor( private socialMediaPostService: SocialMediaPostService,
               private googleCalendarService: GoogleCalendarService,
               private popupWindowCommunicationService: PopupWindowCommunicationService,
               private activatedRoute: ActivatedRoute,
               private router: Router) {
    this.displayedCards_amount = 6;
    this.showEventCalendar = false;
    this.ths_calendars = ths_calendars;
    this.existMorePosts = true;
    this.fetching = true;
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      console.log(this.lang);
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }
      (this.lang === 'en' ? this.read_more = 'Read more' : this.read_more = 'Läs Mer');
    });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (!this.showFetchMoreBtn && this.meta_data) {
      const pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
      const max = document.documentElement.scrollHeight;
      if (pos > max - 300) {
        this.fetchMorePosts();
      }
    }
  }

  fetchMorePosts(): void {
    this.fetching = true;
    this.displayedCards_amount += 6;
    this.socialMediaPosts = this.meta_data.slice(0, this.displayedCards_amount);
    if (this.displayedCards_amount >= this.meta_data.length) {
      this.existMorePosts = false;
    }
    this.fetching = false;
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
      this.thirdCard = res[2];
      const first_six_posts = res.slice(0, this.displayedCards_amount + 1);
      first_six_posts.splice(2, 1);
      this.socialMediaPosts = first_six_posts;
      this.fetching = false;
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
