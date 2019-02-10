import {Component, Input, OnInit} from '@angular/core';
import {PopupWindowCommunicationService} from '../../../services/component-communicators/popup-window-communication.service';
import {Event} from '../../../interfaces-and-classes/event';
import format from 'date-fns/format/index';
import {ths_calendars} from '../../../utils/ths-calendars';
import * as _ from 'lodash';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {
  public ths_calendars: any;
  eventsByGroupName: {[group: string]: Event[]};
  groupNames: string[];

  @Input() set events(values: Event[]) {
    this.eventsByGroupName = _.groupBy(values, 'calendarName');
    this.groupNames = Object.keys(this.eventsByGroupName);
  };

  constructor(private popupWindowCommunicationService: PopupWindowCommunicationService) {
      this.ths_calendars = ths_calendars;
  }

  ngOnInit() {
  }

  showInPopup(event: Event): void {
      this.popupWindowCommunicationService.showEventInPopup(event);
  }

  getBGimage(e): string {
      if (e.imageUrl) {
          return e.imageUrl;
      }else {
          return '../../../assets/images/placeholder-image.png';
      }
  }

  getDay(start) {
      return format(start, 'DD');
  }

    getMonth(start) {
        return format(start, 'MMM');
    }
}
