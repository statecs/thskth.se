import {Component, ElementRef, OnInit, ViewChild, Injector, AfterViewInit, AfterViewChecked } from '@angular/core';
import { CardCategorizerCardContainerService } from '../../services/component-communicators/card-categorizer-card-container.service';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces/appConfig';
import { CookieService } from 'ngx-cookie';
import { CardsService } from '../../services/wordpress/cards.service';
import { CardCategory } from '../../interfaces/card';
import {ActivatedRoute} from '@angular/router';
import {SelectSliderCommunicationService} from '../../services/component-communicators/select-slider-communication.service';

@Component({
  selector: 'app-card-categorizer',
  templateUrl: './card-categorizer.component.html',
  styleUrls: ['./card-categorizer.component.scss']
})
export class CardCategorizerComponent implements AfterViewInit {

  //@ViewChild('switch_button') switch_button: ElementRef;
  @ViewChild('profession') profession: ElementRef;
  //@ViewChild('company') company: ElementRef;
  @ViewChild('card_categorizer') card_categorizer: ElementRef;

  public activated_person: number;
  public companyIsDisabled: boolean;
  public displayedDropdown: boolean;
  public displayedDropdownID: number;
  public dropdowns: any;

  public selected_profession: number;
  public selected_company: number;
  public selected_interest: number;

  public selected_profession_name: string;
  public selected_company_name: string;
  public selected_interest_name: string;

  public org_cats: CardCategory[];
  public pro_cats: CardCategory[];
  public int_cats: CardCategory[];

  protected config: AppConfig;
  private cards_filter: any;

  constructor(private cardCategorizerCardContainerService: CardCategorizerCardContainerService,
              private injector: Injector,
              private _cookieService: CookieService,
              private cardsService: CardsService,
              private route: ActivatedRoute,
              private selectSliderCommunicationService: SelectSliderCommunicationService) {
    this.config = injector.get(APP_CONFIG);
    this.displayedDropdownID = 0;
    this.companyIsDisabled = true;
    this.cards_filter = this._cookieService.getObject('cards_filter');
    if (typeof this.cards_filter !== 'undefined') {
      this.companyIsDisabled = this.cards_filter.companyIsDisabled;
    }
  }

  showSelectSlider(items, type): void {
    const data = {
      type: type,
      items: items
    };
    this.selectSliderCommunicationService.showSelectSlider(data);
  }

  switchPerson(): void {
    this.hideAllDropdown();
    if (this.companyIsDisabled) {
      this.switchRight();
      this.companyIsDisabled = false;
    }else {
      this.switchLeft();
      this.companyIsDisabled = true;
    }
    this.updateCardsContainer();
  }

  switchLeft(): void {
    //const el = this.switch_button.nativeElement;
    const profession_el = this.profession.nativeElement;
    //const company_el = this.company.nativeElement;
    //el.style.left = '0px';
    profession_el.style.opacity = 1;
    profession_el.style.cursor = 'pointer';
    /*company_el.style.opacity = 0.25;
    company_el.disabled = true;
    company_el.style.cursor = 'default';*/
  }

  switchRight(): void {
    //const el = this.switch_button.nativeElement;
    const profession_el = this.profession.nativeElement;
    //const company_el = this.company.nativeElement;
    //el.style.left = '66%';
    profession_el.style.opacity = 0.25;
    profession_el.disabled = true;
    profession_el.style.cursor = 'default';
    /*company_el.style.opacity = 1;
    company_el.style.cursor = 'pointer';*/
  }

  updateCardsContainer(): void {
    let profession: number;
    let organization_type: number;
    if (!this.companyIsDisabled) {
      organization_type = this.selected_company;
      profession = this.selected_profession;
    }else {
      organization_type = this.selected_company;
      profession = this.selected_profession;
    }
    this.cards_filter = this._cookieService.putObject('cards_filter', {profession: profession, organization_type: organization_type, interest: this.selected_interest, companyIsDisabled: this.companyIsDisabled});
    this.cardCategorizerCardContainerService.updateCards({profession: profession, organization_type: organization_type, interest: this.selected_interest});
  }

