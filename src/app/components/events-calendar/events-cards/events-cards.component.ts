import { Component, Input, OnInit } from "@angular/core";
import { Event } from "../../../interfaces-and-classes/event";
import { PopupWindowCommunicationService } from "../../../services/component-communicators/popup-window-communication.service";
import * as format from "date-fns/format";
import { ths_calendars, THSCalendar } from "../../../utils/ths-calendars";

@Component({
  selector: "app-events-cards",
  templateUrl: "./events-cards.component.html",
  styleUrls: ["./events-cards.component.scss"]
})
export class EventsCardsComponent implements OnInit {
  @Input() events: Event[];
  @Input() title: string;
  public ths_calendars: { [key: string]: THSCalendar };

  constructor(
    private popupWindowCommunicationService: PopupWindowCommunicationService
  ) {
    this.ths_calendars = ths_calendars;
  }

  ngOnInit() {}

  showInPopup(event: Event): void {
    this.popupWindowCommunicationService.showEventInPopup(event);
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
