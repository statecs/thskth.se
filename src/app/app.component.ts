import {Component, ElementRef, ViewChild, Inject} from '@angular/core';
import { AppCommunicationService } from './services/component-communicators/app-communication.service';
import { DOCUMENT } from '@angular/common';
import {Title} from '@angular/platform-browser';
import {TitleCommunicationService} from './services/component-communicators/title-communication.service';
import {HideUICommunicationService} from './services/component-communicators/hide-ui-communication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('page') page: ElementRef;
  private scrollTop: number;
  public online: boolean = navigator.onLine;
  public no_internet: boolean;

  constructor( private appCommunicationService: AppCommunicationService,
               @Inject(DOCUMENT) private document: Document,
               private hideUICommunicationService: HideUICommunicationService,
               private titleService: Title,
               private titleCommunicationService: TitleCommunicationService) {
    window.addEventListener('online', () => {this.online = true; });
    window.addEventListener('offline', () => {this.online = false; });
    this.checkInternet();
    this.appCommunicationService.notifyObservable$.subscribe((arg) => {
      if (this.page) {
        const pageStyle = this.page.nativeElement.style;
        console.log('scroll');
        if (arg === 'collapse') {
          this.scrollTop = (document.body.scrollTop || window.pageYOffset);
          pageStyle.top = '-' + this.scrollTop + 'px';
          pageStyle.position = 'fixed';
          /*window.scrollTo(0, 0);*/
        }else if (arg === 'show') {
          pageStyle.position = 'relative';
          pageStyle.top = '0';
          const self = this;
          /*setTimeout(function () {
            window.scrollTo(0, self.scrollTop);
          }, 3);*/
        }
      }
    });
    this.titleCommunicationService.notifyObservable$.subscribe((title) => {
      this.setTitle(title);
    });
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  checkInternet(): void {
    if (!this.online) {
      this.no_internet = true;
    }else {
      this.no_internet = false;
    }
  }

  hideAllInfoBox(): void {
    this.checkInternet();
    this.hideUICommunicationService.hideOverlappingElements();
  }
}
