import {Component, OnDestroy, OnInit} from '@angular/core';
import format from 'date-fns/format/index';
import { ths_calendars } from '../../../utils/ths-calendars';
import { GoogleCalendarService } from '../../../services/google-calendar/google-calendar.service';
import { Event } from '../../../interfaces/event';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {PopupWindowCommunicationService} from '../../../services/component-communicators/popup-window-communication.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-events-card',
  templateUrl: './events-card.component.html',
  styleUrls: ['./events-card.component.scss']
})
export class EventsCardComponent implements OnInit, OnDestroy {
  public events: Event[];
  public selected_event_title: string;
  public selected_event_text: string;
  public ths_calendars: any[];
  public selected_event_index: number;
  public lang: string;
  public parentParamsSubscription: Subscription;
  public calendarSubscription: Subscription;
  public eventsSubscription: Subscription;

  constructor(
      private googleCalendarService: GoogleCalendarService,
      private router: Router,
      private popupWindowCommunicationService: PopupWindowCommunicationService,
      private activatedRoute: ActivatedRoute
  ) {
    this.ths_calendars = ths_calendars;
    this.parentParamsSubscription = this.activatedRoute.parent.params.subscribe((params2: Params) => {
      this.lang = params2['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }
    });
  }

  displayEventInPopup(event: Event) {
    this.popupWindowCommunicationService.showEventInPopup(event);
  }

  goToPage(slug): void {
    this.router.navigate(['/' + slug]);
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

  mergeArrays(arrays: any): Event[] {
    let merged: Event[] = [];
    arrays.forEach((event) => {
      merged = merged.concat(event);
    });
    return merged;
  }

  sortArrayByTime(a, b) {
    a = new Date(a.start);
    b = new Date(b.start);
    return a < b ? -1 : a > b ? 1 : 0;
  };

  ngOnInit() {
    this.eventsSubscription = this.googleCalendarService.getAllEvents(null, '').subscribe(res => {
      const mergedArrays = this.mergeArrays(res);
      const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
      if (sortedArrays.length > 4) {
        this.events = sortedArrays.slice(0, 4);
      }else {
        this.events = sortedArrays;
      }
    });
  }

  ngOnDestroy() {
    if (this.parentParamsSubscription) {
      this.parentParamsSubscription.unsubscribe();
    }
    if (this.calendarSubscription) {
      this.calendarSubscription.unsubscribe();
    }
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }

}
