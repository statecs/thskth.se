import { Component, OnInit, Input } from '@angular/core';
import { Page } from '../../interfaces/page';
import { PagesService } from '../../services/wordpress/pages.service';
import { Router, ActivatedRoute, Params} from '@angular/router';
import {NotificationBarCommunicationService} from '../../services/component-communicators/notification-bar-communication.service';

@Component({
  selector: 'app-single-view',
  templateUrl: './single-view.component.html',
  styleUrls: ['./single-view.component.scss']
})
export class SingleViewComponent implements OnInit {

  @Input() page: Page;
  private lang: string;
  public loading: boolean;
  public pageNotFound: boolean;
  public parent_slug: string;
  public slug: string;

  constructor(private pagesService: PagesService,
              private activatedRoute: ActivatedRoute,
              private notificationBarCommunicationService: NotificationBarCommunicationService) {
    this.loading = true;
    this.pageNotFound = false;
  }

  getParentPageBySlug() {
    this.pagesService.getPageBySlug(this.parent_slug, this.lang).subscribe((page) => {
          console.log(page);
          if (page) {
            this.getPageBySlug();
          }else {
            this.loading = false;
            this.pageNotFound = true;
          }
        },
        (error) => {
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  getPageBySlug() {
    this.pagesService.getPageBySlug(this.slug, this.lang).subscribe((page) => {
          this.loading = false;
          console.log(page);
          if (page) {
            this.page = page;
          }else {
            this.pageNotFound = true;
          }
        },
        (error) => {
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.parent_slug = params['slug'];
      this.slug = params['single_page_slug'];
      this.activatedRoute.parent.params.subscribe((params2: Params) => {
        this.lang = params2['lang'];
        console.log(this.lang);
        if (typeof this.lang === 'undefined') {
          this.lang = 'en';
        }
        this.getParentPageBySlug();
      });

    });
  }

}
