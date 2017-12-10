import {
  Component, ElementRef, ViewChild, Injector, AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CardCategorizerCardContainerService } from '../../services/component-communicators/card-categorizer-card-container.service';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces/appConfig';
import { CookieService } from 'ngx-cookie';
import { CardsService } from '../../services/wordpress/cards.service';
import { CardCategory } from '../../interfaces/card';
import {ActivatedRoute} from '@angular/router';
import {SelectSliderCommunicationService} from '../../services/component-communicators/select-slider-communication.service';
import {Subscription} from 'rxjs/Subscription';
import {HideUICommunicationService} from '../../services/component-communicators/hide-ui-communication.service';

@Component({
  selector: 'app-card-categorizer',
  templateUrl: './card-categorizer.component.html',
  styleUrls: ['./card-categorizer.component.scss']
})
export class CardCategorizerComponent implements AfterViewInit, OnDestroy {

  @ViewChild('profession') profession: ElementRef;
  @ViewChild('card_categorizer') card_categorizer: ElementRef;

  public displayedDropdown: boolean;
  public displayedDropdownID: number;
  public dropdowns: any;

  public selected_profession: number;
  public selected_interest: number;

  public selected_profession_name: string;
  public selected_interest_name: string;

  public pro_cats: CardCategory[];
  public int_cats: CardCategory[];

  protected config: AppConfig;
  private cards_filter: any;
  public lang: string;
  public paramsSubscription: Subscription;
  public hideUISubscription: Subscription;
  public infoBoxClickCount: number;
  public prof_selectedIndex: number;
  public inter_selectedIndex: number;

  constructor(private cardCategorizerCardContainerService: CardCategorizerCardContainerService,
              private injector: Injector,
              private _cookieService: CookieService,
              private cardsService: CardsService,
              private route: ActivatedRoute,
              private selectSliderCommunicationService: SelectSliderCommunicationService,
              private hideUICommunicationService: HideUICommunicationService) {
    this.config = injector.get(APP_CONFIG);
    this.displayedDropdownID = 0;
    this.cards_filter = this._cookieService.getObject('cards_filter');
    this.lang = route.snapshot.data['lang'];
    this.infoBoxClickCount = 0;
    this.prof_selectedIndex = 0;
    this.inter_selectedIndex = 0;
  }

/*  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (!this.showCardsContainer) {
      const pos = (document.documentElement.scrollTop || document.body.scrollTop);
      if (pos > 10) {
        this.showCardsContainer = true;
        this.cardCategorizerCardContainerService.updateCards({profession: this.selected_profession, interest: this.selected_interest});
      }
    }
  }*/

  showSelectSlider(items, type): void {
    const data = {
      type: type,
      items: items
    };
    this.selectSliderCommunicationService.showSelectSlider(data);
  }

  updateCardsContainer(): void {
    this.cards_filter = this._cookieService.putObject('cards_filter', {profession: this.selected_profession, interest: this.selected_interest});
    this.cardCategorizerCardContainerService.updateCards({profession: this.selected_profession, interest: this.selected_interest});
  }

  toggleDropdown(param): void {
    this.infoBoxClickCount += 1;
    if (this.displayedDropdown) {
      this.hideAllDropdown();
      this.displayedDropdown = false;
    }else {
      this.dropdowns[param - 1].style.display = 'block';
      this.displayedDropdown = true;
    }
    if (this.displayedDropdownID !== param) {
      this.dropdowns[param - 1].style.display = 'block';
      this.displayedDropdown = true;
    }
    this.displayedDropdownID = param;
  }

  hideAllDropdown(): void {
    for (let i = 0; i < this.dropdowns.length; i++) {
      this.dropdowns[i].style.display = 'none';
    }
  }

  updateFiltering(type, e, id, index): void {
    const el = e.target;
    if (type === 'profession') {
      this.selected_profession = id;
      this.selected_profession_name = el.innerHTML;
      this.prof_selectedIndex = index;
    }else if (type === 'interest') {
      this.selected_interest = id;
      this.selected_interest_name = el.innerHTML;
      this.inter_selectedIndex = index;
    }
    this.updateCardsContainer();
  }

  ngAfterViewInit() {
    this.dropdowns = this.card_categorizer.nativeElement.getElementsByClassName('dropdown-container');

    if (typeof this.cards_filter === 'undefined' || (Object.keys(this.cards_filter).length === 0 && this.cards_filter.constructor === Object)) {
      this.cardsService.getCardCategory('profession', this.lang).subscribe((pro_cats) => {
        this.pro_cats = pro_cats;
        this.selected_profession_name = pro_cats[0].name;
        this.selected_profession = pro_cats[0].id;
        this.cardsService.getCardCategory('interest', this.lang).subscribe((int_cats) => {
          this.int_cats = int_cats;
          this.selected_interest_name = int_cats[0].name;
          this.selected_interest = int_cats[0].id;
          this._cookieService.putObject('cards_filter', {profession: this.selected_profession, interest: this.selected_interest});
          this.cardCategorizerCardContainerService.updateCards({profession: this.selected_profession, interest: this.selected_interest});
        });
      });
    }else {
      this.cards_filter = this._cookieService.getObject('cards_filter');
      this.selected_profession = this.cards_filter.profession;
      this.selected_interest = this.cards_filter.interest;
      this.cardsService.getCardCategoryByID(this.selected_profession, 'profession', this.lang).subscribe((cat) => {
        this.selected_profession_name = cat.name;
      });
      this.cardsService.getCardCategoryByID(this.selected_interest, 'interest', this.lang).subscribe((cat) => {
        this.selected_interest_name = cat.name;
      });
      this.cardsService.getCardCategory('interest', this.lang).subscribe((int_cats) => {
        this.int_cats = int_cats;
      });
      this.cardsService.getCardCategory('profession', this.lang).subscribe((pro_cats) => {
          this.pro_cats = pro_cats;
          this.cardCategorizerCardContainerService.updateCards({profession: this.selected_profession, interest: this.selected_interest});
      });
    }

    this.selectSliderCommunicationService.transmitNotifyObservable$.subscribe((data) => {
      if (data.type === 'profession') {
        this.selected_profession_name = data.item.name;
        this.selected_profession = data.item.id;
      }else if (data.type === 'interest') {
        this.selected_interest_name = data.item.name;
        this.selected_interest = data.item.id;
      }
      this.cardCategorizerCardContainerService.updateCards({profession: this.selected_profession, interest: this.selected_interest});
    });

    this.hideUISubscription = this.hideUICommunicationService.hideUIObservable$.subscribe(() => {
      if (this.infoBoxClickCount === 0) {
        this.hideAllDropdown();
        this.infoBoxClickCount += 1;
        this.displayedDropdown = false;
      }else {
        this.infoBoxClickCount = 0;
      }
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.hideUISubscription) {
      this.hideUISubscription.unsubscribe();
    }
  }
}
