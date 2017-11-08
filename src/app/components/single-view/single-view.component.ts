import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import { Page } from '../../interfaces/page';
import { PagesService } from '../../services/wordpress/pages.service';
import { Router, ActivatedRoute, Params} from '@angular/router';
import {NotificationBarCommunicationService} from '../../services/component-communicators/notification-bar-communication.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-single-view',
  templateUrl: './single-view.component.html',
  styleUrls: ['./single-view.component.scss']
})
export class SingleViewComponent implements OnInit, OnDestroy {

  @Input() page: Page;
  private lang: string;
  public loading: boolean;
  public pageNotFound: boolean;
  public parent_slug: string;
  public slug: string;
  public paramsSubscription: Subscription;
  public parentParamsSubscription: Subscription;
  public pageSubscription: Subscription;
  public pageSubscription2: Subscription;
  public pageSubscription3: Subscription;
  public parent_parent_slug: string;

  constructor(private pagesService: PagesService,
              private activatedRoute: ActivatedRoute,
              private notificationBarCommunicationService: NotificationBarCommunicationService) {
    this.loading = true;
    this.pageNotFound = false;
  }

    getParentParentPageBySlug() {
        this.pageSubscription = this.pagesService.getPageBySlug(this.parent_parent_slug, this.lang).subscribe((page) => {
                console.log(page);
                if (page) {
                    this.getParentPageBySlug();
                }else {
                    this.loading = false;
                    this.pageNotFound = true;
                }
            },
            (error) => {
                this.notificationBarCommunicationService.send_data(error);
            });
    }

  getParentPageBySlug() {
    this.pageSubscription2 = this.pagesService.getPageBySlug(this.parent_slug, this.lang).subscribe((page) => {
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
    this.pageSubscription3 = this.pagesService.getPageBySlug(this.slug, this.lang).subscribe((page) => {
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
    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      if (typeof params['single_page_slug'] === 'undefined') {
          this.parent_slug = params['subpage'];
          this.slug = params['slug'];
      }else {
          this.parent_slug = params['slug'];
          this.slug = params['single_page_slug'];
      }
      this.parentParamsSubscription = this.activatedRoute.parent.params.subscribe((params2: Params) => {
        this.lang = params2['lang'];
        if (typeof params['single_page_slug'] === 'undefined') {
          this.lang = 'en';
          this.parent_parent_slug =  params2['lang'];
        }else {
          this.parent_parent_slug =  params['subpage'];
        }
        console.log(this.parent_parent_slug);
        if (typeof this.lang === 'undefined') {
          this.lang = 'en';
        }
        if (this.parent_parent_slug) {
            this.getParentParentPageBySlug();
        }else {
            this.getParentPageBySlug();
        }
      });

    });
  }

    ngOnDestroy() {
        if (this.paramsSubscription) {
            this.paramsSubscription.unsubscribe();
        }
        if (this.parentParamsSubscription) {
            this.parentParamsSubscription.unsubscribe();
        }
        if (this.pageSubscription) {
            this.pageSubscription.unsubscribe();
        }
        if (this.pageSubscription2) {
            this.pageSubscription2.unsubscribe();
        }
        if (this.pageSubscription3) {
            this.pageSubscription3.unsubscribe();
        }
    }


}
