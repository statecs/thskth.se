import { Component, Input, OnInit } from "@angular/core";
import { PopupWindowCommunicationService } from "../../../services/component-communicators/popup-window-communication.service";
import { Event } from "../../../interfaces-and-classes/event";
import * as format from "date-fns/format";
import { ths_calendars } from "../../../utils/ths-calendars";
import { CookieService } from "ngx-cookie";
import { Location } from "@angular/common";
import * as _ from "lodash";

@Component({
  selector: "app-events-list",
  templateUrl: "./events-list.component.html",
  styleUrls: ["./events-list.component.scss"]
})
export class EventsListComponent implements OnInit {
  public ths_calendars: any;
  eventsByGroupName: { [group: string]: Event[] };
  groupNames: string[];
  private lang: string;

  @Input() set events(values: Event[]) {
    this.eventsByGroupName = _.groupBy(values, "calendarName");
    this.groupNames = Object.keys(this.eventsByGroupName);
  }

  constructor(
    private location: Location,
    private cookieService: CookieService,
    private popupWindowCommunicationService: PopupWindowCommunicationService
  ) {
    this.ths_calendars = ths_calendars;
  }

  ngOnInit() {}

  showInPopup(event: Event): void {
    this.lang = this.cookieService.get("language");
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

  getBGimage(e): string {
    if (e.imageUrl) {
      return e.imageUrl;
    } else {
      return "../../../assets/images/placeholder-image.png";
    }
  }

  getDay(start) {
    return format(start, "DD");
  }

  getMonth(start) {
    return format(start, "MMM");
  }
}