  toggleDropdown(param): void {
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

  updateFiltering(type, e, id): void {
    const el = e.target;
    if (type === 'profession') {
      this.selected_profession = id;
      this.selected_profession_name = el.innerHTML;
    }else if (type === 'company') {
      this.selected_company = id;
      this.selected_company_name = el.innerHTML;
    }else if (type === 'interest') {
      this.selected_interest = id;
      this.selected_interest_name = el.innerHTML;
    }
    this.updateCardsContainer();
  }

  getSelectedProfession(obj: CardCategory[]): CardCategory {
      let output: CardCategory = {id: 0, name: '', order: 0};
      obj.forEach((c) => {
         if (c.name === this.route.snapshot.data['profession']) {
             output = c;
         }
      });
      return output;
  }

  ngAfterViewInit() {
    this.dropdowns = this.card_categorizer.nativeElement.getElementsByClassName('dropdown-container');


    if (typeof this.cards_filter === 'undefined' || (Object.keys(this.cards_filter).length === 0 && this.cards_filter.constructor === Object)) {
      this.cardsService.getCardCategory('organization').subscribe((org_cats) => {
        this.org_cats = org_cats;
        this.selected_company_name = org_cats[0].name;
        this.selected_company = org_cats[0].id;
        this.cardsService.getCardCategory('profession').subscribe((pro_cats) => {
          this.pro_cats = pro_cats;
          const pro = this.getSelectedProfession(pro_cats);
          this.selected_profession_name = pro.name;
          this.selected_profession = pro.id;
          this.cardsService.getCardCategory('interest').subscribe((int_cats) => {
            this.int_cats = int_cats;
            this.selected_interest_name = int_cats[0].name;
            this.selected_interest = int_cats[0].id;
            this._cookieService.putObject('cards_filter', {profession: this.selected_profession, organization_type: this.selected_company, interest: this.selected_interest, companyIsDisabled: this.companyIsDisabled});
            this.cardCategorizerCardContainerService.updateCards({profession: this.selected_profession, organization_type: this.selected_company, interest: this.selected_interest});
          });
        });
      });
    }else {
      this.cards_filter = this._cookieService.getObject('cards_filter');
/*      this.selected_profession = this.cards_filter.profession;*/
      this.selected_company = this.cards_filter.organization_type;
      this.selected_interest = this.cards_filter.interest;
      this.cardsService.getCardCategoryByID(this.selected_company, 'organization').subscribe((cat) => {
        this.selected_company_name = cat.name;
      });
/*      this.cardsService.getCardCategoryByID(this.selected_profession, 'profession').subscribe((cat) => {
        this.selected_profession_name = cat.name;
      });*/
      this.cardsService.getCardCategoryByID(this.selected_interest, 'interest').subscribe((cat) => {
        this.selected_interest_name = cat.name;
      });
      if (this.companyIsDisabled) {
        this.switchLeft();
      }else {
        this.switchRight();
      }
      this.cardsService.getCardCategory('organization').subscribe((org_cats) => {
        this.org_cats = org_cats;
      });
      this.cardsService.getCardCategory('interest').subscribe((int_cats) => {
        this.int_cats = int_cats;
      });
        this.cardsService.getCardCategory('profession').subscribe((pro_cats) => {
            this.pro_cats = pro_cats;
            const pro = this.getSelectedProfession(pro_cats);
            this.selected_profession_name = pro.name;
            this.selected_profession = pro.id;
            this.cardCategorizerCardContainerService.updateCards({profession: this.selected_profession, organization_type: this.selected_company, interest: this.selected_interest});
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
      this.cardCategorizerCardContainerService.updateCards({profession: this.selected_profession, organization_type: this.selected_company, interest: this.selected_interest});
    });
  }

}
