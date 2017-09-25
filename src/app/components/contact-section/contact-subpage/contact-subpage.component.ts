import { Component, OnInit } from '@angular/core';
import { PagesService } from '../../../services/wordpress/pages.service';
import { MenusService } from '../../../services/wordpress/menus.service';
import {Page} from '../../../interfaces/page';
import { Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-contact-subpage',
  templateUrl: './contact-subpage.component.html',
  styleUrls: ['./contact-subpage.component.scss']
})
export class ContactSubpageComponent implements OnInit {

  public page: Page;
  public subMenu: any;
  public slug: string;
  //public _baseSlug: string;

  constructor(private pagesService: PagesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private menusService: MenusService) { }

  goToPage(slug): void {
    if (slug.indexOf('http://') === 0 || slug.indexOf('https://') === 0 || slug.indexOf('www.') === 0) {
      window.open(slug, '_black');
    }else {
      this.router.navigate([slug]);
    }
  }

  getSecondarySubMenu() {
    //this._baseSlug = 'contact-section/' + this.slug + '/';
    this.menusService.get_secondarySubMenu('contact', this.slug).subscribe((submenu) => {
      this.subMenu = submenu;
    });
  }

  getSubmenu() {
    //this._baseSlug = 'contact-section/';
    this.menusService.get_mainSubMenu(this.slug).subscribe((submenu) => {
      this.subMenu = submenu;
    });
  }

  getPageBySlug(slug) {
    this.pagesService.getPageBySlug(slug).subscribe((page) => {
      this.page = page;
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.slug = params['slug'];
      if (typeof this.slug === 'undefined') {
        this.slug = 'contact';
      }
      this.getPageBySlug(this.slug);
      if (this.slug !== 'contact' && this.slug !== 'faq') {
        this.getSecondarySubMenu();
      }else {
        this.getSubmenu();
      }
    });
  }

}
