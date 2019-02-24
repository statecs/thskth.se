import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, RoutesRecognized} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {ChapterMenu, ChaptersMenuService} from '../../../services/wordpress/chapters-menu.service';
import {NotificationBarCommunicationService} from '../../../services/component-communicators/notification-bar-communication.service';

@Component({
  selector: 'app-navbar-sections',
  templateUrl: './navbar-sections.component.html',
  styleUrls: ['./navbar-sections.component.scss']
})
export class NavbarSectionsComponent implements OnInit, OnDestroy {
  public ths_chapters: ChapterMenu[];
  public lang: string;
  public paramsSubscription: Subscription;
    public chaptersMenuSubscription: Subscription;

  constructor(private router: Router,
              private chaptersMenuService: ChaptersMenuService,
              private notificationBarCommunicationService: NotificationBarCommunicationService) {
    this.paramsSubscription = this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        this.lang = val.state.root.firstChild.params['lang'];
        if (typeof this.lang === 'undefined') {
            this.lang = val.state.root.firstChild.data['lang'];
            if (!this.lang) {
                this.lang = 'en';
            }
        }else if (this.lang !== 'en' && this.lang !== 'sv') {
          this.lang = 'en';
        }
        this.getChapterMenu();
      }
    });
  }

    private getChapterMenu(): void {
        this.chaptersMenuSubscription = this.chaptersMenuService.getMenu(this.lang).subscribe((ths_chapters: ChapterMenu[]) => {
                this.ths_chapters = ths_chapters;
            },
            (error) => {
                this.notificationBarCommunicationService.send_data(error);
            });
    }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.chaptersMenuSubscription) {
        this.chaptersMenuSubscription.unsubscribe();
    }
  }

}
