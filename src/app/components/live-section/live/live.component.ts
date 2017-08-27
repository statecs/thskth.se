import { Component, OnInit } from '@angular/core';
import { PagesService } from '../../../services/wordpress/pages.service';
import { MenusService } from '../../../services/wordpress/menus.service';
import {Page} from '../../../interfaces/page';
import { Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent implements OnInit {

  public page: Page;
  public subMenu: any;
  public slug: string;
  //public _baseSlug: string;

  constructor(private pagesService: PagesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private menusService: MenusService) { }

  goToPage(slug): void {
    console.log(slug);
    if (slug.indexOf('http://') === 0 || slug.indexOf('https://') === 0 || slug.indexOf('www.') === 0) {
      window.open(slug, '_black');
    }else {
      this.router.navigate([slug]);
    }
  }

  getSecondarySubMenu() {
    //this._baseSlug = 'student-life/' + this.slug + '/';
    this.menusService.get_secondarySubMenu('live', this.slug).subscribe((submenu) => {
      this.subMenu = submenu;
      console.log(this.subMenu);
    });
  }

  getSubmenu() {
    //this._baseSlug = 'student-life/';
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
        this.slug = 'live';
      }
      this.getPageBySlug(this.slug);
      if (this.slug !== 'live') {
        this.getSecondarySubMenu();
      }else {
        this.getSubmenu();
      }
    });
  }

}
