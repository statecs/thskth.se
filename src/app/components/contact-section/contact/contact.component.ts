import { Component, OnInit } from '@angular/core';
import { PagesService } from '../../../services/wordpress/pages.service';
import { MenusService } from '../../../services/wordpress/menus.service';
import {Page} from '../../../interfaces/page';
import { Router, ActivatedRoute, Params} from '@angular/router';
import {RemoveLangParamPipe} from '../../../pipes/remove-lang-param.pipe';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  public page: Page;
  public subMenu: any;
  public slug: string;
  //public _baseSlug: string;
  private lang: string;
  private removeLangParamPipe: any;

  constructor(private pagesService: PagesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private menusService: MenusService) {
    this.removeLangParamPipe = new RemoveLangParamPipe();
  }

  goToPage(slug): void {
    console.log(slug);
    if (slug.indexOf('http://') === 0 || slug.indexOf('https://') === 0 || slug.indexOf('www.') === 0) {
      window.open(slug, '_black');
    }else {
      if (this.lang === 'sv') {
        slug = this.removeLangParamPipe.transform(slug);
      }
      this.router.navigate([slug]);
    }
  }

  getSecondarySubMenu() {
    //this._baseSlug = 'contact-section/' + this.slug + '/';
    this.menusService.get_secondarySubMenu('contact', this.slug, this.lang).subscribe((submenu) => {
      this.subMenu = submenu;
    });
  }

  getSubmenu() {
    //this._baseSlug = 'contact-section/';
    this.menusService.get_mainSubMenu(this.slug).subscribe((submenu) => {
      this.subMenu = submenu;
    });
  }

  getPageBySlug() {
    console.log(this.slug + this.lang);
    this.pagesService.getPageBySlug(this.slug, this.lang).subscribe((page) => {
      this.page = page;
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.slug = params['slug'];
      if (typeof this.slug === 'undefined') {
        this.slug = 'contact';
      }
      this.lang = params['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }
      this.getPageBySlug();
      if (this.slug !== 'contact' && this.slug !== 'faq') {
        this.getSecondarySubMenu();
      }else {
        this.getSubmenu();
      }
    });
  }

}
