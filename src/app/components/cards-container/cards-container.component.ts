import {Component, OnInit, Injector, OnDestroy, HostListener} from '@angular/core';
import { CardsService } from '../../services/wordpress/cards.service';
import { Card } from '../../interfaces/card';
import { CardCategorizerCardContainerService } from '../../services/component-communicators/card-categorizer-card-container.service';
import {Subscription} from 'rxjs/Subscription';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces/appConfig';
import { PopupWindowCommunicationService } from '../../services/component-communicators/popup-window-communication.service';
import {ActivatedRoute, Router} from '@angular/router';
import format from 'date-fns/format/index';
import { GoogleCalendarService } from '../../services/google-calendar/google-calendar.service';
import { Event } from '../../interfaces/event';
import { ths_calendars } from '../../utils/ths-calendars';
import {Location} from '@angular/common';
import {NotificationBarCommunicationService} from '../../services/component-communicators/notification-bar-communication.service';

@Component({
  selector: 'app-cards-container',
  templateUrl: './cards-container.component.html',
  styleUrls: ['./cards-container.component.scss']
})
export class CardsContainerComponent implements OnInit, OnDestroy {
  public cards: Card[];
  public standbyCards: Card[];
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
    public lang: string;
    public paramsSubscription: Subscription;
    public cardsSubscription: Subscription;
    public eventsSubscription: Subscription;
    public deviceSize: number;

  constructor(  private cardsService: CardsService,
                private cardCategorizerCardContainerService: CardCategorizerCardContainerService,
                private injector: Injector,
                private popupWindowCommunicationService: PopupWindowCommunicationService,
                private googleCalendarService: GoogleCalendarService,
                private router: Router,
                private location: Location,
                private activatedRoute: ActivatedRoute,
                private notificationBarCommunicationService: NotificationBarCommunicationService ) {
      this.config = injector.get(APP_CONFIG);
      this.selected_event_category = 0;
      this.ths_calendars = ths_calendars;
      this.cardsLoaded = false;
      this.lang = activatedRoute.snapshot.data['lang'];
      this.deviceSize = window.screen.width;
  }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll() {
        if (this.standbyCards) {
            const pos = (document.documentElement.scrollTop || document.body.scrollTop);
            if (pos > 200) {
                this.cards = this.cards.concat(this.standbyCards);
                this.standbyCards = null;
            }
        }
    }

    goToPage(link): void {
      if (link.substring(0, 7) === 'http://' || link.substring(0, 8) === 'https://') {
          window.open(link, '_blank');
      }else {
          this.router.navigate([link]);
      }
    }

  showPage(slug, window_type, slug_to_page): void {
      if (this.lang === 'sv') {
          slug_to_page = 'sv' + (slug_to_page.substring(0, 1) === '/' ? '' : '/') + slug_to_page;
      }else {
          slug_to_page = 'en' + (slug_to_page.substring(0, 1) === '/' ? '' : '/') + slug_to_page;
      }
      if (window_type === 'popup-window') {
          this.popupWindowCommunicationService.showPageInPopup(slug);
          this.location.go(slug_to_page);
      }else if (window_type === 'new-tab') {
          window.open('/' + slug_to_page, '_blank');
      }else if (window_type === 'same-page') {
          this.router.navigate(['/' + slug_to_page]);
      }
  }

    getBgUrl(card: any): string {
      let url = '';
      if (card.background_image !== '') {
          const image = card.background_image;
          if (this.deviceSize < 768) {
              url = image.image640;
          }else if (this.deviceSize >= 768 && this.deviceSize < 992) {
              url = image.image960;
          }else if (this.deviceSize >= 992 && this.deviceSize < 1200) {
              url = image.image1280;
          }else if (this.deviceSize >= 1200) {
              url = image.image1920;
          }
      }
      return url;
    }

    getBgUrl_thumbnail(card: any): string {
        let url = '';
        if (card.background_image !== '') {
            url = card.background_image.thumbnail;
        }
        return url;
    }

    changeBGColor(card: any): any {
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
        this.cardsSubscription = this.cardsService.getCards(arg, this.lang).subscribe(
            cards => {
                const pos = (document.documentElement.scrollTop || document.body.scrollTop);
                if (pos > 200) {
                    this.cards = cards;
                    this.standbyCards = null;
                }else {
                    this.cards = cards.slice(0, 4);
                    this.standbyCards = cards.slice(4);
                }
                this.cardsLoaded = true;
            },
            (error) => {
                this.notificationBarCommunicationService.send_data(error);
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
        this.eventsSubscription = this.googleCalendarService.getUpcomingEvents(calendarId, 3).subscribe(res => {
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

    ngOnDestroy() {
        if (this.paramsSubscription) {
            this.paramsSubscription.unsubscribe();
        }
        if (this.cardsSubscription) {
            this.cardsSubscription.unsubscribe();
        }
        if (this.eventsSubscription) {
            this.eventsSubscription.unsubscribe();
        }
        if (this.cardsUpdater) {
            this.cardsUpdater.unsubscribe();
        }
    }
}
