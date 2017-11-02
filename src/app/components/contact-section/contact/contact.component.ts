import {Component, OnInit, Pipe} from '@angular/core';
import { PagesService } from '../../../services/wordpress/pages.service';
import { MenusService } from '../../../services/wordpress/menus.service';
import {Page} from '../../../interfaces/page';
import { Router, ActivatedRoute, Params} from '@angular/router';
import {RemoveLangParamPipe} from '../../../pipes/remove-lang-param.pipe';
import {AddLangToSlugPipe} from '../../../pipes/add-lang-to-slug.pipe';
import {NotificationBarCommunicationService} from '../../../services/component-communicators/notification-bar-communication.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  public page: Page;
  public subMenu: any;
  public slug: string;
  private lang: string;
  private removeLangParamPipe: RemoveLangParamPipe;
  private addLangToSlugPipe: AddLangToSlugPipe;

  constructor(private pagesService: PagesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private menusService: MenusService,
              private notificationBarCommunicationService: NotificationBarCommunicationService) {
    this.removeLangParamPipe = new RemoveLangParamPipe();
    this.addLangToSlugPipe = new AddLangToSlugPipe();
  }

  goToPage(slug): void {
    console.log(slug);
    if (slug.indexOf('http://') === 0 || slug.indexOf('https://') === 0 || slug.indexOf('www.') === 0) {
      window.open(slug, '_black');
    }else {
      if (this.lang === 'sv') {
        slug = this.removeLangParamPipe.transform(slug);
      }
      slug = this.addLangToSlugPipe.transform(slug, this.lang);
      this.router.navigate([slug]);
    }
  }

  getSecondarySubMenu() {
    this.menusService.get_secondarySubMenu('contact', this.slug, this.lang).subscribe((submenu) => {
          this.subMenu = submenu;
        },
        (error) => {
          console.log(error);
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  getSubmenu() {
    this.menusService.get_mainSubMenu(this.slug, this.lang).subscribe((submenu) => {
          this.subMenu = submenu;
        },
        (error) => {
          console.log(error);
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  getPageBySlug() {
    console.log(this.slug + this.lang);
    this.pagesService.getPageBySlug(this.slug, this.lang).subscribe((page) => {
        this.page = page;
      },
      (error) => {
        console.log(error);
        this.notificationBarCommunicationService.send_data(error);
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
