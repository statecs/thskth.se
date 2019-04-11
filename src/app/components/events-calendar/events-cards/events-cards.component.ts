import { Component, Input, OnInit } from "@angular/core";
import { Event } from "../../../interfaces-and-classes/event";
import { PopupWindowCommunicationService } from "../../../services/component-communicators/popup-window-communication.service";
import * as format from "date-fns/format";
import { CookieService } from "ngx-cookie";
import { Location } from "@angular/common";
import { ths_calendars, THSCalendar } from "../../../utils/ths-calendars";

@Component({
  selector: "app-events-cards",
  templateUrl: "./events-cards.component.html",
  styleUrls: ["./events-cards.component.scss"]
})
export class EventsCardsComponent implements OnInit {
  @Input() events: Event[];
  @Input() title: string;
  private lang: string;
  public ths_calendars: { [key: string]: THSCalendar };

  constructor(
    private location: Location,
    private popupWindowCommunicationService: PopupWindowCommunicationService,
    private cookieService: CookieService
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

  formatDay(start) {
    return format(start, "MMM DD");
  }
}
