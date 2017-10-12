import { Component, OnInit } from '@angular/core';
import format from 'date-fns/format/index';
import { ths_calendars } from '../../../utils/ths-calendars';
import { GoogleCalendarService } from '../../../services/google-calendar/google-calendar.service';
import { Event } from '../../../interfaces/event';
import {Router} from '@angular/router';

@Component({
  selector: 'app-events-card',
  templateUrl: './events-card.component.html',
  styleUrls: ['./events-card.component.scss']
})
export class EventsCardComponent implements OnInit {
  public events: Event[];
  public selected_event_title: string;
  public selected_event_text: string;
  public ths_calendars: any[];
  public selected_event_index: number;

  constructor(
      private googleCalendarService: GoogleCalendarService,
      private router: Router
  ) {
    this.ths_calendars = ths_calendars;
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

  getCalendar(calendarId): void {
    this.googleCalendarService.getUpcomingEvents(calendarId, 3).subscribe(res => {
      this.events = res;
      if (res.length !== 0) {
        this.selected_event_title = res[0].title;
        this.selected_event_text = res[0].description;
      }
    });
  }

  mergeArrays(arrays: any): Event[] {
    let merged: Event[] = [];
    arrays.forEach((event) => {
      console.log(event);
      merged = merged.concat(event);
      console.log(merged);
    });
    return merged;
  }

  sortArrayByTime(a, b) {
    a = new Date(a.start);
    b = new Date(b.start);
    console.log(a);
    return a < b ? -1 : a > b ? 1 : 0;
  };

  ngOnInit() {
    //this.getCalendar(this.ths_calendars[0].calendarId);
    this.googleCalendarService.getAllEvents(null).subscribe(res => {
      console.log(res);
      const mergedArrays = this.mergeArrays(res);
      const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
      console.log(sortedArrays);
      if (sortedArrays.length > 4) {
        this.events = sortedArrays.slice(0, 4);
      }else {
        this.events = sortedArrays;
      }
    });
  }

}
