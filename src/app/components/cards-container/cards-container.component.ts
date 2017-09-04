import { Component, OnInit, Injector } from '@angular/core';
import { CardsService } from '../../services/wordpress/cards.service';
import { Card } from '../../interfaces/card';
import { CardCategorizerCardContainerService } from '../../services/component-communicators/card-categorizer-card-container.service';
import {Subscription} from 'rxjs/Subscription';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces/appConfig';
import { PopupWindowCommunicationService } from '../../services/component-communicators/popup-window-communication.service';
import { Router} from '@angular/router';
import format from 'date-fns/format/index';
import { GoogleCalendarService } from '../../services/google-calendar/google-calendar.service';
import { Event } from '../../interfaces/event';
import { ths_calendars } from '../../utils/ths-calendars';
import {Location} from '@angular/common';

@Component({
  selector: 'app-cards-container',
  templateUrl: './cards-container.component.html',
  styleUrls: ['./cards-container.component.scss']
})
export class CardsContainerComponent implements OnInit {
  public cards: Card[];
  public arranged_cards: Card[];
    public one_sixth_cards_array: Card[][];
    public one_third_half_array: Card[][];
    private cardsUpdater: Subscription;
    protected config: AppConfig;

    public events: Event[];

    public selected_event_title: string;
    public selected_event_text: string;
    public selected_event_index: number;
    public selected_event_category: number;
    public ths_calendars: any[];
    public cardsLoaded: boolean;

  constructor(  private cardsService: CardsService,
                private cardCategorizerCardContainerService: CardCategorizerCardContainerService,
                private injector: Injector,
                private popupWindowCommunicationService: PopupWindowCommunicationService,
                private googleCalendarService: GoogleCalendarService,
                private router: Router,
                private location: Location ) {
      this.config = injector.get(APP_CONFIG);
      this.selected_event_category = 0;
      this.ths_calendars = ths_calendars;
      this.cardsLoaded = false;
  }

  showPage(slug, window_type, slug_to_page): void {
      if (window_type === 'popup-window') {
          this.popupWindowCommunicationService.update_PopupWindow(slug);
          this.location.go(slug_to_page);
      }else if (window_type === 'new-tab') {
          window.open('/' + slug, '_blank');
      }else if (window_type === 'same-page') {
          this.router.navigate(['/' + slug]);
      }
  }

    getBgUrl(card: any): string {
      let url = '';
      if (card.background_image !== '') {
          url = card.background_image;
      }
      return url;
    }

    changeBGColor(card: any): any {
        console.log(card.background_image);
      if (typeof card.background_color === 'undefined' || card.background_image !== '') {
          return {};
      }else {
          return { 'background-color': card.background_color };
      }
    }

    displayCards(arg: any) {
        this.cardsLoaded = false;
        const self = this;
        self.arranged_cards = [];
        self.one_sixth_cards_array = [];
        self.one_third_half_array = [];
        this.cardsService.getCards(arg)
            .subscribe(cards => {
                this.cards = cards;
                this.cardsLoaded = true;
            });
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

    switchCalendar(calendarId, index) {
      this.getCalendar(calendarId);
      this.selected_event_category = index;
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

  ngOnInit() {
      this.selected_event_title = '';
      this.selected_event_text = '';
      this.selected_event_index = 0;
      this.cardsUpdater = this.cardCategorizerCardContainerService.notifyObservable$.subscribe((arg) => {
          this.displayCards(arg);
      });

      this.getCalendar(this.ths_calendars[0].calendarId);
  }

}
