import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

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

  public selected_profession: string;
  public selected_company: string;
  public selected_interest: string;

  constructor() {
    this.activated_person = 0;
    this.companyIsDisabled = true;
    this.selected_profession = 'student';
    this.selected_company = 'company';
    this.selected_interest = 'student';
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
  }

  toggleDropdown(param): void {
    if (this.displayedDropdown) {
      this.hideAllDropdown();
      this.displayedDropdown = false;
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

  updateFiltering(type, e): void {
    const el = e.target;
    console.log(el.innerHTML);
    if (type === 'profession') {
      this.selected_profession = el.innerHTML;
    }else if (type === 'company') {
      this.selected_company = el.innerHTML;
    }else if (type === 'interest') {
      this.selected_interest = el.innerHTML;
    }
  }

  ngOnInit() {
    this.dropdowns = this.card_categorizer.nativeElement.getElementsByClassName('dropdown-container');
  }

}
