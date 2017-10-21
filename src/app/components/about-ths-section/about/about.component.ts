import { Component, OnInit } from '@angular/core';
import { PagesService } from '../../../services/wordpress/pages.service';
import { MenusService } from '../../../services/wordpress/menus.service';
import {Page} from '../../../interfaces/page';
import { Router, ActivatedRoute, Params} from '@angular/router';
import {RemoveLangParamPipe} from '../../../pipes/remove-lang-param.pipe';

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
  private removeLangParamPipe: any;

  constructor(private pagesService: PagesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private menusService: MenusService) {
    this.removeLangParamPipe = new RemoveLangParamPipe();
  }

  goToPage(slug): void {
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
      console.log(params['lang']);
      this.slug = params['slug'];
      if (typeof this.slug === 'undefined') {
        this.slug = 'about-ths';
      }

      if (this.slug !== 'about-ths') {
        this.activatedRoute.parent.params.subscribe((params2: Params) => {
          this.lang = params2['lang'];
          console.log(this.lang);
          if (typeof this.lang === 'undefined') {
            this.lang = 'en';
          }
          this.getSecondarySubMenu();
          this.getPageBySlug();
        });
      }else {
        this.lang = params['lang'];
        if (typeof this.lang === 'undefined') {
          this.lang = 'en';
        }
        this.getSubmenu();
        this.getPageBySlug();
      }
    });
  }

}
