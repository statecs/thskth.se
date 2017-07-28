import {Component, ElementRef, OnInit, ViewChild, Injector } from '@angular/core';
import { CardCategorizerCardContainerService } from '../../services/component-communicators/card-categorizer-card-container.service';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces/appConfig';

@Component({
  selector: 'app-card-categorizer',
  templateUrl: './card-categorizer.component.html',
  styleUrls: ['./card-categorizer.component.scss']
})
export class CardCategorizerComponent implements OnInit {

  @ViewChild('switch_button') switch_button: ElementRef;
  @ViewChild('profession') profession: ElementRef;
  @ViewChild('company') company: ElementRef;
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

  protected config: AppConfig;

  constructor(private cardCategorizerCardContainerService: CardCategorizerCardContainerService, private injector: Injector) {
    this.config = injector.get(APP_CONFIG);
    this.activated_person = 0;
    this.companyIsDisabled = true;
    this.selected_profession = this.config.PROFESSION.student;
    this.selected_company = this.config.ORGANIZATION_TYPE.company;
    this.selected_interest = this.config.USER_INTEREST.student;
    this.selected_profession_name = 'student';
    this.selected_company_name = 'company';
    this.selected_interest_name = 'student';
    this.displayedDropdownID = 0;
  }

  switchPerson(): void {
    const el = this.switch_button.nativeElement;
    const profession_el = this.profession.nativeElement;
    const company_el = this.company.nativeElement;
    this.hideAllDropdown();
    if (this.activated_person === 0) {
      el.style.left = '66%';
      this.activated_person = 1;
      profession_el.style.opacity = 0.25;
      profession_el.disabled = true;
      profession_el.style.cursor = 'default';
      company_el.style.opacity = 1;
      company_el.style.cursor = 'pointer';
      this.companyIsDisabled = false;
    }else {
      el.style.left = '0px';
      this.activated_person = 0;
      profession_el.style.opacity = 1;
      profession_el.style.cursor = 'pointer';
      company_el.style.opacity = 0.25;
      company_el.disabled = true;
      company_el.style.cursor = 'default';
      this.companyIsDisabled = true;
    }
    this.updateCardsContainer();
  }

  updateCardsContainer(): void {
    let profession: number;
    let organization_type: number;
    if (!this.companyIsDisabled) {
      organization_type = this.selected_company;
      profession = 0;
    }else {
      organization_type = 0;
      profession = this.selected_profession;
    }
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

  ngOnInit() {
    this.dropdowns = this.card_categorizer.nativeElement.getElementsByClassName('dropdown-container');
  }

}
