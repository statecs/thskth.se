import {
  Component,
  ElementRef,
  ViewChild,
  Injector,
  AfterViewInit,
  OnDestroy
} from "@angular/core";
import { CardCategorizerCardContainerService } from "../../services/component-communicators/card-categorizer-card-container.service";
import { APP_CONFIG } from "../../app.config";
import { AppConfig } from "../../interfaces-and-classes/appConfig";
import { CookieService, CookieOptions } from "ngx-cookie";
import { CardsService } from "../../services/wordpress/cards.service";
import { CardCategory } from "../../interfaces-and-classes/card";
import { ActivatedRoute } from "@angular/router";
import { SelectSliderCommunicationService } from "../../services/component-communicators/select-slider-communication.service";
import { Subscription } from "rxjs/Subscription";
import { HideUICommunicationService } from "../../services/component-communicators/hide-ui-communication.service";
import { NotificationBarCommunicationService } from "../../services/component-communicators/notification-bar-communication.service";

@Component({
  selector: "app-card-categorizer",
  templateUrl: "./card-categorizer.component.html",
  styleUrls: ["./card-categorizer.component.scss"]
})
export class CardCategorizerComponent implements AfterViewInit, OnDestroy {
  @ViewChild("card_categorizer") card_categorizer: ElementRef;

  public displayedDropdown: boolean;
  public displayedDropdownID: number;
  public dropdowns: any;
  public fetching: boolean;

  public selected_interest: number;

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

  constructor(
    private cardCategorizerCardContainerService: CardCategorizerCardContainerService,
    private injector: Injector,
    private _cookieService: CookieService,
    private cardsService: CardsService,
    private route: ActivatedRoute,
    private selectSliderCommunicationService: SelectSliderCommunicationService,
    private hideUICommunicationService: HideUICommunicationService,
    private notificationBarCommunicationService: NotificationBarCommunicationService
  ) {
    this.config = injector.get(APP_CONFIG);
    this.displayedDropdownID = 0;
    this.cards_filter = this._cookieService.getObject("cards_filter");
    this.lang = route.snapshot.data["lang"];
    this.infoBoxClickCount = 0;
    this.prof_selectedIndex = 0;
    this.inter_selectedIndex = 0;
  }

  showSelectSlider(items, type): void {
    const data = {
      type: type,
      items: items
    };
    this.selectSliderCommunicationService.showSelectSlider(data);
  }

  updateCardsContainer(): void {
    let exp = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    let cookieOptions = { expires: exp } as CookieOptions;
    this.cards_filter = this._cookieService.putObject(
      "cards_filter",
      {
        interest: this.selected_interest
      },
      cookieOptions
    );
    this.cardCategorizerCardContainerService.updateCards({
      interest: this.selected_interest
    });
  }

  toggleDropdown(param): void {
    this.infoBoxClickCount += 1;
    if (this.displayedDropdown) {
      this.hideAllDropdown();
      this.displayedDropdown = false;
    } else {
      this.dropdowns[param - 1].style.display = "block";
      this.displayedDropdown = true;
    }
    if (this.displayedDropdownID !== param) {
      this.dropdowns[param - 1].style.display = "block";
      this.displayedDropdown = true;
    }
    this.displayedDropdownID = param;
  }

  hideAllDropdown(): void {
    for (let i = 0; i < this.dropdowns.length; i++) {
      this.dropdowns[i].style.display = "none";
    }
  }

  updateFiltering(type, e, id, index): void {
    const el = e.target;
    if (type === "interest") {
      this.selected_interest = id;
      this.selected_interest_name = el.innerHTML;
      this.inter_selectedIndex = index;
    }
    this.updateCardsContainer();
  }

  ngOnInit() {
    this.fetching = true;
  }
  ngAfterViewInit() {
    this.dropdowns = this.card_categorizer.nativeElement.getElementsByClassName(
      "dropdown-container"
    );

    if (
      typeof this.cards_filter === "undefined" ||
      (Object.keys(this.cards_filter).length === 0 &&
        this.cards_filter.constructor === Object)
    ) {
      this.cardsService.getCardCategory("interest", this.lang).subscribe(
        int_cats => {
          this.fetching = false;
          this.int_cats = int_cats;
          this.selected_interest_name = int_cats[0].name;
          this.selected_interest = int_cats[0].id;
          let exp = new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          );
          let cookieOptions = { expires: exp } as CookieOptions;
          this._cookieService.putObject(
            "cards_filter",
            {
              interest: this.selected_interest
            },
            cookieOptions
          );
          this.cardCategorizerCardContainerService.updateCards({
            interest: this.selected_interest
          });
        },
        error => {
          this.notificationBarCommunicationService.send_data(error);
        }
      );
    } else {
      this.cards_filter = this._cookieService.getObject("cards_filter");
      this.selected_interest = this.cards_filter.interest;
      this.cardsService
        .getCardCategoryByID(this.selected_interest, "interest", this.lang)
        .subscribe(
          cat => {
            this.fetching = false;
            this.selected_interest_name = cat.name;
          },
          error => {
            this.notificationBarCommunicationService.send_data(error);
          }
        );
      this.cardsService.getCardCategory("interest", this.lang).subscribe(
        int_cats => {
          this.int_cats = int_cats;
          this.cardCategorizerCardContainerService.updateCards({
            interest: this.selected_interest
          });
        },
        error => {
          this.notificationBarCommunicationService.send_data(error);
        }
      );
    }

    this.selectSliderCommunicationService.transmitNotifyObservable$.subscribe(
      data => {
        if (data.type === "interest") {
          this.selected_interest_name = data.item.name;
          this.selected_interest = data.item.id;
        }
        this.cardCategorizerCardContainerService.updateCards({
          interest: this.selected_interest
        });
      }
    );

    this.hideUISubscription = this.hideUICommunicationService.hideUIObservable$.subscribe(
      event => {
        if (this.infoBoxClickCount === 0) {
          this.hideAllDropdown();
          this.infoBoxClickCount += 1;
          this.displayedDropdown = false;
        } else {
          this.infoBoxClickCount = 0;
        }
      }
    );
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
