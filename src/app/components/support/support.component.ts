import {Component, OnInit, ElementRef, Renderer2, ViewChild} from '@angular/core';
import { FaqsService } from '../../services/wordpress/faqs.service';
import { FAQ, FAQCategory, FAQSubMenu } from '../../interfaces/faq';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { most_asked_questions } from '../../utils/most-asked-questions';
import {Location} from '@angular/common';
import {PopupWindowCommunicationService} from '../../services/component-communicators/popup-window-communication.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
    @ViewChild('searchField') searchField: ElementRef;

  public parent_categories: FAQCategory[];
  public selected_category: FAQCategory;
  public selected_cat_index: number;
  public faq_subMenus: FAQSubMenu[];
  public faqs: FAQ[];
  public search_results: FAQ[];
  public showFaqs: boolean;
  public loading: boolean;
  public noResult: boolean;
  public searchTerm: string;
  public noInput: boolean;
  public searchOnActive: boolean;
  public selected_cat_slug: string;
    public most_asked_faqs: FAQ[];
    public most_asked_questions_slugs: string[];
    public show_single_view: boolean;

  constructor(private faqsService: FaqsService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private renderer: Renderer2,
              private location: Location,
              private popupWindowCommunicationService: PopupWindowCommunicationService ) {
    this.selected_cat_index = 0;
    this.showFaqs = true;
    this.loading = true;
    this.faqs = [];
    this.faq_subMenus = [];
    this.noResult = false;
    this.search_results = [];
    this.searchTerm = '';
    this.noInput = false;
      this.most_asked_questions_slugs = most_asked_questions;
      this.parent_categories = [];
      this.most_asked_faqs = [];
      this.show_single_view = false;
  }

    showInPopup(faq: FAQ) {
        this.popupWindowCommunicationService.showFaqInPopup(faq);
    }

  onFocus(): void {
      this.noInput = false;
      this.noResult = false;
  }

  searchFAQs(): void {
      this.show_single_view = true;
      this.location.go('support?q=' + this.searchTerm);
      if (this.searchTerm === '') {
          this.searchTerm = '';
          this.noInput = true;
          this.search_results = [];
      }else {
          this.searchOnActive = true;
          this.selected_cat_index = null;
          this.selected_category = null;
          this.loading = true;
          this.faqsService.searchFAQs(this.searchTerm).subscribe((faqs) => {
              this.search_results = faqs;

              this.loading = false;
              if (faqs.length === 0 && this.faq_subMenus.length === 0) {
                  this.noResult = true;
              }
          });
      }
  }

  toggleAnswer(faq: any): void {
    const el_answer = faq.lastChild.previousSibling;
    const el_toggleBtn = faq.firstChild.nextSibling;
    if (el_answer.getAttribute('data-collapsed') === 'true') {
      el_toggleBtn.innerHTML = '-';
      this.expandElement(el_answer);
    }else {
      el_toggleBtn.innerHTML = '+';
      this.collapseElement(el_answer);
    }
  }

  expandElement(element) {
    element.style.display = 'block';
    // get the height of the element's inner content, regardless of its actual size
    const sectionHeight = element.scrollHeight;
    // have the element transition to the height of its inner content
    element.style.height = sectionHeight + 'px';
    element.setAttribute('data-collapsed', 'false');
  }

  collapseElement(element) {
    element.style.height = '0';
    element.setAttribute('data-collapsed', 'true');
    setTimeout(function(){
      element.style.display = 'none';
    }, 500);
  }

  displayCategory(index): void {
      this.selected_cat_index = index;
      this.selected_category = this.parent_categories[index];
      this.router.navigate(['support/' + this.parent_categories[index].slug]);
      //this.router.navigate(['contact-section/faq'], { queryParams: { category: this.parent_categories[index].slug } });
      /*this.search_results = [];
      this.searchOnActive = false;
      if (!this.selected_category || this.selected_category.id !== this.parent_categories[index].id) {
          this.support = [];
          this.faq_subMenus = [];
          this.showFaqs = false;
          this.loading = true;
          this.selected_cat_index = index;
          this.selected_category = this.parent_categories[index];
          this.getFAQs_ByParentCategory(this.selected_category.id);
      }*/
  }

    getFAQs_ByCategoryID(catID): void {
        this.faqsService.getFAQs_ByCategoryID(catID).subscribe((faqs) => {
            this.faqs = faqs;
            this.showFaqs = true;
            this.loading = false;
            if (faqs.length === 0 && this.faq_subMenus.length === 0) {
                this.noResult = true;
            }
        });
    }

  getFAQs_ByParentCategory(parentId): void {
    this.faqsService.getSubMenus_ByParentCategory(parentId).subscribe((faq_subMenus) => {
        this.faq_subMenus = faq_subMenus;
        this.getFAQs_ByCategoryID(parentId);
    });
  }

  loadFAQs(): void {
      /*if (this.parent_categories) {
          console.log(this.parent_categories);
          this.search_results = [];
          this.searchOnActive = false;
          if (!this.selected_category || this.selected_category.id !== this.parent_categories[this.selected_cat_index].id) {
              this.support = [];
              this.faq_subMenus = [];
              this.showFaqs = false;
              this.loading = true;
              this.selected_category = this.parent_categories[this.selected_cat_index];
              this.getFAQs_ByParentCategory(this.selected_category.id);
          }
      }else {*/
          this.faqs = [];
          this.faq_subMenus = [];
          this.showFaqs = false;
          this.loading = true;
          this.faqsService.getFAQParentCategories().subscribe((categories) => {
              this.parent_categories = categories;
              console.log(categories);

              if (this.selected_cat_slug) {
                  for (let i = 0; i < categories.length; i++) {
                      if (categories[i].slug === this.selected_cat_slug) {
                          this.selected_category = categories[i];
                          this.selected_cat_index = i;
                      }
                  }
              }else {
                  this.selected_category = categories[0];
              }
              this.getFAQs_ByParentCategory(this.selected_category.id);
          });
      //}
  }

  getFAQParentCategories(): void {
      this.faqs = [];
      this.faq_subMenus = [];
      this.showFaqs = false;
      this.loading = true;
      this.faqsService.getFAQParentCategories().subscribe((categories) => {
          this.parent_categories = categories;
      });
  }

  ngOnInit() {
      this.activatedRoute.params.subscribe((params: Params) => {
          this.selected_cat_slug = params['category'];
          console.log(this.selected_cat_slug);
          // console.log(params['returnUrl']);
          if (this.selected_cat_slug === 'undefined' || typeof this.selected_cat_slug === 'undefined') {
              this.getFAQParentCategories();
          }
      });

      this.activatedRoute.queryParams.subscribe((params: Params) => {
          this.searchTerm = params['q'];
          if (this.searchTerm !== 'undefined' && typeof this.searchTerm !== 'undefined') {
              console.log(this.selected_cat_slug);
              if (this.selected_cat_slug === 'undefined' || typeof this.selected_cat_slug === 'undefined') {
                  console.log('pass2');
                  this.show_single_view = true;
                  this.searchFAQs();
              }else {
                  this.show_single_view = true;
                  this.loadFAQs();
              }
          }else {
              if (this.selected_cat_slug !== 'undefined' && typeof this.selected_cat_slug !== 'undefined') {
                  this.show_single_view = true;
                  this.loadFAQs();
              }else {
                  this.show_single_view = false;
              }
          }
      });

      this.faqsService.getFAQs_BySlug(this.most_asked_questions_slugs[0]).subscribe((faq) => {
          const faqs: FAQ[] = [];
          faqs.push(faq);
          this.faqsService.getFAQs_BySlug(this.most_asked_questions_slugs[1]).subscribe((faq2) => {
              faqs.push(faq2);
              this.faqsService.getFAQs_BySlug(this.most_asked_questions_slugs[2]).subscribe((faq3) => {
                  faqs.push(faq3);

                  this.most_asked_faqs = faqs;
              });
          });
      });

      const self = this;
      const timer = setInterval(function () {
          console.log(self.searchField);
          if (self.searchField) {
              console.log('support');
              clearInterval(timer);
              self.renderer.listen(self.searchField.nativeElement, 'search', () => {
                  console.log(self.searchTerm);
                  if (self.searchTerm === '') {
                      console.log('support');
                      if (this.selected_cat_slug !== 'undefined' && typeof this.selected_cat_slug !== 'undefined') {
                          self.router.navigate(['/support']);
                      }else {
                          self.location.go('/support');
                          self.show_single_view = false;
                          self.router.navigate(['/support']);
                      }

                      //self.showResults = false;
                  }
              });
          }
      }, 100);
  }

}
