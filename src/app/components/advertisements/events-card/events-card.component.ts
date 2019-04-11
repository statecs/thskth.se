import { Component, OnDestroy, OnInit } from "@angular/core";
import * as format from "date-fns/format";
import { ths_calendars, THSCalendar } from "../../../utils/ths-calendars";
import { GoogleCalendarService } from "../../../services/google-calendar/google-calendar.service";
import { Event } from "../../../interfaces-and-classes/event";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { PopupWindowCommunicationService } from "../../../services/component-communicators/popup-window-communication.service";
import { Subscription } from "rxjs/Subscription";
import { Location } from "@angular/common";
import { CookieService, CookieOptions } from "ngx-cookie";

@Component({
  selector: "app-events-card",
  templateUrl: "./events-card.component.html",
  styleUrls: ["./events-card.component.scss"]
})
export class EventsCardComponent implements OnInit, OnDestroy {
  public events: any;
  public selected_event_title: string;
  public selected_event_text: string;
  public ths_calendars: { [key: string]: THSCalendar };
  public selected_event_index: number;
  public lang: string;
  public fetched_events: any;
  public parentParamsSubscription: Subscription;
  public calendarSubscription: Subscription;
  public eventsSubscription: Subscription;

  constructor(
    private location: Location,
    private googleCalendarService: GoogleCalendarService,
    private router: Router,
    private _cookieService: CookieService,
    private popupWindowCommunicationService: PopupWindowCommunicationService,
    private activatedRoute: ActivatedRoute
  ) {
    this.ths_calendars = ths_calendars;
    if (this._cookieService.get("language") == "sv") {
      this.lang = "sv";
    } else {
      this.lang = "en";
    }
  }

  displayEventInPopup(event: Event) {
    this.popupWindowCommunicationService.showEventInPopup(event);
    if (this.lang === "sv") {
      this.location.go("sv/events/" + this.stringify(event.title));
    } else {
      this.location.go("en/events/" + this.stringify(event.title));
    }
  }
  stringify(input) {
    return input
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  }

  goToPage(slug): void {
    this.router.navigate(["/" + slug]);
  }

  selectEvent(i) {
    this.selected_event_title = this.events[i].title;
    this.selected_event_text = this.events[i].description;
    this.selected_event_index = i;
  }

  getMonth(date): string {
    return format(date, "MMM");
  }

  getDay(date): string {
    return format(date, "DD");
  }

  mergeArrays(arrays: any): Event[] {
    let merged: Event[] = [];
    arrays.forEach(event => {
      merged = merged.concat(event);
    });
    return merged;
  }

  sortArrayByTime(a, b) {
    a = new Date(a.start);
    b = new Date(b.start);
    return a < b ? -1 : a > b ? 1 : 0;
  }

  getAllEvents() {
    this.eventsSubscription = this.googleCalendarService
      .getAllEventsCard(null, "")
      .subscribe(res => {
        const mergedArrays = this.mergeArrays(res);
        const sortedArrays = mergedArrays.sort(this.sortArrayByTime);
        if (sortedArrays.length > 4) {
          this.events = sortedArrays.slice(0, 4);
          this.fetched_events = localStorage.setItem(
            "events_list_card",
            JSON.stringify(sortedArrays)
          );
        } else {
          this.events = sortedArrays;
          this.fetched_events = localStorage.setItem(
            "events_list_card",
            JSON.stringify(sortedArrays)
          );
        }
      });
  }

  fetchEvents(): void {
    if (localStorage.getItem("events_list_card")) {
      this.events = JSON.parse(localStorage.getItem("events_list_card"));
    } else {
      this.getAllEvents();
    }
  }

  ngOnInit() {
    this.fetchEvents();
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
