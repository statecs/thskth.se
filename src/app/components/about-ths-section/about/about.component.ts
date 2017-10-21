import { Component, OnInit } from '@angular/core';
import { PagesService } from '../../../services/wordpress/pages.service';
import { MenusService } from '../../../services/wordpress/menus.service';
import {Page} from '../../../interfaces/page';
import { Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  public page: Page;
  public subMenu: any;
  public slug: string;
  //public _baseSlug: string;
  private lang: string;

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
    //this._baseSlug = 'student-life/' + this.slug + '/';
    this.menusService.get_secondarySubMenu('about-ths', this.slug, this.lang).subscribe((submenu) => {
      this.subMenu = submenu;
      console.log(this.subMenu);
    });
  }

  getSubmenu() {
    //this._baseSlug = 'student-life/';
    this.menusService.get_mainSubMenu(this.slug, this.lang).subscribe((submenu) => {
      this.subMenu = submenu;
    });
  }

  getPageBySlug() {
    this.pagesService.getPageBySlug(this.slug, this.lang).subscribe((page) => {
      this.page = page;
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.slug = params['slug'];
      if (typeof this.slug === 'undefined') {
        this.slug = 'about-ths';
      }
      this.lang = params['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }
      this.getPageBySlug();
      console.log(this.slug);
      if (this.slug !== 'about-ths') {
        this.getSecondarySubMenu();
      }else {
        this.getSubmenu();
      }
    });
  }

}
