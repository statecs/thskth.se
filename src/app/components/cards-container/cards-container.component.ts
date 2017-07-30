import { Component, OnInit, Injector } from '@angular/core';
import { WordpressApiService } from '../../services/wordpress/wordpress-api.service';
import { Card } from '../../interfaces/card';
import { CardCategorizerCardContainerService } from '../../services/component-communicators/card-categorizer-card-container.service';
import {Subscription} from 'rxjs/Subscription';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces/appConfig';
import { PopupWindowCommunicationService } from '../../services/component-communicators/popup-window-communication.service';
import { Router} from '@angular/router';

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

  constructor(  private wordpressApiService: WordpressApiService,
                private cardCategorizerCardContainerService: CardCategorizerCardContainerService,
                private injector: Injector,
                private popupWindowCommunicationService: PopupWindowCommunicationService,
                private router: Router) {
      this.config = injector.get(APP_CONFIG);
  }

  showPage(slug, window_type): void {
      if (window_type == 'popup-window') {
          this.popupWindowCommunicationService.update_PopupWindow(slug);
      }else if (window_type == 'new-tab') {
          window.open('/' + slug, '_blank');
      }else if (window_type == 'same-page') {
          this.router.navigate(['/' + slug]);
      }
  }

    getBgUrl(card: any): string {
      let url = '';
      if (typeof card.background_image.sizes !== 'undefined') {
          url = card.background_image.sizes.medium_large;
      }
      return url;
    }

    changeBGColor(card: any): any {
      if (typeof card.background_color === 'undefined' || typeof card.background_image.sizes !== 'undefined') {
          return {};
      }else {
          return { 'background-color': card.background_color };
      }
    }

    displayCards(arg: any) {
        const self = this;
        self.arranged_cards = [];
        self.one_sixth_cards_array = [];
        self.one_third_half_array = [];
        this.wordpressApiService.getCards(arg)
            .subscribe(res => {
                console.log(res);
                this.cards = res;
                let one_sixth_array_no = 0;
                let o_third_half_array_no = 0;
                this.one_sixth_cards_array[one_sixth_array_no] = [];
                this.one_third_half_array[o_third_half_array_no] = [];
                for (let i = 0; i < res.length; i++) {
                    if (res[i].flex_layout == 'one-sixth') {
                        if (this.one_sixth_cards_array[one_sixth_array_no].length === 4) {
                            one_sixth_array_no++;
                            this.one_sixth_cards_array[one_sixth_array_no] = [];
                            this.one_sixth_cards_array[one_sixth_array_no].push(res[i]);
                        }else {
                            this.one_sixth_cards_array[one_sixth_array_no].push(res[i]);
                        }
                    }else if (res[i].flex_layout == 'one-third-half') {
                        if (this.one_third_half_array[o_third_half_array_no].length === 2) {
                            o_third_half_array_no++;
                            this.one_third_half_array[o_third_half_array_no] = [];
                            this.one_third_half_array[o_third_half_array_no].push(res[i]);
                        }else {
                            this.one_third_half_array[o_third_half_array_no].push(res[i]);
                        }
                    }else {
                        self.arranged_cards.push(res[i]);
                    }
                }
                console.log(this.arranged_cards);
                console.log(this.one_sixth_cards_array);
                console.log(this.one_third_half_array);
            });
    }

  ngOnInit() {
      this.cardsUpdater = this.cardCategorizerCardContainerService.notifyObservable$.subscribe((arg) => {
          this.displayCards(arg);
      });
      this.displayCards({profession: this.config.PROFESSION.student, organization_type: 0, interest: this.config.USER_INTEREST.student});
  }

}
